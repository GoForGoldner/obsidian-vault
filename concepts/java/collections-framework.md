---
tags: [java, data-structures, collections]
category: java
related: [java-list, java-set-and-map, java-queue-deque, java-iterators]
---

## Description
The Java Collections Framework has two root hierarchies that look similar but are intentionally separate. `Iterable -> Collection -> List/Set/Queue` models groups of elements you traverse directly, while `Map -> SortedMap -> NavigableMap` models key-value associations. Knowing where the split happens explains why `Map` has familiar methods like `size()` and `clear()` but still cannot be used anywhere a `Collection` is expected.

## Examples
```text
Iterable
└── Collection
    ├── List
    ├── Set
    │   └── SortedSet
    │       └── NavigableSet
    └── Queue
        └── Deque

Map
└── SortedMap
    └── NavigableMap
```

Key mental model:

| Interface | Core idea | Distinguishing question |
| --- | --- | --- |
| `List` | Ordered, indexed elements | "Do I care about position?" |
| `Set` | Unique elements | "Do I care about duplicates?" |
| `Queue` / `Deque` | Processing order | "Do I consume from one or both ends?" |
| `Map` | Key-value lookup | "Am I finding values by key rather than storing standalone elements?" |

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
Back: `Iterable -> Collection -> {List, Set, Queue}` is one hierarchy. `Map -> {SortedMap -> NavigableMap}` is a completely separate hierarchy. `Map` does NOT extend `Collection`, so you cannot pass a `Map` anywhere a `Collection` is expected.
END

START
Basic
What's the difference between `Collection.contains(o)`, `Map.containsKey(k)`, and `Map.containsValue(v)`?
Back: `contains()` checks element presence in a `Collection`. `containsKey()` checks key presence in a `Map`. `containsValue()` checks value presence and is typically an O(n) scan. `Map` has its own `size()`, `isEmpty()`, and `clear()` — they are not inherited from `Collection`.
END

START
Basic
What 3 live views does `Map` provide for iteration?
Back: `keySet()` returns `Set<K>`, `values()` returns `Collection<V>`, and `entrySet()` returns `Set<Map.Entry<K,V>>`. All three are LIVE views, so modifying the view modifies the underlying map. `entrySet()` is the most efficient way to iterate both keys and values together.
END

START
Basic
When do `SortedSet`/`SortedMap` become `NavigableSet`/`NavigableMap`?
Back: Use `Sorted*` when you only need ordered traversal. Use `Navigable*` when you need nearest-match queries like "greatest <= x" or "smallest > x" via methods such as `floor`, `ceiling`, `lower`, and `higher`. That distinction matters in scheduling, range lookups, and boundary-search problems.
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
