---
epoch: 1780575027622
modelKey: "deepseek-v4-flash|deepseek"
topic: "Java List replaceAll Example"



tags:
  - copilot-conversation
---

**user**: Can you give an example of the replaceAll method for List in Java?
[Timestamp: 2026/06/04 08:10:27]

**ai**: Added [[replaceAll]].

**Example:** `List.replaceAll(UnaryOperator)` applies a function to every element in-place (mutates the list). For instance, to square every integer:

```java
List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3));
nums.replaceAll(n -> n * n);
// nums is now [1, 4, 9]
```

Note: `replaceAll` modifies the list directly — it doesn't return a new list. If you need immutability, use `stream().map(...).toList()` instead.

---

Here’s the note I saved:

```markdown
---
tags: []
category: Java Collections
related: [removeIf, forEach, List]
---

## Description
`List.replaceAll(UnaryOperator<E>)` is a default method on the `List` interface (Java 8) that replaces each element with the result of applying the given operator. It performs a mutable update on the list.

## Examples
```java
List<String> words = new ArrayList<>(List.of("hi", "bye"));
words.replaceAll(String::toUpperCase);
// words → ["HI", "BYE"]
```

```java
// Multiply each integer by 10
List<Integer> ages = new ArrayList<>(List.of(5, 12, 8));
ages.replaceAll(age -> age * 10);
// ages → [50, 120, 80]
```

## Related Topics
- `removeIf` — removes elements matching a predicate
- `List.forEach` — consumer, not in-place
- Immutability & streams vs. in-place mutation

## Cards

START
Basic
What does the `replaceAll` method on `List` do, and what type of argument does it take?
Back: It applies a `UnaryOperator<E>` to every element **in-place** (mutates the list). It’s a default method added in Java 8.
END

START
Basic
Given `List<String> list = new ArrayList<>(List.of("a", "b"));`, write one line to turn all entries to uppercase using `replaceAll`.
Back: `list.replaceAll(String::toUpperCase);`
END

START
Gotcha
Does `List.replaceAll` return a new list or modify the existing one?
Back: It **modifies** the existing list in-place. To get a new list without mutating, use `list.stream().map(...).toList()`.
END
```
[Timestamp: 2026/06/04 08:10:42]

**user**: But replaceAll is just like map? does it need to rerun the same value as the previous list or does it return and new one?
[Timestamp: 2026/06/04 08:11:57]

**ai**: Good question — they're similar but not the same.

**`replaceAll`** takes a `UnaryOperator<T>` → input and output must be **the same type** `T`. It mutates the list in-place (no new list created).  
**`map`** (on `Stream`) takes a `Function<T, R>` → **type can change**. It returns a new stream (doesn't touch the original).

### So:
| | `replaceAll` | `map`
|---|---|---|
| Applies a function | yes | yes |
| Modifies original list | ✅ yes (in-place) | ❌ no (returns new stream) |
| Can change element type | ❌ no (must be same type) | ✅ yes (e.g., `String` → `Integer`) |
| Returns something | `void` | `Stream<R>` |

### Example of the type constraint:
```java
List<String> list = new ArrayList<>(List.of("1", "2"));
list.replaceAll(s -> Integer.parseInt(s));  // ❌ compile error: UnaryOperator<String> expected, returns Integer
```

But `map` can do that:
```java
List<Integer> ints = list.stream().map(Integer::parseInt).toList(); // ✅ works
```

So **`replaceAll` is not a general `map`** – it's specifically for in-place mutation that keeps the same element type.
[Timestamp: 2026/06/04 08:12:03]

**user**: What does firstKey return? Just the first key present in the map?
[Timestamp: 2026/06/04 08:17:37]

**ai**: `SortedMap.firstKey()` (and `NavigableMap.firstKey()`) returns the **smallest** key currently in the map, according to the map's natural ordering or custom comparator.

- It does **not** remove the key — just returns it.
- Throws `NoSuchElementException` if the map is empty.

### Example:
```java
SortedMap<String, Integer> map = new TreeMap<>();
map.put("delta", 4);
map.put("alpha", 1);
map.put("beta", 2);

String first = map.firstKey(); // "alpha"
```

So yes, it's simply the first key present, sorted by the map's ordering. Same idea as `first()` on `SortedSet`.
[Timestamp: 2026/06/04 08:17:44]