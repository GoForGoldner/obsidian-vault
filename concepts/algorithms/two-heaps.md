---
tags: [algorithms, technique, heap]
category: algorithms
related: [heap-priority-queue, sorting-algorithms, dynamic-programming]
---

## Description
The two-heaps pattern keeps a max-heap for the smaller half of the data and a min-heap for the larger half so the median of a changing stream is always at the top of one or both heaps. With careful balancing, insertion costs O(log n) and reading the median costs O(1), which is why this pattern is the standard solution for streaming median problems.

## Examples
`MedianFinder` with `addNum` and `findMedian`:
```java
class MedianFinder {
    PriorityQueue<Integer> left = new PriorityQueue<>((a, b) -> b - a); // max-heap
    PriorityQueue<Integer> right = new PriorityQueue<>();               // min-heap

    void addNum(int num) {
        left.offer(num);
        right.offer(left.poll());

        if (right.size() > left.size()) {
            left.offer(right.poll());
        }
    }

    double findMedian() {
        if (left.size() > right.size()) {
            return left.peek();
        }
        return (left.peek() + right.peek()) / 2.0;
    }
}
```

## Related Topics
- [[heap-priority-queue|Heap / Priority Queue]]
- [[sorting-algorithms|Sorting Algorithms]]
- Streaming Data
- Median of Data Stream
- Balanced Partitions

## Cards

```anki
START
Basic
You see: need to find the median of a stream of numbers efficiently. What technique?
Back: Two Heaps. Max-heap (left half, top = largest small element) + min-heap (right half, top = smallest large element). Keep balanced: left.size() == right.size() ± 1. Median = left.peek() (odd) or average of both peeks (even).
<!--ID: 1780580932952-->
END

START
Basic
What are the three invariants you must maintain in the Two Heaps pattern?
Back: 1) Every element in left ≤ every element in right. 2) left.size() == right.size() OR left.size() == right.size() + 1. 3) After adding, if left.peek() > right.peek(), move it over. These ensure the median is always accessible in O(1).
<!--ID: 1780580932954-->
END

START
Basic
Why is the left heap usually implemented as a max-heap?
Back: The median for the smaller half must be the largest element on that side, so a max-heap makes it available at `peek()`. That lets you compare and rebalance in O(log n) while reading the odd-length median in O(1).
<!--ID: 1780580932956-->
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
