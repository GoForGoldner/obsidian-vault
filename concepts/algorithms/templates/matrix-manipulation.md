---
tags: [algorithms, template, leetcode, neetcode, matrix, simulation]
category: algorithms
related: [dp-2d-grid, bfs, math-tricks]
---

## Description
No cleverness available: transform the matrix exactly as specified, usually in place, and the
whole difficulty is index bookkeeping. Three devices remove almost all of it.

The reusable skeleton is the **four-boundary walk** - `top / bottom / left / right`, shrinking
after each edge. The other two are one-liners worth memorising rather than deriving:

- **Rotate 90 clockwise = transpose, then reverse each row.** Never derive the index mapping
  under pressure. (Counter-clockwise: transpose, then reverse each *column*.)
- **Need O(1) space? Use the matrix as its own marker array** - the first row and column are
  the standard scratch space.

## Implementation
```java
List<Integer> boundaryWalk(int[][] m) {
    int top = 0, bottom = m.length - 1;
    int left = 0, right = m[0].length - 1;
    List<Integer> out = new ArrayList<>();

    while (top <= bottom && left <= right) {

        for (int c = left; c <= right; c++) out.add(m[top][c]);      // left -> right
        top++;

        for (int r = top; r <= bottom; r++) out.add(m[r][right]);    // top -> bottom
        right--;

        // RE-CHECK: the row/column may have just been consumed, and without
        // these guards a final single row or column is emitted twice.
        if (top <= bottom) {
            for (int c = right; c >= left; c--) out.add(m[bottom][c]);
            bottom--;
        }

        if (left <= right) {
            for (int r = bottom; r >= top; r--) out.add(m[r][left]);
            left++;
        }
    }

    return out;
}
```

## Variations
| Want | How |
|---|---|
| rotate in place | transpose - swap `m[i][j]` with `m[j][i]`, inner loop `j = i + 1` so each pair swaps **once** - then reverse each row |
| zero out every row and column containing a zero, O(1) space | pass 1: record flags into row 0 and column 0 (they collide at `(0,0)`, so column 0 needs its **own** boolean). Pass 2: apply **backwards**, so the markers survive until read |
| layer-by-layer processing | the same four boundaries, one `while` iteration per layer |
| count squares from a point set | store `Map<packedPoint, count>`; for each stored point forming a true diagonal (`dx == dy && dx != 0`), multiply the counts of the two implied corners. Pack with `((long) x << 32) \| (y & 0xffffffffL)` - mask the low half or negatives corrupt the key |

## When to use (NeetCode 150)
- **Spiral Matrix** - the skeleton. **Rotate Image**, **Set Matrix Zeroes** - the one-liners.
- **Detect Squares**.
- **Valid Sudoku** is the same genre: three seen-sets keyed row, column, and
  `(r/3)*3 + c/3` -> [[hash-map-counting]].
- If the matrix is a *graph* (connectivity, distance) -> [[bfs]] / [[dfs]]. If it is an
  optimisation over cells -> [[dp-2d-grid]].

## Pitfalls
- Re-check the bounds before the two return sweeps.
- Transpose from `j = i + 1`; from `j = 0` every pair swaps twice and nothing changes.
- Apply in-place markers **backwards**, or you overwrite them before reading.
- Non-square matrices: `m.length` rows, `m[0].length` columns. Only rotation assumes `n x n`.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the four-boundary matrix walk (spiral), and the two in-place one-liners
Back: `top/bottom/left/right`, `while (top <= bottom && left <= right)`: walk right along top then `top++`, down the right then `right--`, and RE-CHECK the bounds before the leftward and upward sweeps - without those guards a final single row or column is emitted twice.<br>Rotate 90 clockwise = TRANSPOSE (inner loop `j = i+1` so each pair swaps once) then REVERSE each row. Counter-clockwise reverses each column instead.<br>O(1)-space markers: use row 0 and column 0 as the flag arrays, give column 0 its own boolean for the (0,0) collision, and apply BACKWARDS so the markers survive until read.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040467-->
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
