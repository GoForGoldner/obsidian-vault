---
tags: [java, data-structures, map, set]
category: java
related: [collections-framework, java-list, java-queue-deque]
---

## Description
`Set` and `Map` solve two closely related problems: uniqueness and lookup. A `Set<E>` stores unique elements directly, while a `Map<K,V>` stores unique keys that lead to values. Both come in three practical families: hash-based (`HashSet`, `HashMap`) for fastest average lookup, linked-hash (`LinkedHashSet`, `LinkedHashMap`) when iteration order should be predictable, and tree-based (`TreeSet`, `TreeMap`) when elements or keys must stay sorted and support range or nearest-match queries. In day-to-day Java, the choice usually follows a simple ladder: hash by default, linked-hash if order matters, tree if sorting or `floor`/`ceiling`/subrange operations matter.

## Examples
### Hash vs linked-hash vs tree
| Family | Set implementation | Map implementation | Average lookup/update | Iteration order | Null support | Best use |
| --- | --- | --- | --- | --- | --- | --- |
| Hash | `HashSet<E>` | `HashMap<K,V>` | O(1) average | None guaranteed | `HashMap` allows one `null` key; `HashSet` allows one `null` element | Default membership and lookup |
| Linked hash | `LinkedHashSet<E>` | `LinkedHashMap<K,V>` | O(1) average | Insertion order, or access order for `LinkedHashMap` | Same null behavior as hash variants | Predictable iteration or LRU behavior |
| Tree | `TreeSet<E>` | `TreeMap<K,V>` | O(log n) | Sorted order | No `null` keys/elements when comparison is required | Ordered traversal, ranges, nearest lookups |

### `TreeSet` / `NavigableSet` nearest and range methods
```java
NavigableSet<Integer> scores = new TreeSet<>(List.of(10, 20, 30, 40, 50));

Integer floor = scores.floor(25);      // 20  (greatest <= 25)
Integer ceiling = scores.ceiling(25);  // 30  (smallest >= 25)
Integer lower = scores.lower(30);      // 20  (greatest < 30)
Integer higher = scores.higher(30);    // 40  (smallest > 30)

NavigableSet<Integer> head = scores.headSet(30, true);   // [10, 20, 30]
NavigableSet<Integer> tail = scores.tailSet(30, false);  // [40, 50]
NavigableSet<Integer> mid = scores.subSet(20, true, 40, false); // [20, 30]
```

### `HashMap` usage patterns you actually write
```java
Map<String, Integer> counts = new HashMap<>();
counts.putIfAbsent("java", 0);
counts.merge("java", 1, Integer::sum);
counts.merge("java", 1, Integer::sum);   // java -> 2

Map<String, List<String>> groups = new HashMap<>();
groups.computeIfAbsent("backend", k -> new ArrayList<>()).add("Ada");
groups.computeIfAbsent("backend", k -> new ArrayList<>()).add("Linus");
groups.computeIfAbsent("frontend", k -> new ArrayList<>()).add("Grace");
```

### `LinkedHashMap` as a tiny LRU cache
```java
Map<Integer, String> lru = new LinkedHashMap<>(3, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, String> eldest) {
        return size() > 3;
    }
};

lru.put(1, "A");
lru.put(2, "B");
lru.put(3, "C");
lru.get(1);              // key 1 becomes most recently used
lru.put(4, "D");        // evicts key 2
```

## Related Topics
- [[collections-framework]]
- [[java-list]]
- [[java-queue-deque]]

## Cards

```anki
START
Basic
When do you choose `HashMap` vs `TreeMap` vs `LinkedHashMap`?
Back: Use `HashMap` by default for O(1) average lookup when order does not matter.<br>Use `TreeMap` for O(log n) sorted keys plus range and nearest-key methods.<br>Use `LinkedHashMap` when you want hash-map speed with predictable iteration order or LRU-style behavior.
<!--ID: 1780580933032-->
END

START
Basic
What are `NavigableSet`'s four nearest-element methods?
Back: `ceiling(e)` = smallest element `>= e`, `floor(e)` = largest element `<= e`, `higher(e)` = smallest element `> e`, and `lower(e)` = largest element `< e`.<br>These are why you choose `TreeSet`/`NavigableSet` for boundary-search problems.
<!--ID: 1780580933033-->
END

START
Basic
Can `HashMap` and `TreeMap` have null keys?
Back: `HashMap` can store one `null` key.<br>`TreeMap` cannot, because it must compare keys to maintain sorted order and `null` cannot be ordered by the normal comparison rules.<br>Both maps can store `null` values.
<!--ID: 1780580933035-->
END

START
Basic
Why do `HashSet` and `HashMap` require `equals()` and `hashCode()` agreement?
Back: Hash-based collections first narrow candidates by `hashCode()` and then confirm equality with `equals()`.<br>If two equal objects return different hash codes, lookups and duplicate detection fail.<br>Rule: if `a.equals(b)`, then `a.hashCode() == b.hashCode()` must also be true.
<!--ID: 1780580933037-->
END

START
Basic
What's the difference between `SortedSet.headSet(e)` and `NavigableSet.headSet(e, inclusive)`?
Back: `SortedSet.headSet(toElement)` returns elements strictly less than `toElement`.<br>`NavigableSet.headSet(e, true)` can include the boundary element, while `headSet(e, false)` excludes it.<br>The same inclusive/exclusive upgrade exists for `tailSet` and `subSet`.
<!--ID: 1780580933039-->
END

START
Basic
How do you use `HashMap.computeIfAbsent()` to build a graph adjacency list?
Back: Write `map.computeIfAbsent(node, k -> new ArrayList<>()).add(neighbor);`.<br>If `node` is missing, Java creates and stores a new list first; if it already exists, Java reuses the existing list.<br>This replaces a verbose contains/get/put pattern.
<!--ID: 1780580933041-->
END

START
Basic
How does `LinkedHashMap` support LRU cache behavior?
Back: Construct it with `new LinkedHashMap<>(capacity, 0.75f, true)` so reads update access order, then override `removeEldestEntry(Map.Entry<K,V> eldest)` to return `true` when size exceeds capacity.<br>The least-recently-used entry stays at the front and gets evicted first.
<!--ID: 1780580933042-->
END

START
Basic
What does `HashSet` use internally?
Back: `HashSet` is backed by a `HashMap` internally.<br>Each set element is stored as a key in the map with a dummy value.<br>That is why `HashSet` has hash-map-like complexity and the same `equals()`/`hashCode()` requirements.
<!--ID: 1780580933044-->
END

START
Basic
What is the `SortedSet.subSet(from, to)` method?
Back: It returns a live view of elements from `from` inclusive to `to` exclusive.<br>`NavigableSet` adds `subSet(from, fromInclusive, to, toInclusive)` so you can control both boundaries explicitly.<br>Because it is a view, changes reflect in the original set.
<!--ID: 1780580933047-->
END

START
Basic
How do you iterate a `Map`'s entries and what's the most efficient way?
Back: Use `for (Map.Entry<K,V> e : map.entrySet()) { K k = e.getKey(); V v = e.getValue(); }` or `map.forEach((k, v) -> ...);`.<br>`entrySet()` is the most efficient explicit loop because it avoids iterating keys and then calling `get(key)` for every entry.
<!--ID: 1780580933049-->
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
