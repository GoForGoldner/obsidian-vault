---
tags: [data-structures, implementation, leetcode, heaps]
category: data-structures
related: [two-heaps, heap-priority-queue, binary-heap]
---

## Description
Keep the lower half of a stream in a **max-heap** and the upper half in a
**min-heap**, balanced so their sizes differ by at most one. The median is then the
top of the larger heap (or the average of both tops). Add is O(log n); median is
O(1).

## Implementation
```java
class MedianFinder {
    // lo: max-heap of the smaller half; hi: min-heap of the larger half
    private final PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
    private final PriorityQueue<Integer> hi = new PriorityQueue<>();

    void addNum(int num) {
        lo.offer(num);                 // always push to lo first
        hi.offer(lo.poll());           // move its max over to hi
        if (hi.size() > lo.size())     // rebalance: lo may hold the extra element
            lo.offer(hi.poll());
    }

    double findMedian() {
        if (lo.size() > hi.size()) return lo.peek();       // odd count
        return (lo.peek() + hi.peek()) / 2.0;              // even count
    }
}
```

## When to use (LeetCode)
- Running/sliding-window median of a stream.
- "Balance two sides" greedily: IPO (capital vs. profit), schedule with two pools.
- Any problem needing the middle element(s) as data arrives.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Two Heaps (streaming median)
Back: `lo` = max-heap (smaller half), `hi` = min-heap (larger half).<br>add: push to `lo`, move `lo.poll()` to `hi`, then if `hi` bigger move `hi.poll()` back to `lo`.<br>median: if sizes equal average both tops, else top of `lo`.<br>Full reference in the ## Implementation section of this note.
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
