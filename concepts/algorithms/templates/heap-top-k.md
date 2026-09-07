---
tags: [algorithms, template, leetcode, neetcode, heaps]
category: algorithms
related: [heap-priority-queue, two-heaps, quickselect, dijkstra]
---

## Description
The counter-intuitive rule, worth burning in:

> **To keep the k _largest_, use a _min_-heap of size k.**

The top is then the *weakest survivor*, so one comparison decides whether a newcomer belongs,
and the top *is* the k-th largest when you finish. O(n log k) and O(k) space, versus
O(n log n) for a sort.

## Implementation
```java
int topK(int[] nums, int k) {
    // MIN-heap when you want the k largest. Mirror the comparator for k smallest.
    PriorityQueue<Integer> pq = new PriorityQueue<>(Comparator.comparingInt(x -> key(x)));

    for (int x : nums) {
        pq.offer(x);

        if (pq.size() > k)      // (1) the bound
            pq.poll();          //     evict the weakest - it can never be top-k
    }

    return pq.peek();           // the weakest of the k best == the k-th largest
}
```

## Variations
| Want | Change |
|---|---|
| k smallest / k closest | max-heap on the metric (`Comparator.reverseOrder()`, or compare **squared** distances - no `sqrt` needed) and evict the farthest |
| a **streaming** k-th largest | keep that exact heap as a field; `add` offers, trims to `k`, returns `peek()` |
| repeatedly pull the extreme, transform, push back | drop the size bound; max-heap, `while (pq.size() > 1)` poll two, push the combination |
| merge k sorted sequences | seed the heap with each sequence's **head**, then poll -> emit -> push that item's successor |
| greedy scheduling with a cooldown | max-heap of remaining counts + a queue of `{count, readyAtTime}`; each tick, poll the heap and return anything whose cooldown expired |
| k-th largest in O(n) average | not a heap at all -> [[quickselect]] |
| the **middle** rather than the k-th | -> [[two-heaps]] |
| small bounded integer keys | skip the heap: bucket by count -> [[hash-map-counting]] |

`new PriorityQueue<>(collection)` heapifies in O(n) - cheaper than n offers.

## When to use (NeetCode 150)
- **Kth Largest Element in an Array**, **Kth Largest Element in a Stream**,
  **K Closest Points to Origin**, **Last Stone Weight**, **Task Scheduler**,
  **Design Twitter** (k-way merge of each followee's recent posts).
- **Merge k Sorted Lists** - the k-way merge variation, see [[linked-list-ops]].
- **Find Median from Data Stream** -> [[two-heaps]].
- **Top K Frequent Elements** is better with buckets -> [[hash-map-counting]].

## Pitfalls
- Backwards heap direction. Top-k *largest* wants a **min**-heap. Getting it wrong compiles
  and returns a plausible number.
- `(a, b) -> a - b` overflows on large or negative values - use `Integer.compare`.
- A `PriorityQueue` is **not** sorted when iterated or printed; only `peek`/`poll` respect order.
- `remove(Object)` is O(n) - model deletions lazily by skipping stale entries on poll.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the bounded-heap top-k skeleton (and which direction the heap goes)
Back: To keep the k LARGEST use a MIN-heap of size k: `offer(x)`, then `if (pq.size() > k) pq.poll()`. The top is the weakest survivor, so it IS the kth largest. O(n log k), O(k) space. Mirror the comparator for k smallest.<br>K closest: max-heap on the metric, evict the farthest; compare SQUARED distances, no sqrt.<br>K-way merge: seed with each sequence's head, then poll -> emit -> push that item's successor.<br>Use `Integer.compare`, not `a - b`. A PriorityQueue is not sorted when iterated.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040443-->
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
