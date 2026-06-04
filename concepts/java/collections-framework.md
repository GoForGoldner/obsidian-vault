---
tags: [java, data-structures, collections]
category: java
related: [java-list, java-set-and-map, java-queue-deque, java-iterators]
---

## Description
The Java Collections Framework is really two coordinated but separate API families. One family starts at `Iterable` and models groups of elements you traverse directly: `Collection`, then `List`, `Set`, and `Queue`/`Deque`. The other family starts at `Map` and models key-value associations: `Map`, then `SortedMap`, then `NavigableMap`. That split is why `Map` has familiar methods like `size()`, `isEmpty()`, and `clear()` but still cannot be passed anywhere a `Collection<?>` is expected. In practice, you choose an interface first (`List`, `Set`, `Queue`, `Deque`, `Map`) and then an implementation (`ArrayList`, `HashSet`, `TreeMap`, `ArrayDeque`, and so on) based on ordering, uniqueness, lookup complexity, and whether you need range/nearest-element operations.

## Examples
### Full hierarchy snapshot
```text
Iterable
└── Collection
    ├── List
    │   ├── ArrayList
    │   └── LinkedList
    ├── Set
    │   ├── HashSet
    │   ├── LinkedHashSet
    │   └── SortedSet
    │       └── NavigableSet
    │           └── TreeSet
    └── Queue
        ├── PriorityQueue
        └── Deque
            ├── ArrayDeque
            └── LinkedList

Map
├── HashMap
├── LinkedHashMap
└── SortedMap
    └── NavigableMap
        └── TreeMap
```

### Which implementation implements which interface?
| Implementation | Main interface(s) you program against | Ordering behavior | Typical use |
| --- | --- | --- | --- |
| `ArrayList<E>` | `List<E>` | Insertion order, indexed | Default resizable list |
| `LinkedList<E>` | `List<E>`, `Deque<E>` | Insertion order | Rare; end insert/remove plus deque API |
| `HashSet<E>` | `Set<E>` | No iteration order guarantee | Fast uniqueness check |
| `TreeSet<E>` | `NavigableSet<E>` | Sorted by natural order or `Comparator` | Ordered set + range queries |
| `HashMap<K,V>` | `Map<K,V>` | No iteration order guarantee | Default key-value lookup |
| `TreeMap<K,V>` | `NavigableMap<K,V>` | Keys kept sorted | Ordered map + nearest/range queries |
| `ArrayDeque<E>` | `Deque<E>` | Front/back order | Best default stack/queue/deque |
| `PriorityQueue<E>` | `Queue<E>` | Heap priority, not insertion order | Always remove smallest/highest-priority next |

### Common `Collection` methods you use in practice
| Signature | Returns | What it does |
| --- | --- | --- |
| `boolean add(E e)` | `boolean` | Inserts one element |
| `boolean remove(Object o)` | `boolean` | Removes one matching element |
| `boolean contains(Object o)` | `boolean` | Checks membership |
| `int size()` | `int` | Returns element count |
| `boolean isEmpty()` | `boolean` | `true` when size is 0 |
| `void clear()` | `void` | Removes all elements |
| `Stream<E> stream()` | `Stream<E>` | Creates a sequential stream |
| `boolean removeIf(Predicate<? super E> filter)` | `boolean` | Removes all matching elements |
| `void forEach(Consumer<? super E> action)` | `void` | Applies an action to each element |

```java
Collection<String> words = new ArrayList<>(List.of("java", "collections", "", "map"));
words.add("set");
words.remove("");
boolean hasMap = words.contains("map");
int count = words.size();
boolean empty = words.isEmpty();
words.removeIf(String::isBlank);
words.forEach(System.out::println);
List<String> upper = words.stream().map(String::toUpperCase).toList();
```

