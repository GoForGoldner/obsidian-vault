---
tags: [algorithms, data-structures]
category: algorithms
related: [sorting-algorithms, two-heaps, line-sweep]
---

## Description
A heap is a complete binary tree stored efficiently in an array where each parent is ordered relative to its children: parent ≤ children in a min-heap and parent ≥ children in a max-heap. In Java, `PriorityQueue` is a min-heap by default, which makes heaps a core tool for top-K problems, Dijkstra's shortest path, and merge-k-sorted-lists style problems where you repeatedly need the next best element.

## Examples
Basic `PriorityQueue` usage:
```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(5);
minHeap.offer(2);
minHeap.offer(8);

int smallest = minHeap.poll(); // 2
int next = minHeap.peek();     // 5
```

Top K smallest using the opposite heap (max-heap of size k):
```java
PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);

for (int num : nums) {
    if (maxHeap.size() < k) {
        maxHeap.offer(num);
    } else if (num < maxHeap.peek()) {
        maxHeap.poll();
        maxHeap.offer(num);
    }
}

List<Integer> topKSmallest = new ArrayList<>(maxHeap);
```

## Related Topics
- [[two-heaps|Two Heaps]]
- [[sorting-algorithms|Sorting Algorithms]]
- Dijkstra
- Merge K Sorted Lists
- Top K Elements

## Cards

```anki
START
Basic
Why do you use a MAX-heap to find the top K smallest elements?
Back: The max-heap's root is the largest of the K items. When a new element is smaller than the root, swap it in (remove root, add new). This keeps only the K smallest. O(n log k) vs O(n log n) for sorting.
END

START
Basic
What are the heap index formulas for an array-based heap?
Back: Parent: (i-1)/2. Left child: 2i+1. Right child: 2i+2. Sift up after insert (bubble toward root). Sift down after poll (bubble toward leaves). Both O(log n).
END

START
Basic
What is Java's `PriorityQueue` by default, and when is that useful?
Back: Java's `PriorityQueue` is a min-heap by default, so `peek()` returns the smallest element. Use it when you repeatedly need the current minimum, such as Dijkstra, merging sorted lists, or keeping the next best candidate.
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
