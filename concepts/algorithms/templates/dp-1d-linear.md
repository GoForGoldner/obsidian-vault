---
tags: [algorithms, template, leetcode, neetcode, dynamic-programming]
category: algorithms
related: [dynamic-programming, dp-knapsack, dp-lis, greedy-scans]
---

## Description
`dp[i]` = the answer for the prefix ending at `i`, built from a **constant number** of earlier
entries. Because the dependency window is constant, the array collapses to two or three
rolling variables and the space becomes O(1).

Four decisions, in this order - and the first one is where nearly every wrong recurrence
comes from:

1. **What does `dp[i]` mean?** Say it as a sentence before writing code.
2. **Recurrence** - which earlier entries does it read?
3. **Base cases.**
4. **Answer** - is it `dp[n]`, or `max` over all `i`? These are different problems.

## Implementation
```java
int rolling(int[] a) {
    int prev2 = base0(), prev1 = base1();          // the two entries the recurrence reads
    int best = prev1;

    for (int i = 1; i < a.length; i++) {

        int cur = recurrence(a[i], prev1, prev2);  // (1) the step

        prev2 = prev1;                             // shift the window forward
        prev1 = cur;

        best = Math.max(best, cur);                // (2) only if the answer is max-over-i
    }

    return answerIsLast() ? prev1 : best;          // (3) dp[n] vs max(dp)
}
```

## Variations
| Problem shape | (1) recurrence | (3) answer |
|---|---|---|
| count the ways to climb | `prev1 + prev2` | last |
| cheapest way to reach the end | `min(prev1 + cost[i-1], prev2 + cost[i-2])` | last |
| take-or-skip (no two adjacent) | `max(prev1, prev2 + a[i])` | last |
| ...on a **circle** | - | run the linear solver **twice**, dropping the first house then the last, and take the max |
| count the parses of a prefix | `+= prev1` if the 1-char read is legal, `+= prev2` if the 2-char read is in range | last |
| can the prefix be segmented | `dp[i] = any j < i with dp[j] && valid(s[j..i])` - needs the **full array**, not rolling | last |
| best contiguous run (Kadane) | `max(a[i], cur + a[i])` - *start fresh* beats dragging a deficit | **max over i** |
| best contiguous **product** | track `maxCur` **and** `minCur`, each the extreme of `{a[i], prevMax*a[i], prevMin*a[i]}` - a negative flips the ordering, so today's min is tomorrow's max | max over i |
| a state machine (hold / sold / rest) | one rolling variable **per mode**, each written from the previous day only | max of the terminal modes |

## When to use (NeetCode 150)
- **Climbing Stairs**, **Min Cost Climbing Stairs**, **House Robber**, **House Robber II**,
  **Decode Ways**, **Word Break**, **Maximum Subarray**, **Maximum Product Subarray**,
  **Best Time to Buy and Sell Stock with Cooldown**.
- **Longest Palindromic Substring** / **Palindromic Substrings** are filed as 1-D DP but
  expand-from-centre is shorter -> [[two-pointers-converging]].
- A target plus a set of items -> [[dp-knapsack]]. Best-ending-at-i over *subsequences* -> [[dp-lis]].

## Pitfalls
- Rolling variables must read the **old** values. Max-product fails silently if `minCur` uses
  the already-overwritten `maxCur` - cache it first.
- `dp[n]` vs `max(dp)`: Kadane's answer is the max over all positions, Word Break's is the
  last entry.
- Seed extremes with `a[0]`, never `0` - an all-negative array has a negative answer.
- Decide "first `i` elements" (so `dp` has `n+1` slots) or "ending at index `i`" and hold it.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the 1-D rolling-variable DP skeleton, and its four decisions
Back: Decide in order: what `dp[i]` MEANS (as a sentence), the recurrence, the base cases, and whether the answer is `dp[n]` or `max` over all i - those last two are different problems.<br>Constant dependency window -> keep `prev1`/`prev2`, compute `cur`, then shift. O(1) space.<br>Take-or-skip: `max(prev1, prev2 + a[i])`; circular variant = run it twice, dropping the first or the last element. Kadane: `max(a[i], cur + a[i])`, answer is max-over-i, seeded with `a[0]` not 0. Max product: track maxCur AND minCur from the OLD maxCur, since a negative flips the ordering.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040394-->
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
