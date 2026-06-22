---
tags: [java, concurrency, completable-future, async, threads]
category: java
related: [executor-service, concurrent-collections, atomics-and-volatile, thread]
---

## Description
`CompletableFuture<T>` is the composable, non-blocking evolution of `Future`. A plain
`Future` only lets you `get()` (block) or `cancel()`; `CompletableFuture` lets you
build a pipeline of dependent stages that run as results arrive, plus first-class error
handling. On the exam, know how to *start* one (`supplyAsync` vs `runAsync`), *chain*
it (`thenApply`/`thenCompose`/`thenCombine`), *handle errors* (`exceptionally`/`handle`),
and the `join()` vs `get()` exception distinction.

By default the async tasks run on the common `ForkJoinPool`; every method has an
`...Async` overload that takes an `Executor` so you can run on your own pool (often a
virtual-thread executor — see [[executor-service]]). The classic flatten trap:
`thenApply` with a function that itself returns a `CompletableFuture` gives you a
nested `CompletableFuture<CompletableFuture<T>>` — use `thenCompose` to flatten it.

## Examples

Starting a pipeline:

```java
import java.util.concurrent.*;

// supplyAsync: Supplier -> produces a value
CompletableFuture<Integer> cf = CompletableFuture.supplyAsync(() -> 6 * 7);

// runAsync: Runnable -> CompletableFuture<Void>, no value
CompletableFuture<Void> done = CompletableFuture.runAsync(() -> log("started"));

// supply on YOUR executor (e.g. virtual threads)
ExecutorService pool = Executors.newVirtualThreadPerTaskExecutor();
CompletableFuture.supplyAsync(() -> fetch(), pool);
```

Chaining stages:

| Method | Input -> Output | Use for |
|---|---|---|
| `thenApply(fn)` | `T -> U` | Transform the value |
| `thenAccept(c)` | `T -> void` | Consume the value (side effect) |
| `thenRun(r)` | `() -> void` | Run after, ignoring the value |
| `thenCompose(fn)` | `T -> CompletableFuture<U>` | Chain a dependent future (flatMap) |
| `thenCombine(other, bi)` | `(T,U) -> V` | Combine two independent futures |

```java
CompletableFuture<String> page =
    CompletableFuture.supplyAsync(() -> userId())          // CF<Integer>
        .thenApply(id -> "user-" + id)                     // transform -> CF<String>
        .thenCompose(key -> loadProfileAsync(key))         // flatten nested CF
        .thenCombine(loadSettingsAsync(),                  // merge two futures
                     (profile, settings) -> render(profile, settings));
```

Error handling:

```java
CompletableFuture.supplyAsync(() -> { throw new RuntimeException("boom"); })
    .exceptionally(ex -> "fallback")              // recover: only runs on failure
    .handle((value, ex) -> ex != null ? "err" : value)  // runs on success OR failure
    .whenComplete((value, ex) -> log(value, ex)); // observe both, does NOT transform
```

`join()` vs `get()`:

```java
cf.get();   // throws CHECKED InterruptedException + ExecutionException
cf.join();  // throws UNCHECKED CompletionException (no checked exceptions)
            // -> join() works cleanly inside lambdas / streams
```

## Related Topics
- [[executor-service]] — supply a custom `Executor` to the `...Async` variants
- [[concurrent-collections]]
- [[atomics-and-volatile]]
- [[thread]]
- `Future` (the blocking-only ancestor)
- `CompletionStage` (the interface `CompletableFuture` implements)

## Cards

