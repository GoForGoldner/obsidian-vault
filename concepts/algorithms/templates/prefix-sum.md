---
tags: [algorithms, template, leetcode, neetcode, arrays]
category: algorithms
related: [prefix-sum, hash-map-counting, sliding-window]
---

## Description
Precompute cumulative results so any range is answered in O(1). The one structural decision
is the **extra leading slot**: `pre[0]` represents the empty prefix, and that offset is what
removes every boundary special case.

## Implementation
```java
long[] build(int[] nums) {
    long[] pre = new long[nums.length + 1];        // +1: pre[0] is the EMPTY prefix

    for (int i = 0; i < nums.length; i++)
        pre[i + 1] = pre[i] + nums[i];             // (1) accumulate

    return pre;
}

// Inclusive range [l, r], O(1).
long range(long[] pre, int l, int r) {
    return pre[r + 1] - pre[l];                    // (2) combine - inverse of (1)
}
```

## Variations
| Need | Change |
|---|---|
| product / xor / min instead of sum | swap (1) and (2) for that operator and its inverse |
| every index needs **both** sides | two passes: fill forward with left-aggregates, then walk back multiplying by a running right-aggregate. O(1) extra space, no division |
| *count* subarrays with a property | drop the array: running `sum` + `Map<prefix, count>`, `count += seen.get(sum - k)` then `seen.merge(sum,1,...)`. **Seed `seen.put(0, 1)`** |
| longest such subarray | same map, but store the **first** index of each prefix, not a count |
| divisible by k | key on `((sum % k) + k) % k` |
| 2D region | `pre[i+1][j+1] = pre[i][j+1] + pre[i+1][j] - pre[i][j] + g[i][j]`, query by the same inclusion-exclusion with signs flipped |

## When to use (NeetCode 150)
- **Product of Array Except Self** - the both-sides variation, and why division is not needed.
- Repeated "sum of a range" over static data; 2D immutable region sums.
- Subarray-sum counting is the standard **Two Sum** follow-up and shares its invariant.
- Non-negative values + "longest/shortest run" is usually [[sliding-window]] instead; prefix
  sums are what still work when values can be **negative**.

## Pitfalls
- `pre[r + 1] - pre[l]`. Writing `pre[r] - pre[l]` silently drops the last element.
- Seed the prefix-count map with `{0: 1}` or every subarray starting at index 0 is missed.
- Use `long` - `int` overflow here is silent.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the prefix-aggregate skeleton (build + O(1) range, and the counting variation)
Back: Size `n+1` so `pre[0]` is the empty prefix - that offset removes every boundary case. Build: `pre[i+1] = pre[i] + nums[i]`. Query inclusive `[l,r]`: `pre[r+1] - pre[l]`.<br>Both-sides-per-index: forward pass writes left-aggregates into the output, then a backward pass multiplies by a running right-aggregate. O(1) space, no division.<br>COUNTING subarrays: no array at all - running `sum` plus `Map<prefix,count>`, `count += seen[sum-k]` then `seen[sum]++`, seeded `{0:1}`.<br>Full reference in the ## Implementation section of this note.
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
