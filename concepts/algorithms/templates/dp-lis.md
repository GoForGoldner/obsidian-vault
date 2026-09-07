---
tags: [algorithms, template, leetcode, neetcode, dynamic-programming, binary-search]
category: algorithms
related: [dynamic-programming, dp-1d-linear, binary-search]
---

## Description
`dp[i]` = the best answer for a subsequence **ending at** `i`. Unlike [[dp-1d-linear]], the
recurrence looks back over **every** earlier index, not a constant window - which is what
makes it O(n^2) and what makes it easy to adapt.

The answer is `max(dp)`, **not** `dp[n-1]` - the best subsequence need not end at the last
element.

## Implementation
```java
int bestEndingAt(int[] a) {
    int n = a.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);                       // every element alone is already a valid answer

    int best = n == 0 ? 0 : 1;

    for (int i = 1; i < n; i++) {

        for (int j = 0; j < i; j++)           // every earlier index is a candidate predecessor
            if (canFollow(a, j, i))           // (1) the ordering test
                dp[i] = Math.max(dp[i], dp[j] + 1);

        best = Math.max(best, dp[i]);         // (2) max over i, never dp[n-1]
    }

    return best;
}
```

## Variations
| Want | Change |
|---|---|
| strictly increasing | `(1)` is `a[j] < a[i]` |
| non-decreasing | `a[j] <= a[i]` |
| **O(n log n)** | different algorithm: keep `tails[len]` = the *smallest possible tail* of an increasing subsequence of that length. It stays sorted, so binary-search (`lowerBound`) for the first tail `>= x`, overwrite it, and extend the length only when `x` lands past the end. `tails` is **not** a real subsequence - only its length means anything |
| the count of longest ones | carry a parallel `count[]` alongside `dp[]` |
| chains over 2-D items (envelopes, string chains) | sort by the dimension that must be non-decreasing, then run this on the other |
| reconstruct the actual sequence | keep a `prev[]` predecessor array and walk it back |

## When to use (NeetCode 150)
- **Longest Increasing Subsequence** - reach for the O(n^2) form first; the O(n log n) one
  only if the constraints demand it or the interviewer asks.
- The `best ending at i` framing is the reusable half - it also handles "maximum sum
  increasing subsequence" and "longest chain".
- Two *sequences* rather than one against itself -> [[dp-2d-sequences]].

## Pitfalls
- `max(dp)`, not `dp[n-1]`.
- `Arrays.fill(dp, 1)` - starting at 0 makes every answer off by one.
- Strict vs non-strict: `<` vs `<=`, or lower- vs upper-bound in the fast version. Read the
  statement.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the best-ending-at-i skeleton (longest increasing subsequence), both complexities
Back: `dp[i]` = best subsequence ENDING AT i. Fill all with 1 (an element alone counts), then for each i scan EVERY `j < i` and `if (a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1)`. Answer is `max(dp)`, NOT `dp[n-1]` - it need not end last. O(n^2), and the wide look-back is what makes it adaptable.<br>O(n log n) is a different algorithm: `tails[len]` = the smallest possible tail of a length-(len+1) increasing subsequence; it stays sorted, so lowerBound for the first tail >= x, overwrite it, and extend only when x lands past the end. `tails` is not a real subsequence.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040412-->
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
