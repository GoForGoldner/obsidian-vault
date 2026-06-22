---
tags: [java, streams, stream-api]
category: java
related: [functional-interfaces, lambdas-and-method-references, collectors, optional]
---

## Description
A stream pipeline has three parts: a **source** (collection, array, `Stream.of`, `IntStream.range`, etc.), zero or more **intermediate** operations, and exactly one **terminal** operation. Intermediate operations are *lazy*: they return a new stream and build up a plan but do no work until the terminal operation runs. The terminal operation is *eager* — it triggers traversal and produces a value or side effect. This laziness enables *short-circuiting*: operations like `limit`, `findFirst`, and `anyMatch` can stop the pipeline early without consuming the whole source.

Streams are **single-use**. Once a terminal operation has run (or even certain intermediate setups have consumed it), reusing the stream throws `IllegalStateException: stream has already been operated upon or closed`. A stream is not a data structure and never mutates its source. Primitive streams (`IntStream`, `LongStream`, `DoubleStream`) avoid boxing and add numeric terminals like `sum()` and `average()`; converting between object and primitive streams (`mapToInt`, `boxed`, `mapToObj`) is a common exam theme. As of Java 24, `Stream.gather(...)` adds custom lazy intermediate operations via `Gatherer` (the Stream Gatherers feature, finalized — no longer preview).

## Examples
### Intermediate operations (lazy, return a `Stream`)
| Operation | Notes |
| --- | --- |
| `filter(Predicate)` | keep matching elements |
| `map(Function)` | one-to-one transform |
| `flatMap(Function)` | one-to-many; flattens a stream-of-streams |
| `distinct()` | dedupe by `equals`/`hashCode` (stateful) |
| `sorted()` / `sorted(Comparator)` | stateful; buffers all elements |
| `peek(Consumer)` | debugging side-effect; not for logic |
| `limit(n)` / `skip(n)` | short-circuiting / stateful |
| `takeWhile(Pred)` / `dropWhile(Pred)` | Java 9+; stop/skip on first failing element |

### Terminal operations (eager)
| Operation | Returns |
| --- | --- |
| `forEach(Consumer)` | `void` |
| `collect(Collector)` | reduced container |
| `reduce(...)` | `Optional<T>` or `T` (with identity) |
| `count()` | `long` |
| `min/max(Comparator)` | `Optional<T>` |
| `anyMatch/allMatch/noneMatch` | `boolean` (short-circuiting) |
| `findFirst()` / `findAny()` | `Optional<T>` (short-circuiting) |
| `toList()` | unmodifiable `List` (Java 16+) |

### Laziness, short-circuiting, single-use
```java
Stream<String> s = Stream.of("ant", "bee", "cat", "dog");
String first = s.filter(x -> { System.out.println("test " + x); return x.length() == 3; })
                .findFirst().orElse("?");
// Only prints "test ant" — findFirst short-circuits after the first match.

// s.count(); // IllegalStateException: stream has already been operated upon or closed
```

### takeWhile vs dropWhile vs filter
```java
List.of(2, 4, 6, 7, 8).stream().takeWhile(n -> n % 2 == 0).toList(); // [2, 4, 6] (stops at 7)
List.of(2, 4, 6, 7, 8).stream().dropWhile(n -> n % 2 == 0).toList(); // [7, 8]
List.of(2, 4, 6, 7, 8).stream().filter(n -> n % 2 == 0).toList();    // [2, 4, 6, 8] (checks all)
```

### Primitive streams
```java
IntStream.range(1, 4).toArray();        // [1, 2, 3]  upper bound EXCLUSIVE
IntStream.rangeClosed(1, 4).sum();      // 10         upper bound INCLUSIVE
OptionalDouble avg = IntStream.of(2, 4, 6).average(); // OptionalDouble[4.0]

Stream.of("a", "bb", "ccc").mapToInt(String::length).sum();   // 6  (Stream -> IntStream)
IntStream.rangeClosed(1, 3).mapToObj(i -> "#" + i).toList();  // [#1, #2, #3] (IntStream -> Stream)
IntStream.of(1, 2, 3).boxed().toList();                       // List<Integer> [1, 2, 3]
```

## Related Topics
- [[functional-interfaces]]
- [[lambdas-and-method-references]]
- [[collectors]]
- [[optional]]
- [[collections-framework]]

## Cards

```anki
START
Basic
What are the three parts of a stream pipeline, and which do the work?
Back: **Source** + **intermediate** ops + one **terminal** op.<br>Intermediate ops are lazy (build a plan, return a `Stream`); the terminal op is eager and triggers traversal.<br>No terminal op = no elements are ever processed.
<!--ID: 1781902681369-->
END

START
Basic
What happens if you reuse a stream after its terminal operation?
Back: `IllegalStateException: stream has already been operated upon or closed`.<br>Streams are **single-use** — get a fresh stream from the source each time.<br>Reassign or recompute `collection.stream()` rather than caching a `Stream` variable.
<!--ID: 1781902681376-->
END

START
Basic
Why does `findFirst()` after a `filter` often process fewer elements than the source has?
Back: Laziness enables **short-circuiting**.<br>`filter` is lazy, and `findFirst` stops as soon as one element passes — the rest of the source is never traversed.<br>Same for `anyMatch`/`allMatch`/`noneMatch`/`limit`.
<!--ID: 1781902681384-->
END

START
Basic
Distinguish `takeWhile(p)` from `filter(p)`.
Back: `takeWhile` keeps elements **until the first one that fails** `p`, then stops (short-circuits).<br>`filter` checks every element and keeps all that pass.<br>On `[2,4,7,8]` with even-check: `takeWhile` -> `[2,4]`, `filter` -> `[2,4,8]`.
<!--ID: 1781902681391-->
END

START
Basic
When do you reach for `flatMap` instead of `map`?
Back: When each element maps to **multiple** elements (or a stream/collection), and you want one flat stream.<br>`map` gives `Stream<List<X>>`; `flatMap(List::stream)` flattens it to `Stream<X>`.<br>Think "map then concatenate the resulting streams."
<!--ID: 1781902681398-->
END

START
Basic
What does `IntStream.range(1,4)` produce vs `rangeClosed(1,4)`?
Back: `range(1,4)` -> `1,2,3` (upper bound **exclusive**).<br>`rangeClosed(1,4)` -> `1,2,3,4` (upper bound **inclusive**).<br>Off-by-one here is a classic exam trap.
<!--ID: 1781902681406-->
END

START
Basic
How do you convert between an object `Stream` and an `IntStream`?
Back: `Stream` -> `IntStream`: `mapToInt(toIntFn)`.<br>`IntStream` -> object `Stream`: `mapToObj(fn)` or `boxed()`.<br>`boxed()` wraps `int` into `Integer`; use primitive streams to get `sum()`/`average()` without boxing.
<!--ID: 1781902681413-->
END

START
Basic
What does `IntStream.average()` return, and why not a plain `double`?
Back: `OptionalDouble` — because an **empty** stream has no average.<br>Read it with `getAsDouble()`, `orElse(0)`, etc.<br>`sum()` returns a plain `int`/`long` (empty sum is `0`), but `average`/`min`/`max` return `OptionalDouble`/`OptionalInt`.
<!--ID: 1781902681420-->
END

START
Basic
What is `peek()` for, and why shouldn't you rely on it for program logic?
Back: `peek(Consumer)` is an intermediate op meant for **debugging** (e.g. logging each element).<br>Because it's lazy and tied to traversal, elements skipped by short-circuiting are never peeked, so it's unreliable for side-effecting logic.<br>Use `forEach`/`map` for real work.
<!--ID: 1781902681427-->
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
