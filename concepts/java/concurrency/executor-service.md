---
tags: [java, concurrency, executor-service, threads]
category: java
related: [concurrent-collections, completable-future, atomics-and-volatile, thread, race-conditions]
---

## Description
`ExecutorService` is the high-level `java.util.concurrent` abstraction for running
tasks asynchronously without hand-managing `Thread` objects. You submit work; a pool
of worker threads runs it. The `Executors` factory builds the common pool shapes.
This replaces "new Thread(r).start()" everywhere on the 1Z0-830 exam — and the exam
loves the `execute` vs `submit`, `Runnable` vs `Callable`, and `shutdown` vs
`shutdownNow` distinctions.

A `Future<T>` is the handle to a not-yet-finished result. `Future.get()` blocks until
done and — the key gotcha — rethrows any task exception wrapped in a checked
`ExecutionException`. Since Java 19 `ExecutorService extends AutoCloseable`, so
try-with-resources works (close blocks until tasks finish). Since Java 21 virtual
threads are finalized (JEP 444), and `Executors.newVirtualThreadPerTaskExecutor()`
gives one lightweight virtual thread per task — ideal for blocking I/O.

## Examples

`Executors` factory methods:

| Factory method | Pool behavior |
|---|---|
| `newFixedThreadPool(n)` | Fixed `n` threads; extra tasks queue (unbounded) |
| `newCachedThreadPool()` | Grows on demand, reuses idle threads, trims after 60s |
| `newSingleThreadExecutor()` | One thread; tasks run sequentially in order |
| `newScheduledThreadPool(n)` | Delayed / periodic tasks (`schedule`, `scheduleAtFixedRate`) |
| `newVirtualThreadPerTaskExecutor()` | One virtual thread per task (Java 21+); great for blocking I/O |

`execute` vs `submit`, and `Future`:

```java
import java.util.concurrent.*;

try (ExecutorService es = Executors.newFixedThreadPool(4)) { // Java 19+ AutoCloseable
    // execute(Runnable): fire-and-forget, returns void
    es.execute(() -> System.out.println("hi"));

    // submit(Callable): returns a Future<T>
    Future<Integer> f = es.submit(() -> 6 * 7);
    System.out.println(f.get());      // blocks -> 42
    System.out.println(f.isDone());   // true

    // submit(Runnable) -> Future<?>; get() returns null on success
    Future<?> r = es.submit(() -> System.out.println("ran"));
    r.get();                          // null

    Future<String> g = es.submit(() -> { throw new IllegalStateException("boom"); });
    try {
        g.get();                      // does NOT throw IllegalStateException directly...
    } catch (ExecutionException e) {  // ...wraps it: checked ExecutionException
        System.out.println(e.getCause()); // java.lang.IllegalStateException: boom
    }
} // try-with-resources close() = shutdown() + awaitTermination (blocks)
```

`Callable` vs `Runnable`:

```java
Runnable run = () -> doWork();          // returns void, CANNOT throw checked exceptions
Callable<String> call = () -> load();   // returns a value, MAY throw checked exceptions
```

Shutdown lifecycle:

| Method | Effect |
|---|---|
| `shutdown()` | No new tasks; lets already-submitted ones finish (graceful) |
| `shutdownNow()` | Tries to stop running tasks (interrupt) + returns the unstarted `List<Runnable>` |
| `awaitTermination(t, unit)` | Blocks up to a timeout; `true` if pool fully terminated |

```java
es.shutdown();
if (!es.awaitTermination(10, TimeUnit.SECONDS)) {
    es.shutdownNow(); // force after grace period
}
```

## Related Topics
- [[concurrent-collections]]
- [[completable-future]]
- [[atomics-and-volatile]]
- [[thread]] — the low-level primitive `ExecutorService` sits on top of
- [[race-conditions]]
- `ThreadPoolExecutor` (the configurable backing class)
- `StructuredTaskScope` (structured concurrency — still preview in Java 26)

## Cards

```anki
START
Basic
You need to run async work but want a result back from the task. Which method + return type?
Back: `submit(Callable<T>)` returns a `Future<T>`.<br>`execute(Runnable)` is fire-and-forget (returns `void`).<br>`submit` also accepts a `Runnable`, giving `Future<?>` whose `get()` returns `null`.
<!--ID: 1781902680172-->
END

START
Basic
A task submitted to an ExecutorService throws an exception. What does `future.get()` throw?
Back: A checked `ExecutionException` wrapping the original.<br>Retrieve the real cause via `e.getCause()`.<br>`get()` also throws `InterruptedException`. The wrapping is why you can't catch the task's own type directly.
<!--ID: 1781902680179-->
END

START
Basic
Runnable vs Callable — the two differences?
Back: `Callable<T>` returns a value and may throw checked exceptions.<br>`Runnable` returns `void` and cannot throw checked exceptions.<br>Pick `Callable` whenever you need a result or checked-exception propagation via `Future`.
<!--ID: 1781902680185-->
END

START
Basic
`shutdown()` vs `shutdownNow()`?
Back: `shutdown()` = graceful: refuse new tasks, finish queued ones.<br>`shutdownNow()` = interrupt running tasks and return the `List<Runnable>` never started.<br>Neither blocks; use `awaitTermination(...)` to wait for the pool to actually terminate.
<!--ID: 1781902680192-->
END

START
Basic
You see `try (ExecutorService es = Executors.newFixedThreadPool(4)) { ... }`. Valid? What does close do?
Back: Valid since Java 19 — `ExecutorService extends AutoCloseable`.<br>`close()` calls `shutdown()` then blocks until all tasks finish (re-interrupting if needed).<br>So the try block won't exit until submitted work completes.
<!--ID: 1781902680199-->
END

START
Basic
Which Executors factory for many blocking-I/O tasks, and why?
Back: `Executors.newVirtualThreadPerTaskExecutor()` (Java 21+, finalized JEP 444).<br>One lightweight virtual thread per task; blocked threads cost almost nothing.<br>A fixed platform-thread pool would starve under thousands of blocking calls.
<!--ID: 1781902680206-->
END

START
Basic
Difference between `newFixedThreadPool(n)` and `newCachedThreadPool()` when tasks pile up?
Back: Fixed: exactly `n` threads, extra tasks wait in an unbounded queue.<br>Cached: spawns new threads on demand, reuses idle ones, trims them after ~60s idle.<br>Cached can explode thread count under a burst; fixed bounds it.
<!--ID: 1781902680213-->
END

START
Basic
Which factory runs tasks one-at-a-time in submission order, and which schedules delayed/periodic work?
Back: `newSingleThreadExecutor()` — sequential, ordered, single worker.<br>`newScheduledThreadPool(n)` — `schedule()`, `scheduleAtFixedRate()`, `scheduleWithFixedDelay()`.<br>Single-thread is handy for serializing access without manual locking.
<!--ID: 1781902680220-->
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
