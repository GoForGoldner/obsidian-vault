---
tags: [algorithms, template, leetcode, neetcode, dynamic-programming, strings]
category: algorithms
related: [dynamic-programming, dp-2d-grid, dp-knapsack]
---

## Description
Two sequences, one table: `dp[i][j]` = the answer for the **first `i`** characters of `a`
against the **first `j`** of `b`. Every problem in this family is the same two-branch decision:

```
characters match     ->  consume BOTH:      dp[i-1][j-1]
characters differ    ->  skip one of them:  dp[i-1][j]  and  dp[i][j-1]
```

Only the **aggregation** and the **base row/column** change.

Use the **length convention** - `dp` sized `(m+1) x (n+1)` - so row 0 and column 0 are free
base cases meaning "empty prefix". That is where the off-by-ones otherwise come from.

## Implementation
```java
int table(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];

    initBaseRowAndColumn(dp, m, n);                     // (1) what an empty prefix means

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {

            // NOTE the -1: dp is indexed by LENGTH, the strings by position.
            if (a.charAt(i - 1) == b.charAt(j - 1))
                dp[i][j] = onMatch(dp[i-1][j-1]);       // (2) consume both
            else
                dp[i][j] = onMismatch(dp[i-1][j],       // (3) skip from a
                                      dp[i][j-1],       //     skip from b
                                      dp[i-1][j-1]);    //     or substitute
        }
    }

    return dp[m][n];
}
```

## Variations
| Problem | (1) base | (2) match | (3) mismatch |
|---|---|---|---|
| longest common subsequence | all `0` | `dp[i-1][j-1] + 1` | `max(left, up)` |
| edit distance | `dp[i][0] = i`, `dp[0][j] = j` (delete/insert everything) | `dp[i-1][j-1]` | `1 + min(all three)` = replace / delete / insert |
| count how often `b` appears in `a` as a subsequence | `dp[i][0] = 1` (one way to build nothing) | `dp[i-1][j] + dp[i-1][j-1]` | `dp[i-1][j]` - skipping a source char is **always** allowed |
| can `c` be an interleaving of `a` and `b` | `dp[0][0] = true` | - | `dp[i][j] \|= dp[i-1][j] && a[i-1]==c[i+j-1]`, same for `b`; the position in `c` is `i + j - 1` |
| regex with `.` and `*` | `dp[0][j] = dp[0][j-2]` when `p[j-1]=='*'`, so an empty string can match `a*b*` | - | `*` binds to the **preceding** char, so read `(p[j-2], '*')` as a pair: zero copies = `dp[i][j-2]`, one more copy = `dp[i-1][j] && (prev=='.' \|\| prev==s[i-1])` |
| longest common **substring** (contiguous) | all `0` | `dp[i-1][j-1] + 1` | reset to **0**, and the answer is `max(dp)` not `dp[m][n]` |
| a table over a **range** rather than two sequences | iterate by interval **length** -> [[dp-2d-grid]] |

## When to use (NeetCode 150)
- **Longest Common Subsequence**, **Edit Distance**, **Distinct Subsequences**,
  **Interleaving String**, **Regular Expression Matching**.
- **Best Time to Buy and Sell Stock with Cooldown** is filed as 2-D DP but is a rolling
  state machine -> [[dp-1d-linear]].

## Pitfalls
- The index shift: `dp[i][j]` reads `a.charAt(i - 1)`. Mixing conventions inside one solution
  is the standard bug.
- The base row and column carry real meaning - `0`, or `i`/`j`, or `1`. Getting them wrong
  shifts every cell.
- Regex `*` always pairs with `p[j-2]`, and those branches start at `j = 2`.
- Keep the full table while debugging; printing it is the fastest way to see a bad recurrence.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the two-sequence DP table, and the two branches every variant shares
Back: `dp[i][j]` = answer for the first i chars of a against the first j of b, sized `(m+1)x(n+1)` so row/col 0 is the EMPTY prefix. Characters are `a.charAt(i-1)` - the shift is where off-by-ones come from.<br>Match -> consume BOTH, `dp[i-1][j-1]`. Mismatch -> skip one, from `dp[i-1][j]` and `dp[i][j-1]`. Only the aggregation and the base row/col change.<br>LCS: `+1` on match, `max` on mismatch, base 0. Edit distance: unchanged on match, `1 + min(all three)` on mismatch, base `dp[i][0]=i` and `dp[0][j]=j`. Counting: base `dp[i][0]=1`, and skipping a source char is always allowed.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040431-->
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
