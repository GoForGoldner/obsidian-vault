---
tags: [data-structures, implementation, leetcode, heaps]
category: data-structures
related: [heap-priority-queue, two-heaps, dijkstra]
---

## Description
An array-backed binary min-heap. For node `i`: parent `(i-1)/2`, children `2i+1`
and `2i+2`. `push`/`pop` are O(log n) via sift-up / sift-down; `peek` is O(1).
Knowing the from-scratch version explains what `PriorityQueue` does under the hood.

## Implementation
```java
class MinHeap {
    private int[] a;
    private int n;

    MinHeap(int cap) { a = new int[Math.max(1, cap)]; }

    int peek() { return a[0]; }        // caller checks size() > 0
    int size() { return n; }

    void push(int val) {
        if (n == a.length) a = Arrays.copyOf(a, n * 2);
        a[n] = val;
        siftUp(n++);
    }

    int pop() {
        int top = a[0];
        a[0] = a[--n];                 // move last to root
        siftDown(0);
        return top;
    }

    private void siftUp(int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (a[p] <= a[i]) break;
            swap(i, p);
            i = p;
        }
    }

    private void siftDown(int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
            if (l < n && a[l] < a[smallest]) smallest = l;
            if (r < n && a[r] < a[smallest]) smallest = r;
            if (smallest == i) break;
            swap(i, smallest);
            i = smallest;
        }
    }

    private void swap(int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
}

// In practice on LeetCode, just use PriorityQueue:
//   PriorityQueue<int[]> pq = new PriorityQueue<>((x, y) -> x[0] - y[0]); // min-heap by x[0]
//   PriorityQueue<Integer> max = new PriorityQueue<>(Collections.reverseOrder());
```

## When to use (LeetCode)
- Kth-largest/smallest, "top K frequent", merge-K-sorted-lists.
- Any greedy that repeatedly needs the current min/max (task scheduling, Dijkstra).
- Custom ordering: pass a `Comparator` to `PriorityQueue`.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Binary Heap (array-backed min-heap)
Back: Array layout: parent `(i-1)/2`, children `2i+1`/`2i+2`.<br>`push`: append, siftUp (swap with parent while smaller).<br>`pop`: save root, move last element to root, siftDown (swap with smaller child).<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398763-->
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
