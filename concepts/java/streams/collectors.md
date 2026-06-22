---
tags: [java, streams, collectors]
category: java
related: [stream-api, functional-interfaces, lambdas-and-method-references, optional]
---

## Description
`collect(Collector)` is the workhorse terminal operation: it performs a mutable reduction, accumulating stream elements into a container. The `java.util.stream.Collectors` factory class supplies the common ones. The exam loves the edge cases: `toMap` throws `IllegalStateException` on **duplicate keys** unless you pass a merge function; `groupingBy` accepts a *downstream* collector to reduce each group; `partitioningBy` always produces a `Map<Boolean, …>` with **both** `true` and `false` keys present even when one side is empty.

A frequently tested distinction is `Stream.toList()` versus `collect(Collectors.toList())`. `Stream.toList()` (Java 16+) returns an **unmodifiable** list. `Collectors.toList()` makes **no guarantee** about the result's type or mutability — today it returns an `ArrayList`, but you must not depend on that; if you need a guaranteed-immutable result use `toUnmodifiableList()` (Java 10+) or `Stream.toList()`. Downstream collectors (`mapping`, `filtering`, `counting`, `summingInt`, `averagingInt`, `joining`) and the two-collector combiner `teeing` (Java 12+) round out the toolkit.

## Examples
### Common collectors
| Collector | Result |
| --- | --- |
| `toList()` / `toSet()` | `List` / `Set` (mutability not guaranteed) |
| `toUnmodifiableList()` | immutable `List` (Java 10+) |
| `toMap(keyFn, valFn)` | `Map`; throws on duplicate keys |
| `toMap(keyFn, valFn, mergeFn)` | `Map`; merge resolves dup keys |
| `groupingBy(classifier)` | `Map<K, List<T>>` |
| `groupingBy(classifier, downstream)` | `Map<K, D>` reduced per group |
| `partitioningBy(predicate)` | `Map<Boolean, List<T>>` (both keys present) |
| `joining(delim, prefix, suffix)` | `String` |
| `counting()` | `Long` |
| `summingInt` / `averagingInt` | `Integer` / `Double` |
| `mapping(fn, downstream)` | adapts elements before a downstream collector |
| `filtering(pred, downstream)` | filters before a downstream collector (Java 9+) |
| `teeing(c1, c2, merger)` | combines two collectors' results (Java 12+) |

### toMap duplicate-key trap and the merge fix
```java
var words = List.of("apple", "banana", "avocado", "cherry");
// keyed by first letter -> "apple" and "avocado" collide on 'a'
// Map<Character,String> bad = words.stream()
//     .collect(Collectors.toMap(w -> w.charAt(0), w -> w)); // IllegalStateException: Duplicate key

Map<Character, String> ok = words.stream()
    .collect(Collectors.toMap(w -> w.charAt(0), w -> w, (a, b) -> a + "," + b));
// {a=apple,avocado, b=banana, c=cherry}
```

### groupingBy with a downstream collector
```java
var words = List.of("ant", "bear", "ape", "bee", "cat");
Map<Character, Long> countByFirst = words.stream()
    .collect(Collectors.groupingBy(w -> w.charAt(0), Collectors.counting()));
// {a=2, b=2, c=1}

Map<Character, List<Integer>> lensByFirst = words.stream()
    .collect(Collectors.groupingBy(w -> w.charAt(0),
             Collectors.mapping(String::length, Collectors.toList())));
// {a=[3, 3], b=[4, 3], c=[3]}
```

### partitioningBy, joining, teeing
```java
Map<Boolean, List<Integer>> parts = Stream.of(1, 2, 3, 4)
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
// {false=[1, 3], true=[2, 4]} -- both keys ALWAYS present

String csv = Stream.of("a", "b", "c").collect(Collectors.joining(", ", "[", "]")); // "[a, b, c]"

// teeing: average in one pass = sum / count
double avg = Stream.of(1, 2, 3, 4).collect(Collectors.teeing(
    Collectors.summingInt(i -> i),
    Collectors.counting(),
    (sum, n) -> sum / (double) n));            // 2.5
```

