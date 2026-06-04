---
tags: [algorithms, technique, dynamic-programming]
category: algorithms
related: [sorting-algorithms, trie, cyclic-sort]
---

## Description
Dynamic programming solves problems with overlapping subproblems and optimal substructure by defining a state, writing a recurrence, and storing results instead of recomputing them. The most useful interview patterns are 1D DP, Kadane, Knapsack, Grid, Subsequence, Interval, Partition, State Machine, and Bitmask DP, and strong DP pattern recognition usually matters more than memorizing one specific problem.

## Examples
Pattern recognition table:
```java
// Sequence / count ways        -> 1D DP
// Best contiguous subarray     -> Kadane
// Items + capacity             -> Knapsack
// Grid / matrix paths          -> Grid DP
// Two strings                  -> Subsequence DP (LCS / edit distance)
// Range [i, j] + split points  -> Interval DP
// Prefix + cut / segmentation  -> Partition DP
// Buy / sell / cooldown states -> State Machine DP
// n <= 20 + used-set tracking  -> Bitmask DP
```

Kadane's core template:
```java
int current = nums[0];
int best = nums[0];

for (int i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
}
```

## Related Topics
- [[cyclic-sort|Cyclic Sort]]
- [[sorting-algorithms|Sorting Algorithms]]
- Recursion + Memoization
- State Compression
- Optimization Problems

## Cards

```anki
START
Basic
How do you identify which DP pattern to use for a problem?
Back: Sequence → 1D DP or Kadane. Items + capacity → Knapsack. Grid/matrix → Grid DP. Two strings → Subsequence (LCS). Range [i,j] with split points → Interval DP. Prefix with cuts → Partition DP. States with transitions → State Machine. n ≤ 20 tracking used → Bitmask DP.
<!--ID: 1780580932976-->
END

START
Basic
What is Kadane's algorithm and what's the core decision at each step?
Back: Find max subarray sum in O(n). At each index: extend current subarray (currentSum + nums[i]) or start fresh (nums[i]). currentSum = max(nums[i], currentSum + nums[i]). If running sum is negative, it can only hurt — reset. Variant: track both max and min for max product subarray.
<!--ID: 1780580932978-->
END

START
Basic
What's the difference between 0/1 Knapsack and Unbounded Knapsack in the DP transition?
Back: 0/1 (each item once): iterate capacity RIGHT to LEFT in 1D — ensures each item used at most once. Unbounded (items reusable): iterate LEFT to RIGHT — allows same item to be picked again. Same recurrence, different loop direction.
<!--ID: 1780580932979-->
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
