---
tags: [data-structures, implementation, leetcode, arrays]
category: data-structures
related: [prefix-sum, sliding-window, hash-table]
---

## Description
Precompute cumulative sums so any range sum is answered in O(1). 1D: `pre[i]` =
sum of the first i elements, range `[l, r]` = `pre[r+1] - pre[l]`. Paired with a
hash map of seen prefix sums, it counts subarrays with a target sum in O(n). 2D
extends the idea with inclusion-exclusion.

## Implementation
```java
// 1D prefix sums: O(n) build, O(1) range query.
class PrefixSum {
    private final long[] pre;
    PrefixSum(int[] nums) {
        pre = new long[nums.length + 1];
        for (int i = 0; i < nums.length; i++) pre[i + 1] = pre[i] + nums[i];
    }
    long rangeSum(int l, int r) { return pre[r + 1] - pre[l]; }  // inclusive [l, r]
}

// Count subarrays summing to k, using prefix sum + hash map. O(n).
int subarraysSumK(int[] nums, int k) {
    Map<Long, Integer> seen = new HashMap<>();
    seen.put(0L, 1);                 // empty prefix
    long sum = 0;
    int count = 0;
    for (int x : nums) {
        sum += x;
        count += seen.getOrDefault(sum - k, 0);   // a prior prefix that closes a window
        seen.merge(sum, 1, Integer::sum);
    }
    return count;
}

// 2D range sum (inclusion-exclusion): sum of rectangle (r1,c1)..(r2,c2).
// pre[i+1][j+1] = pre[i][j+1] + pre[i+1][j] - pre[i][j] + grid[i][j];
// query = pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1];
```

## When to use (LeetCode)
- Many range-sum queries on a static array; subarray sum equals K / divisible by K.
- 2D region sums (immutable matrix); difference array for range updates.
- Cue: repeated "sum of a range" — precompute once instead of re-summing.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Prefix Sum (1D range query + subarray-sum-K)
Back: `pre[i+1] = pre[i] + nums[i]`; range `[l,r]` = `pre[r+1] - pre[l]`.<br>Count subarrays summing to k: running `sum`, add `seen[sum - k]`, then `seen[sum]++` (seed `seen[0]=1`).<br>2D uses inclusion-exclusion.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398774-->
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
