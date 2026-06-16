---
epoch: 1781455493505
modelKey: "deepseek-v4-flash|deepseek"
topic: "LinkedHashMap LRU Cache"



tags:
  - copilot-conversation
---

**user**: Explain LinkedHashMap and how you would use it for LRU
[Timestamp: 2026/06/14 12:44:53]

**ai**: LinkedHashMap is a hash table and linked list implementation of the `Map` interface with **predictable iteration order**. It maintains a doubly linked list running through all its entries to define the order – either **insertion-order** (the default) or **access-order** (controlled by the constructor parameter).

For an **LRU (Least Recently Used) cache**, you use `access-order` and override `removeEldestEntry(Map.Entry<K,V> eldest)` to automatically evict the oldest entry when the cache reaches a maximum capacity. Every `get()` or `put()` moves the accessed entry to the end of the list, so the least recently used entry sits at the front and can be evicted.

```java
public class LRUCache<K,V> extends LinkedHashMap<K,V> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true); // access-order = true
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {
        return size() > capacity;
    }
}
```

- `true` in the constructor activates access-order.
- `removeEldestEntry` is called after every `put`/`putAll`. Returning `true` removes the eldest entry.
- This gives a thread‑unsafe, simple, and efficient LRU cache without external data structures.

Added [[LinkedHashMap and LRU Cache]].
[Timestamp: 2026/06/14 12:45:05]

**user**: What does removeeldest entry do? Is that a method that’s manually called when adding elements or does it happen on its own? Also what are the arguments passed into linkedhashmap?
[Timestamp: 2026/06/14 12:48:13]

**ai**: Excellent follow-up questions.

## `removeEldestEntry` – automatic callback, not manual

`removeEldestEntry(Map.Entry<K,V> eldest)` is a **protected method** that `LinkedHashMap` calls **automatically after every `put` and `putAll`** (and indirectly after `putIfAbsent` etc.). You never call it yourself. The default implementation simply returns `false`, so nothing happens. By overriding it to return `true` when some condition holds (e.g., `size() > capacity`), you tell the map: “remove that eldest entry right now.”

Behind the scenes, `LinkedHashMap.put()` calls `addEntry()` which calls `removeEldestEntry()` **before** inserting the new entry? Actually let's be precise: the JDK code calls `removeEldestEntry(eldest)` after insertion, and if it returns `true`, it removes the eldest entry (the one that would be evicted). The point is it's fully automatic – you only provide the condition.

## `LinkedHashMap` constructor arguments

There are three constructors:

| Constructor | Notes |
|---|---|
| `LinkedHashMap()` | Default initial capacity 16, load factor 0.75, **insertion-order** (false) |
| `LinkedHashMap(int initialCapacity)` | Same as above, just sets capacity |
| `LinkedHashMap(int initialCapacity, float loadFactor)` | Sets both, still insertion-order |
| `LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)` | Full control – `accessOrder=true` means access-order (used for LRU) |
| `LinkedHashMap(Map<? extends K, ? extends V> m)` | Copy constructor, insertion-order |

The third parameter `accessOrder` is what makes it an LRU candidate:
- `false` (default): iteration order follows insertion order.
- `true`: iteration order follows **access order** – every `get()`, `put()`, and `containsKey()` moves that entry to the end of the linked list, so the least recently used stays at the front and gets evicted.

So the LRU recipe uses `super(capacity, 0.75f, true)` and then overrides `removeEldestEntry` to check `size() > capacity`. That's it – no manual eviction calls needed.
[Timestamp: 2026/06/14 12:48:25]

**user**: What is the 0.75f? what if I wanted to do LFU?
[Timestamp: 2026/06/14 12:50:12]

**ai**: ## 1. What is `0.75f`?

`0.75f` is the **load factor** – a tuning parameter for the internal hash table. It defines how full the map can get before it automatically **resizes** (doubles its capacity and rehashes all entries).

- **Default:** `0.75` is a trade-off between time and space. A lower load factor (e.g., `0.5`) wastes memory but reduces collisions. A higher one (e.g., `0.9`) saves memory but increases collisions, making `get`/`put` slower.
- When `size > capacity × loadFactor`, the map grows. For example, with initial capacity `16` and load factor `0.75`, the map resizes when the 13th entry is inserted.
- For LRU, you usually keep the default because you control the number of entries via `removeEldestEntry` anyway – the map may never actually resize if you cap it below the resize threshold.

---

## 2. Can you use `LinkedHashMap` for LFU?

**No.** LinkedHashMap tracks **recency** (access order), not **frequency**. LFU evicts the item with the smallest access count. You need a different data structure.

A classic LFU cache implementation uses:
- A `HashMap<K, V>` for fast key lookups.
- A **frequency map** (`HashMap<Integer, LinkedHashSet<K>>`) mapping each frequency count to a set of keys having that count. `LinkedHashSet` preserves insertion order within the same frequency (to break ties – evict the oldest among equally infrequent items).
- A `minFrequency` variable to quickly find which frequency bucket to evict from.

Here's a simplified skeleton:

```java
public class LFUCache<K, V> {
    private final int capacity;
    private final Map<K, V> values = new HashMap<>();
    private final Map<K, Integer> counts = new HashMap<>();
    private final Map<Integer, LinkedHashSet<K>> frequencyLists = new HashMap<>();
    private int minFreq = 0;
    
    public V get(K key) {
        if (!values.containsKey(key)) return null;
        int freq = counts.get(key);
        counts.put(key, freq + 1);
        // move key from freq list to freq+1 list
        frequencyLists.get(freq).remove(key);
        frequencyLists.computeIfAbsent(freq + 1, k -> new LinkedHashSet<>()).add(key);
        if (frequencyLists.get(freq).isEmpty() && minFreq == freq) minFreq++;
        return values.get(key);
    }
    
    public void put(K key, V value) {
        if (capacity <= 0) return;
        if (values.containsKey(key)) {
            values.put(key, value);
            get(key); // increase frequency
            return;
        }
        if (values.size() >= capacity) {
            // evict least frequently used, oldest among ties
            K evict = frequencyLists.get(minFreq).iterator().next();
            frequencyLists.get(minFreq).remove(evict);
            values.remove(evict);
            counts.remove(evict);
        }
        values.put(key, value);
        counts.put(key, 1);
        frequencyLists.computeIfAbsent(1, k -> new LinkedHashSet<>()).add(key);
        minFreq = 1;
    }
}
```

This is more complex than LRU because you must maintain frequency counters and handle eviction from the lowest frequency bucket. Java does not provide a ready-made LFU structure; you build it yourself.

---

Added [[LFU Cache Implementation]] with a single card covering the core mechanism.

(Total cards in this conversation: LRU note had 2 cards, LFU adds 1 → 3, the limit.)
[Timestamp: 2026/06/14 12:50:35]