```anki
START
Basic
`supplyAsync` vs `runAsync`?
Back: `supplyAsync(Supplier<T>)` produces a value -> `CompletableFuture<T>`.<br>`runAsync(Runnable)` does work with no result -> `CompletableFuture<Void>`.<br>Both default to the common `ForkJoinPool` unless you pass an `Executor`.
<!--ID: 1781902680009-->
END

START
Basic
`thenApply` vs `thenCompose` — when does the nested-future trap bite?
Back: `thenApply(fn)` maps `T -> U` (plain transform).<br>If `fn` itself returns a `CompletableFuture`, `thenApply` yields `CF<CF<U>>` (nested).<br>Use `thenCompose` (flatMap) to chain a dependent future and flatten it.
<!--ID: 1781902680016-->
END

START
Basic
`thenApply` vs `thenAccept` vs `thenRun`?
Back: `thenApply`: `T -> U`, returns the transformed value.<br>`thenAccept`: `T -> void`, consumes the value (side effect).<br>`thenRun`: `() -> void`, ignores the value entirely. Each carries less of the upstream result.
<!--ID: 1781902680021-->
END

START
Basic
You have two independent CompletableFutures and want to merge their results. API?
Back: `cf1.thenCombine(cf2, (a, b) -> combine(a, b))`.<br>Both run concurrently; the BiFunction fires once both complete.<br>(`thenCompose` is for *dependent* futures, where the second needs the first's result.)
<!--ID: 1781902680026-->
END

START
Basic
`exceptionally` vs `handle` vs `whenComplete`?
Back: `exceptionally(fn)`: runs ONLY on failure, returns a recovery value.<br>`handle((v, ex) -> ...)`: runs on success OR failure, returns a (possibly new) value.<br>`whenComplete((v, ex) -> ...)`: observes both but does NOT transform — passes the result through.
<!--ID: 1781902680030-->
END

START
Basic
`join()` vs `get()` on a CompletableFuture?
Back: `get()` throws checked `InterruptedException` + `ExecutionException`.<br>`join()` throws unchecked `CompletionException` (no checked exceptions).<br>`join()` is preferred inside lambdas/streams where checked exceptions are awkward.
<!--ID: 1781902680035-->
END

START
Basic
What do the `...Async`-suffixed variants (e.g. `thenApplyAsync`) give you?
Back: They run the callback on a separate thread instead of the completing thread.<br>An overload takes an `Executor`, so you can target your own pool (e.g. a virtual-thread executor).<br>Without `Async`, the stage may run on whatever thread completed the previous stage.
<!--ID: 1781902680042-->
END

START
Basic
A task inside `supplyAsync` throws. Where does the exception surface?
Back: The `CompletableFuture` completes exceptionally; downstream stages are skipped.<br>It surfaces at `get()` (as `ExecutionException`) or `join()` (as `CompletionException`), or in `exceptionally`/`handle`/`whenComplete`.<br>The original throwable is the `getCause()` of the wrapper.
<!--ID: 1781902680049-->
END
```

```dataviewjs
function renderCards() {
  const rendered = this.container.closest('.markdown-rendered');
  if (!rendered) return;
  const block = rendered.querySelector('code.language-anki');
  if (!block) return;
  const raw = block.innerText;
  const cards = [...raw.matchAll(/START\r?\nBasic\r?\n([\s\S]*?)(?=\r?\nEND)/g)];
  if (!cards.length) return;
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const wrap = dv.el('div', '', {cls: 'anki-cards-container'});
  block.closest('pre').replaceWith(wrap);
  cards.forEach(m => {
    const content = m[1];
    const bi = content.indexOf('\nBack:');
    if (bi === -1) return;
    const front = esc(content.slice(0, bi).trim());
    const back = esc(content.slice(bi + 6).replace(/\n<!--ID:.*?-->/g, '').trim());
    wrap.innerHTML += '<div class="anki-card">'
      + '<div class="anki-card-front">'
      + '<span class="anki-label anki-label-q">QUESTION</span>'
      + '<div class="anki-front-text">' + front + '</div>'
      + '</div>'
      + '<div class="anki-card-back">'
      + '<span class="anki-label anki-label-a">* ANSWER</span>'
      + '<div class="anki-back-text">' + back + '</div>'
      + '</div>'
      + '</div>';
  });
}

renderCards.call(this);
setTimeout(() => renderCards.call(this), 100);
setTimeout(() => renderCards.call(this), 500);
```
