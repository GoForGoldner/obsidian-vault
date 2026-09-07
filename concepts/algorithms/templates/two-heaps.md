---
tags: [algorithms, template, leetcode, neetcode, heaps]
category: algorithms
related: [two-heaps, heap-top-k]
---

## Description
Split a stream in half and keep the **boundary** cheap to query: lower half in a max-heap,
upper half in a min-heap, sizes differing by at most one. The two tops are then the elements
straddling the middle, so the median is O(1) and each insert is O(log n).

## Implementation
```java
// Invariant: lo.size() == hi.size(), or lo.size() == hi.size() + 1.
private final PriorityQueue<Integer> lo =                      // smaller half, MAX-heap
        new PriorityQueue<>(Collections.reverseOrder());
private final PriorityQueue<Integer> hi = new PriorityQueue<>(); // larger half, min-heap

void add(int num) {
    lo.offer(num);              // 1. always insert into lo...
    hi.offer(lo.poll());        // 2. ...then push lo's max across, so lo <= hi elementwise
                                //    (this ordering is why no comparison is needed)
    if (hi.size() > lo.size())  // 3. rebalance so lo carries any odd element
        lo.offer(hi.poll());
}

double median() {
    if (lo.size() > hi.size()) return lo.peek();          // odd count
    return (lo.peek() + hi.peek()) / 2.0;                 // even count - the 2.0 matters
}
```

## Variations
| Want | Change |
|---|---|
| sliding-window median | same structure plus **lazy deletion**: a `Map` of pending removals, cleared off the tops before each query. `remove(Object)` is O(n), so never call it |
| two competing pools (capital -> profit) | same shape: one heap ordered by the gate, the other by the payoff; move everything newly affordable across, then take the best |
| the k-th from one end, not the middle | one heap is enough -> [[heap-top-k]] |

## When to use (NeetCode 150)
- **Find Median from Data Stream**.
- Cue: *the middle*, or "balance two pools where one is queried by max and the other by min".

## Pitfalls
- Java's `PriorityQueue` is a **min**-heap; the max half needs
  `Collections.reverseOrder()`, and omitting it fails only on larger inputs.
- Memorise the three-step add verbatim. Inserting straight into the "correct" heap needs a
  comparison *and* a rebalance, and gets equal elements wrong.
- Pick which heap holds the odd element once, and let `median()` depend on that choice.
- `/ 2` is integer division. Use `/ 2.0`.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: two heaps (streaming median)
Back: `lo` = MAX-heap of the smaller half (`Collections.reverseOrder()`), `hi` = min-heap of the larger half. Invariant: `lo.size()` equals `hi.size()` or exceeds it by exactly one.<br>add, always these three steps: `lo.offer(num)`, `hi.offer(lo.poll())`, then `if (hi.size() > lo.size()) lo.offer(hi.poll())` - going through `lo` first is why no comparison is needed.<br>median: sizes equal -> average both tops with `/2.0`, else `lo.peek()`.<br>Windowed variant needs LAZY deletion (a pending-removal map cleared off the tops); `remove(Object)` is O(n).<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398789-->
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