### Stream.toList() vs Collectors.toList()
```java
List<Integer> a = Stream.of(1, 2, 3).toList();                       // UNMODIFIABLE (Java 16+)
// a.add(4); // UnsupportedOperationException
List<Integer> b = Stream.of(1, 2, 3).collect(Collectors.toList());   // mutability NOT guaranteed
b.add(4);                                                            // happens to work today (ArrayList) — don't rely on it
List<Integer> c = Stream.of(1, 2, 3).collect(Collectors.toUnmodifiableList()); // guaranteed immutable
```

## Related Topics
- [[stream-api]]
- [[functional-interfaces]]
- [[lambdas-and-method-references]]
- [[optional]]
- [[java-set-and-map]]

## Cards

```anki
START
Basic
What happens when `Collectors.toMap(keyFn, valFn)` produces two equal keys?
Back: It throws `IllegalStateException: Duplicate key ...`.<br>Fix: use the 3-arg overload with a **merge function**, e.g. `toMap(k, v, (a, b) -> a)` or `(a, b) -> a + b`.<br>The merge function decides which value wins (or how to combine).
<!--ID: 1781902681236-->
END

START
Basic
Distinction: `Stream.toList()` vs `collect(Collectors.toList())` — mutability?
Back: `Stream.toList()` (Java 16+) returns an **unmodifiable** list.<br>`Collectors.toList()` makes **no guarantee** — it currently returns a mutable `ArrayList`, but you must not rely on that.<br>For a guaranteed-immutable result use `Stream.toList()` or `Collectors.toUnmodifiableList()`.
<!--ID: 1781902681242-->
END

START
Basic
What's special about the map `partitioningBy` returns?
Back: It's a `Map<Boolean, List<T>>` that **always contains both `true` and `false` keys**, even if one partition is empty.<br>`groupingBy` only creates keys that actually occur.<br>So `partitioningBy` result keys are safe to access without null checks.
<!--ID: 1781902681248-->
END

START
Basic
You want to count elements per group, not list them. What do you write?
Back: `groupingBy(classifier, Collectors.counting())`.<br>The second arg is a **downstream collector** applied to each group, giving `Map<K, Long>`.<br>Downstreams like `counting`, `mapping`, `summingInt`, `toSet` reshape each group's value.
<!--ID: 1781902681254-->
END

START
Basic
What does `Collectors.joining(", ", "[", "]")` do on `["a","b","c"]`?
Back: Produces the `String` `"[a, b, c]"`.<br>Args are `(delimiter, prefix, suffix)`.<br>`joining()` with no args just concatenates; the 1-arg form adds only a delimiter.
<!--ID: 1781902681259-->
END

START
Basic
When would you use `Collectors.teeing`?
Back: To feed the same stream into **two collectors in one pass** and merge their results.<br>`teeing(downstream1, downstream2, (r1, r2) -> merged)` (Java 12+).<br>Classic use: compute sum and count together to get an average without two traversals.
<!--ID: 1781902681264-->
END

START
Basic
What does `Collectors.mapping(fn, downstream)` do that plain `map` doesn't?
Back: It transforms elements **inside** a downstream collector, typically within `groupingBy`/`partitioningBy`.<br>e.g. `groupingBy(k, mapping(Item::name, toList()))` groups, then keeps only names per group.<br>It adapts the elements before they reach the inner collector.
<!--ID: 1781902681268-->
END

START
Basic
How do `summingInt` and `averagingInt` differ in return type?
Back: `summingInt(toIntFn)` returns an `Integer` (sum).<br>`averagingInt(toIntFn)` returns a `Double` (mean) — even for int inputs.<br>Both take a `ToIntFunction` to extract the int from each element.
<!--ID: 1781902681272-->
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
