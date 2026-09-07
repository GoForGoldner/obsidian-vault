---
tags: [algorithms, template, leetcode, neetcode, binary-search]
category: algorithms
related: [binary-search, two-pointers-converging, dp-lis]
---

## Description
One loop covers every binary search worth memorising. It returns the **first index where a
predicate becomes true**; everything else is a choice of predicate.

The array does not have to be sorted - it only has to be **monotone in the predicate**: once
true, true forever after. If that does not hold, binary search is the wrong tool.

## Implementation
```java
int firstTrue(int lo, int hi) {                  // search the half-open range [lo, hi)

    while (lo < hi) {

        int mid = lo + (hi - lo) / 2;            // never (lo + hi) / 2 - that overflows

        if (predicate(mid)) hi = mid;            // mid might BE the answer - keep it
        else                lo = mid + 1;        // mid is definitely not - discard it
    }

    return lo;                                   // lo == hi: the first true index
}
```

## Variations
| Want | Range | `predicate(mid)` |
|---|---|---|
| first index `>= target` (lower bound) | `[0, n)` | `a[mid] >= target` |
| first index `> target` (upper bound) | `[0, n)` | `a[mid] > target` |
| exact match | - | `lowerBound`, then check `i < n && a[i] == target` |
| count of `target` | - | `upperBound - lowerBound` |
| smallest workable answer | the **value** space, e.g. `[1, max]` | `feasible(mid)` - the thing searched is not stored anywhere |
| 2D matrix as one sorted array | `[0, rows*cols)` | read `m[mid / cols][mid % cols]` |
| minimum of a **rotated** array | `[0, n-1]` inclusive | `a[mid] <= a[hi]` - compare to the **right** end, never the left |
| target in a rotated array | `[0, n-1]` inclusive, `lo <= hi` | one half is always sorted; detect it with `a[lo] <= a[mid]`, then test whether target lies inside that half and discard the other |

Ceiling division inside a `feasible` check: `(x + k - 1) / k`.

## When to use (NeetCode 150)
- **Binary Search**, **Search a 2D Matrix**, **Time Based Key-Value Store** (upper bound over
  timestamps, then step back one).
- **Koko Eating Bananas** - answer-space search; the range is speeds, not data.
- **Find Minimum in Rotated Sorted Array**, **Search in Rotated Sorted Array**.
- **Median of Two Sorted Arrays** - binary search the **partition point** of the shorter array.
- The O(n log n) **Longest Increasing Subsequence** is a `lowerBound` in disguise -> [[dp-lis]].

## Pitfalls
- Do not mix the two framings. `lo < hi` pairs with exclusive `hi = n` and `hi = mid`;
  `lo <= hi` pairs with inclusive `hi = n-1` and `hi = mid - 1`. Crossing them is the
  off-by-one.
- Rotated-minimum compares against `a[hi]`. Comparing against `a[lo]` breaks on an
  already-sorted array.
- Confirm monotonicity out loud before writing the loop.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the binary-search skeleton (first-true), and name the predicate per variation
Back: Half-open `[lo, hi)`; `while (lo < hi)`, `mid = lo + (hi-lo)/2`; predicate true -> `hi = mid` (mid might be the answer), false -> `lo = mid+1`. Return `lo` = first true. Needs monotone-in-predicate, not sorted.<br>lowerBound: `a[mid] >= target`. upperBound: `a[mid] > target`. Answer-space search: `feasible(mid)` over a value range. 2D: index `m[mid/cols][mid%cols]`.<br>Rotated minimum: compare `a[mid]` to `a[hi]`, NEVER `a[lo]`. Rotated target: one half is always sorted - detect with `a[lo] <= a[mid]`, then discard the half that cannot contain it.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398756-->
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
