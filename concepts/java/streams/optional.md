---
tags: [java, streams, optional]
category: java
related: [stream-api, collectors, functional-interfaces, lambdas-and-method-references]
---

## Description
`Optional<T>` is a container that holds either one value or nothing, designed to make "maybe absent" explicit and to push callers toward handling the empty case instead of risking a `NullPointerException`. Stream terminals like `findFirst`, `min`, `max`, and `reduce` return `Optional` precisely because the result may be absent. Constructing one matters: `Optional.of(x)` throws `NullPointerException` if `x` is null, `Optional.ofNullable(x)` returns empty for null, and `Optional.empty()` is the explicit empty.

The exam's favorite distinction is `orElse(value)` versus `orElseGet(supplier)`: `orElse` **always evaluates** its argument, even when the Optional is present, while `orElseGet` only calls its supplier when the Optional is empty (lazy). If computing the fallback is expensive or has side effects, that difference is correctness-critical. Also tested: `get()` throws `NoSuchElementException` on empty; functional transforms `map`/`flatMap`/`filter`; and the conditional consumers `ifPresent`/`ifPresentOrElse`. Anti-patterns to recognize: using `Optional` for fields, method parameters, or as a collection element type — it is intended chiefly as a **return type**.

## Examples
### Construction and access
| Call | Behavior |
| --- | --- |
| `Optional.of(x)` | NPE if `x` is null |
| `Optional.ofNullable(x)` | empty if `x` is null, else present |
| `Optional.empty()` | explicit empty |
| `get()` | value, or `NoSuchElementException` if empty |
| `orElse(other)` | value, else `other` (always evaluated) |
| `orElseGet(supplier)` | value, else `supplier.get()` (lazy) |
| `orElseThrow()` / `orElseThrow(supplier)` | value, else `NoSuchElementException` / custom |
| `isPresent()` / `isEmpty()` | boolean checks |

### orElse vs orElseGet (eager vs lazy)
```java
String expensive() { System.out.println("computing!"); return "fallback"; }

Optional<String> present = Optional.of("value");
present.orElse(expensive());      // PRINTS "computing!" — arg evaluated even though present
present.orElseGet(this::expensive); // does NOT print — supplier skipped because value present
```

### map / flatMap / filter
```java
Optional<String> name = Optional.of("  Ada  ");
int len = name.map(String::trim).map(String::length).orElse(0); // 3

// flatMap when the mapper itself returns an Optional (avoids Optional<Optional<T>>)
Optional<User> user = findUser(id);
Optional<String> email = user.flatMap(User::getEmail); // getEmail returns Optional<String>

Optional<Integer> big = Optional.of(42).filter(n -> n > 100); // Optional.empty
```

### ifPresent / ifPresentOrElse / orElseThrow
```java
Optional<String> maybe = Optional.ofNullable(lookup());
maybe.ifPresent(System.out::println);                 // run only if present
maybe.ifPresentOrElse(
    System.out::println,
    () -> System.out.println("absent"));              // present-or-else branches (Java 9+)
String must = maybe.orElseThrow(
    () -> new IllegalStateException("missing"));      // custom exception when empty
```

### Primitive optionals
```java
OptionalInt oi = IntStream.of(3, 1, 2).max();   // OptionalInt[3]
int m = oi.getAsInt();                            // 3   (NoSuchElementException if empty)
OptionalDouble od = IntStream.of(1, 2, 3).average(); // OptionalDouble[2.0]
```

## Related Topics
- [[stream-api]]
- [[collectors]]
- [[functional-interfaces]]
- [[lambdas-and-method-references]]

## Cards

```anki
START
Basic
Distinction: `orElse(x)` vs `orElseGet(supplier)` — the exam's favorite Optional trap.
Back: `orElse(x)` **always evaluates** `x`, even when the Optional is present.<br>`orElseGet(supplier)` only calls the supplier when the Optional is **empty** (lazy).<br>Use `orElseGet` when the fallback is expensive or has side effects.
<!--ID: 1781902681435-->
END

START
Basic
What's the difference between `Optional.of(x)` and `Optional.ofNullable(x)`?
Back: `Optional.of(x)` throws `NullPointerException` if `x` is null.<br>`Optional.ofNullable(x)` returns `Optional.empty()` for null, otherwise a present Optional.<br>Use `of` only when you know the value is non-null.
<!--ID: 1781902681442-->
END

START
Basic
What does `Optional.get()` do when the Optional is empty?
Back: Throws `NoSuchElementException` ("No value present").<br>Prefer `orElse`/`orElseGet`/`orElseThrow`/`ifPresent` so you handle absence explicitly.<br>Calling `get()` without first checking `isPresent()` is the classic Optional misuse.
<!--ID: 1781902681449-->
END

START
Basic
When do you use `flatMap` instead of `map` on an Optional?
Back: When the mapping function **itself returns an `Optional`**.<br>`map` would give `Optional<Optional<T>>`; `flatMap` flattens it to `Optional<T>`.<br>e.g. `user.flatMap(User::getEmail)` where `getEmail()` returns `Optional<String>`.
<!--ID: 1781902681455-->
END

START
Basic
What does `optional.filter(predicate)` return?
Back: The same Optional if it's present **and** the value matches the predicate.<br>Otherwise `Optional.empty()` (empty stays empty; non-matching becomes empty).<br>Lets you keep a value only when a condition holds.
<!--ID: 1781902681462-->
END

START
Basic
`ifPresent` vs `ifPresentOrElse` — what's the difference?
Back: `ifPresent(consumer)` runs the consumer only when present; does nothing if empty.<br>`ifPresentOrElse(consumer, emptyAction)` (Java 9+) also runs a `Runnable` for the empty case.<br>Use the two-arg form when "absent" needs its own branch.
<!--ID: 1781902681469-->
END

START
Basic
Gotcha: where should you NOT use `Optional`?
Back: Avoid `Optional` for **fields**, **method parameters**, and as **collection element types** (e.g. `List<Optional<T>>`).<br>It adds overhead, isn't `Serializable`, and muddies APIs.<br>`Optional` is intended primarily as a **return type** signaling "maybe absent."
<!--ID: 1781902681476-->
END

START
Basic
Which Optional types avoid boxing, and where do they come from?
Back: `OptionalInt`, `OptionalLong`, `OptionalDouble`.<br>They're returned by primitive-stream terminals like `IntStream.max()` and `IntStream.average()`.<br>Read them with `getAsInt`/`getAsDouble` (throws `NoSuchElementException` if empty), not `get()`.
<!--ID: 1781902681483-->
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
