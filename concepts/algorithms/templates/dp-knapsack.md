---
tags: [algorithms, template, leetcode, neetcode, dynamic-programming, knapsack]
category: algorithms
related: [dynamic-programming, dp-1d-linear, backtracking]
---

## Description
"Choose a sub-multiset of items to hit a target." One array indexed by the **target**, and
**one rule that decides everything**:

| Each item usable | Inner loop over `t` | Why |
|---|---|---|
| **once** (0/1) | **descending** | `dp[t - x]` must still be the *previous* row - item not yet used |
| **unlimited** | **ascending** | `dp[t - x]` should already include this item - reuse is the point |

Getting that direction backwards fails **quietly**: you get a valid-looking number for the
other problem.

## Implementation
```java
int knapsack(int[] items, int target) {
    int[] dp = new int[target + 1];
    dp[0] = identity();                    // 0 / 1 / true == "the empty selection"

    for (int x : items) {                  // items OUTSIDE...

        for (int t = start(x, target);     // (1) DESCENDING for 0/1, ASCENDING for unlimited
             inRange(t, x);
             t = step(t)) {

            dp[t] = merge(dp[t], dp[t - x]);   // (2) the aggregation
        }
    }

    return dp[target];
}
```

## Variations
| Question | (1) direction | (2) aggregation | `dp[0]` |
|---|---|---|---|
| fewest items to reach the target, reuse allowed | ascending, `t = x .. target` | `min(dp[t], dp[t-x] + 1)` | `0` |
| **count** the combinations, reuse allowed | ascending | `dp[t] += dp[t-x]` | `1` |
| is the target reachable, each item once | descending, `t = target .. x` | `dp[t] \|= dp[t-x]` | `true` |
| count the subsets hitting a target, each once | descending | `dp[t] += dp[t-x]` | `1` |

Two things that are not the loop:
- **Loop nesting** matters for counting: items outside counts **combinations**; target outside
  counts **permutations** - a different, larger answer.
- **+/- sign assignment** reduces to a 0/1 count: if `P` is the positives,
  `P - (sum - P) = target`, so `P = (sum + target) / 2`. Then count subsets summing to `P`.

Sentinel for a minimisation: fill with `target + 1`, not `Integer.MAX_VALUE`, so the `+ 1`
cannot overflow.

## When to use (NeetCode 150)
- **Coin Change** (unbounded, minimise), **Coin Change II** (unbounded, count),
  **Partition Equal Subset Sum** (0/1, feasibility - and check `sum` is even first),
  **Target Sum** (0/1, count, after the sign rewrite).
- If you need the actual selections rather than a count or an optimum -> [[backtracking]].

## Pitfalls
- The loop direction rule. Ascending for 0/1 double-counts an item; descending for unbounded
  forbids reuse.
- Loop nesting for counting problems.
- Check parity and reachability up front (`sum` odd, `|target| > sum`) or the index goes
  negative.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the knapsack skeleton, and the rule that picks the inner loop direction
Back: One array `dp[t]` indexed by the target; items in the OUTER loop, target in the inner.<br>Item usable ONCE (0/1) -> iterate t DESCENDING so `dp[t-x]` is still the previous row. Item usable UNLIMITED times -> ASCENDING so `dp[t-x]` already includes it. Backwards fails quietly with the other problem's answer.<br>Aggregation swaps for the question: `min(dp[t], dp[t-x]+1)` fewest, `dp[t] += dp[t-x]` count, `dp[t] |= dp[t-x]` feasibility. `dp[0]` = 0/1/true = the empty selection.<br>For counting, nesting matters: items outside = COMBINATIONS, target outside = permutations.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040406-->
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
