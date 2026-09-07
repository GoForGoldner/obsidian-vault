---
tags: [algorithms, template, leetcode, neetcode, sorting, arrays]
category: algorithms
related: [heap-top-k, sorting-algorithms, binary-search]
---

## Description
Quicksort that **recurses into one side only**. A partition step puts the pivot at its final
sorted index; compare that index to the one you want and discard the half that cannot contain
it. Discarding half the work each time is what turns O(n log n) into an expected **O(n)**, in
O(1) extra space.

Worth knowing as the "can you beat the heap?" answer to k-th largest.

## Implementation
```java
int select(int[] a, int k) {
    int target = a.length - k;             // k-th LARGEST sits at this sorted index
    int lo = 0, hi = a.length - 1;

    while (true) {
        int p = partition(a, lo, hi);      // a[p] is now in its final sorted position

        if (p == target) return a[p];

        if (p < target) lo = p + 1;        // discard the left half entirely...
        else            hi = p - 1;        // ...or the right one
    }
}

// Lomuto: sweep everything <= pivot to the front, then drop the pivot in behind it.
private int partition(int[] a, int lo, int hi) {
    swap(a, lo + rand.nextInt(hi - lo + 1), hi);   // randomise or sorted input is O(n^2)
    int pivot = a[hi], i = lo;

    for (int j = lo; j < hi; j++)
        if (a[j] <= pivot) swap(a, i++, j);

    swap(a, i, hi);
    return i;
}
```

## Variations
| Want | Change |
|---|---|
| k-th **smallest** | `target = k - 1` |
| the whole top-k, unordered | stop when `p == target` and return `a[target..]` - the array is already partitioned around it |
| median | `target = n / 2` |
| stable O(n log k) instead, or a stream | a bounded heap -> [[heap-top-k]] |

## When to use (NeetCode 150)
- **Kth Largest Element in an Array** - the O(n)-average answer.
- Cue: an **unordered, in-memory, mutable** array and a single k-th query. If the data
  arrives as a stream, or must not be mutated, use a heap instead.

## Pitfalls
- Randomise the pivot. A fixed pivot on sorted input degrades to O(n^2), which is exactly
  the adversarial test.
- It **mutates the input**. If the caller needs the original order, copy first.
- The loop is `j < hi` (the pivot is parked at `hi` and swapped in at the end), and the
  `i++` happens *inside* the swap call - off-by-one here silently returns a neighbour.
- One-sided recursion is the point. Recursing into both halves is just quicksort.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: quickselect (kth largest in O(n) average)
Back: The kth LARGEST sits at sorted index `n - k`. Loop: partition `[lo, hi]`; if the pivot lands ON the target return it, else recurse into ONE side only (`p < target` -> `lo = p+1`, else `hi = p-1`). Discarding half each time is what makes it expected O(n), O(1) space.<br>Lomuto partition: randomise the pivot into `a[hi]`, then `i = lo`, and for `j` in `[lo, hi)` swap `a[j]` forward whenever `a[j] <= pivot`; finally swap the pivot into `i` and return `i`.<br>Randomise or sorted input degrades to O(n^2). It mutates the input.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040516-->
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
