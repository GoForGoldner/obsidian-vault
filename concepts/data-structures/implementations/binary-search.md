---
tags: [data-structures, implementation, leetcode, search]
category: data-structures
related: [binary-search, sorting-algorithms]
---

## Description
Binary search on a sorted range in O(log n). The reusable form is the **bound**
template: `lowerBound` finds the first index whose value is `>= target`
(insertion point). `upperBound` (`> target`) and exact-match derive from it. Using
`lo < hi` with `mid = lo + (hi - lo) / 2` avoids overflow and off-by-one loops.

## Implementation
```java
// First index i in [0, n] with nums[i] >= target (i == n means all are smaller).
int lowerBound(int[] nums, int target) {
    int lo = 0, hi = nums.length;      // hi is exclusive
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// First index with nums[i] > target.
int upperBound(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] <= target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// Exact match, or -1.
int search(int[] nums, int target) {
    int i = lowerBound(nums, target);
    return (i < nums.length && nums[i] == target) ? i : -1;
}

// "Binary search on the answer": smallest x in [lo, hi] for which feasible(x) is true.
int firstTrue(int lo, int hi, java.util.function.IntPredicate feasible) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (feasible.test(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
```

## When to use (LeetCode)
- Search in sorted / rotated arrays, find first/last position, insertion point.
- "Minimize the max / maximize the min" -> binary search on the answer with a
  monotonic `feasible(x)` check (Koko eating bananas, split array largest sum).

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Binary Search (lower/upper bound + search-on-answer)
Back: `lo=0, hi=n` (exclusive); loop `while (lo < hi)`, `mid = lo + (hi-lo)/2`.<br>lowerBound: `nums[mid] < target -> lo = mid+1` else `hi = mid`; returns first `>= target`.<br>Answer-search: replace comparison with monotonic `feasible(mid)` to get the first true x.<br>Full reference in the ## Implementation section of this note.
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