### Common `Map` methods you use in practice
| Signature | Returns | What it does |
| --- | --- | --- |
| `V put(K key, V value)` | `V` | Associates key with value, returns old value |
| `V get(Object key)` | `V` | Looks up value or returns `null` |
| `boolean containsKey(Object key)` | `boolean` | Checks key presence |
| `boolean containsValue(Object value)` | `boolean` | Checks value presence |
| `Set<K> keySet()` | `Set<K>` | Live view of keys |
| `Collection<V> values()` | `Collection<V>` | Live view of values |
| `Set<Map.Entry<K,V>> entrySet()` | `Set<Map.Entry<K,V>>` | Live view of entries |
| `V getOrDefault(Object key, V defaultValue)` | `V` | Reads with fallback, no insertion |
| `V putIfAbsent(K key, V value)` | `V` | Inserts only if missing |
| `V computeIfAbsent(K key, Function<? super K,? extends V> mappingFn)` | `V` | Lazily creates a value for a missing key |
| `V merge(K key, V value, BiFunction<? super V,? super V,? extends V> remappingFn)` | `V` | Combines old and new value |
| `void forEach(BiConsumer<? super K,? super V> action)` | `void` | Visits key/value pairs |

```java
Map<String, Integer> counts = new HashMap<>();
counts.put("java", 1);
counts.putIfAbsent("collections", 0);
counts.merge("java", 1, Integer::sum);            // java -> 2
int missing = counts.getOrDefault("queue", 0);    // 0, map unchanged

Map<String, List<String>> graph = new HashMap<>();
graph.computeIfAbsent("A", k -> new ArrayList<>()).add("B");
graph.computeIfAbsent("A", k -> new ArrayList<>()).add("C");

graph.forEach((node, neighbors) ->
    System.out.println(node + " -> " + neighbors));
```

## Related Topics
- [[java-list]]
- [[java-set-and-map]]
- [[java-queue-deque]]
- [[java-iterators]]

## Cards

```anki
START
Basic
What are the two separate root hierarchies in Java Collections?
Back: `Iterable -> Collection -> {List, Set, Queue}` is one hierarchy, while `Map -> SortedMap -> NavigableMap` is a separate hierarchy.<br>`Map` does NOT extend `Collection`, so a `Map<K,V>` cannot be passed where a `Collection<?>` is required.
<!--ID: 1780580932997-->
END

START
Basic
What 3 live views does `Map` provide?
Back: `keySet()`, `values()`, and `entrySet()`.<br>They are live views backed by the original map, so removing from the view removes from the map, and map updates appear in the view.
<!--ID: 1780580932999-->
END

START
Basic
What's the difference between `SortedSet`/`SortedMap` and `NavigableSet`/`NavigableMap`?
Back: `Sorted*` gives ordered traversal plus range views like `headSet`, `tailSet`, `subSet`, `headMap`, and `tailMap`.<br>`Navigable*` adds nearest-element queries such as `floor`, `ceiling`, `lower`, and `higher`.
<!--ID: 1780580933001-->
END

START
Basic
What does `Map.computeIfAbsent(key, mappingFn)` do and when do you use it?
Back: If `key` is absent, Java computes a value with `mappingFn`, inserts it, and returns it; if the key already exists, it just returns the existing value.<br>Common pattern: `map.computeIfAbsent(node, k -> new ArrayList<>()).add(neighbor);` when building adjacency lists or groups.
<!--ID: 1780580933002-->
END

START
Basic
What does `Map.merge(key, value, remappingFn)` do?
Back: If `key` is absent, Java inserts `value`.<br>If `key` is present, Java replaces the old value with `remappingFn(oldValue, value)`; for counting, use `map.merge(word, 1, Integer::sum);`.
<!--ID: 1780580933004-->
END

START
Basic
What does `Map.getOrDefault(key, defaultValue)` do?
Back: It returns the mapped value if the key exists, otherwise it returns `defaultValue`.<br>It does NOT insert anything, so unlike `computeIfAbsent`, the map is unchanged.
<!--ID: 1780580933006-->
END

START
Basic
What does `Collection.removeIf(predicate)` do?
Back: It removes every element for which the predicate returns `true` and returns whether anything was removed.<br>Example: `list.removeIf(s -> s.isEmpty());`.<br>This is safe and concise compared with mutating a collection directly inside a for-each loop.
<!--ID: 1780580933008-->
END

START
Basic
Does `Map` extend `Collection`? What are the implications?
Back: No.<br>`Map` defines its own `size()`, `isEmpty()`, and `clear()` methods, but it is not a collection of elements in the API type system.<br>To work with a map as a collection-like view, use `entrySet()`, `keySet()`, or `values()`.
<!--ID: 1780580933013-->
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
