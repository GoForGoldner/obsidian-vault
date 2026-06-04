---
tags: [java, data-structures, map, set]
category: java
related: [collections-framework, java-list, java-queue-deque]
---

## Description
`Set` and `Map` solve membership and lookup problems in parallel tiers: hash-based for fast average lookup, linked-hash for predictable insertion-order iteration, and tree-based for sorted traversal plus range operations. That gives a practical decision ladder: use hash by default, linked-hash when iteration order matters, and tree when sorted order or nearest/range queries are part of the problem. The important conceptual split is that `Set` stores unique values directly, while `Map` stores unique keys that lead to values.

## Examples
| Family | Set variant | Map variant | Avg lookup/update | Ordering guarantee | Best when |
| --- | --- | --- | --- | --- | --- |
| Hash | `HashSet` | `HashMap` | O(1) | None | You want the default fastest average lookup |
| Linked hash | `LinkedHashSet` | `LinkedHashMap` | O(1) | Insertion order | You need stable traversal order |
| Tree | `TreeSet` | `TreeMap` | O(log n) | Sorted order | You need sorting, ranges, or nearest-match queries |

```java
NavigableSet<Integer> slots = new TreeSet<>(List.of(10, 20, 30, 40));
int nextAtOrAfter25 = slots.ceiling(25); // 30
int before25 = slots.lower(25);          // 20
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
Back: `HashMap` is the default when you want O(1) average lookup and no ordering. `TreeMap` is for O(log n) operations when you need sorted key traversal or range queries like `headMap`, `tailMap`, and `subMap`. `LinkedHashMap` keeps O(1) behavior while preserving insertion order, which is useful for stable iteration and LRU-style caches.
END

START
Basic
What are `NavigableSet`'s four nearest-element methods and when do you need them?
Back: `ceiling(e)` = smallest element >= `e`, `floor(e)` = largest <= `e`, `higher(e)` = smallest > `e`, and `lower(e)` = largest < `e`. Use them when problems ask for the nearest boundary, predecessor, or successor — common in scheduling, intervals, and ordered lookup problems that a `HashSet` cannot solve.
END

START
Basic
Can `HashMap` and `TreeMap` have null keys?
Back: `HashMap` allows exactly one `null` key. `TreeMap` does not, because it must compare keys for ordering and `null` would trigger `NullPointerException`. Both can store `null` values.
END

START
Basic
Why do `HashSet` and `HashMap` behave correctly only when `equals()` and `hashCode()` agree?
Back: Hash-based collections first bucket by `hashCode()` and then confirm equality with `equals()`. If equal objects produce different hashes, lookups and duplicate detection break. The rule is: if two objects are equal, they must return the same hash code.
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
