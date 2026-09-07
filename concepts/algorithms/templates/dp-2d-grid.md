---
tags: [algorithms, template, leetcode, neetcode, dynamic-programming, matrix]
category: algorithms
related: [dynamic-programming, dp-2d-sequences, dfs]
---

## Description
A 2-D table, and the only real decision is **whether a safe fill order exists**.

- If `dp[r][c]` depends only on cells in a fixed direction (above / left), iterate that way
  and you are done - usually collapsible to a single rolling row.
- If the dependencies follow the **data** rather than the indices (you can move all four
  ways), there is no safe order: recurse and cache instead. On a strictly-monotone grid the
  recursion cannot cycle, which is what makes the memo valid.

Memoised recursion is the honest first answer to most 2-D DP. Write the recursion, add a
cache, convert to a table only if asked.

## Implementation
```java
// Memoised DFS - use when no iteration order exists.
int dfs(int[][] grid, int r, int c, int[][] memo) {
    if (memo[r][c] != EMPTY) return memo[r][c];      // EMPTY must be an impossible answer

    int best = baseValue();                          // (1) the cell's own contribution

    for (int[] d : DIRS) {
        int nr = r + d[0], nc = c + d[1];

        if (!inBounds(grid, nr, nc)) continue;
        if (!canMove(grid, r, c, nr, nc)) continue;  // (2) THE acyclicity guarantee

        best = combine(best, dfs(grid, nr, nc, memo));
    }

    return memo[r][c] = best;
}
```

## Variations
| Want | How |
|---|---|
| count paths with only right/down moves | plain table: `dp[r][c] = dp[r+1][c] + dp[r][c+1]`, seeded `1` along the far edge. One rolling row works because each cell reads exactly one cell below and one to the right |
| cheapest path | same table with `min(...) + grid[r][c]` |
| longest strictly-increasing path, moves in all 4 directions | the skeleton above; `(2)` is `grid[nr][nc] > grid[r][c]`, which is the acyclicity proof. Run it from every cell and take the max |
| a table over an **interval**, not a position | `dp[i][j]` = the open range `(i, j)`; iterate by interval **length**, never by index, so both sub-ranges are already filled. Pad with sentinels at both ends |
| ...and pick which element is removed | choose the one removed **LAST**, not first. Then its neighbours are exactly `i` and `j`, and `dp[i][k]` / `dp[k][j]` become independent |

## When to use (NeetCode 150)
- **Unique Paths** - the plain table.
- **Longest Increasing Path in a Matrix** - memoised DFS; without the memo it is exponential.
- **Burst Balloons** - the interval variation, and "which one goes last" is the whole insight;
  choosing the first leaves the sub-problems coupled.
- Two sequences instead of a grid -> [[dp-2d-sequences]].
- **Word Search** is *not* DP - the answer depends on the visited set, which cannot be
  memoised -> [[backtracking]].

## Pitfalls
- `memo[r][c] != 0` as the "computed" test is only safe when 0 is an impossible answer;
  otherwise fill with `-1`.
- Interval DP must iterate by **length**. By index, the sub-ranges are not filled yet.
- Before collapsing a table to one row, verify each cell reads only one row back - and be
  deliberate about whether a slot currently holds the old or the new value.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: 2-D DP - the memoised-DFS skeleton, and when a plain table works instead
Back: The decision is whether a SAFE FILL ORDER exists. Dependencies in a fixed direction (above/left) -> iterate that way, often collapsing to one rolling row. Dependencies that follow the DATA (moves in all 4 directions) -> no order exists, so recurse and cache.<br>Memo skeleton: return the memo if set; start from the cell's own value; for each in-bounds neighbour that passes the MOVE test, combine with the recursive result; store and return.<br>That move test (e.g. strictly greater) is the acyclicity proof that makes the memo sound. `memo != 0` only works if 0 is impossible - else fill -1.<br>Interval DP: iterate by LENGTH, and choose which element is removed LAST.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040400-->
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
