---
tags: [algorithms, template, leetcode, neetcode, graphs, dfs]
category: algorithms
related: [dfs, bfs, backtracking, union-find, eulerian-path]
---

## Description
Go as deep as possible, then unwind. Mark visited **on entry**, never after the loop -
otherwise a cycle re-enters and overflows the stack.

The reusable setup, worth not improvising: an adjacency list from an edge list, and a
direction array for grids.

## Implementation
```java
static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};

List<List<Integer>> buildAdj(int n, int[][] edges, boolean directed) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        if (!directed) adj.get(e[1]).add(e[0]);
    }
    return adj;
}

int dfs(int[][] grid, int r, int c) {
    // One guard clause covers bounds AND "not part of the region".
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return 0;
    if (!wanted(grid, r, c)) return 0;                     // (1) the region test

    grid[r][c] = VISITED;                                  // (2) mark BEFORE recursing

    int acc = 1;                                           // (3) what to accumulate
    for (int[] d : DIRS)
        acc += dfs(grid, r + d[0], c + d[1]);

    return acc;
}
```

## Variations
| Want | Change |
|---|---|
| count regions | run the flood from every unvisited cell; each time it fires, `count++` |
| region **size** / area | the accumulator above |
| protect a region instead of erasing it | flood from the **border** first to mark the survivors, then flip everything unmarked |
| "which sources reach X" | **reverse the flow**: DFS outward from every target with an inverted condition, then intersect the reachable sets. Turns n searches into one per target |
| cycle in a **directed** graph | `int[] color`, 0/1/2: set `1` on entry, `2` on exit; hitting a colour-**1** neighbour is a back edge -> cycle. Colour 2 doubles as memoisation |
| cycle in an **undirected** graph | pass the parent; any visited non-parent neighbour is a cycle. Or: connected **and** `edges == n - 1` |
| clone a graph | `Map<old,new>`; return the mapped copy if present, else create it and **put it in the map before** recursing, or a cycle recurses forever |
| consume each **edge** exactly once | -> [[eulerian-path]] |

## When to use (NeetCode 150)
- **Number of Islands**, **Max Area of Island**, **Surrounded Regions** (border-first),
  **Pacific Atlantic Water Flow** (reverse flow), **Clone Graph**.
- **Course Schedule** - the colour variation, or [[topological-sort]] if you need the order.
- **Graph Valid Tree**, **Number of Connected Components** - either, or [[union-find]] when
  edges arrive incrementally.
- Tree recursion with a return value -> [[tree-dfs-aggregate]].

## Pitfalls
- Mark on entry, not on exit.
- Grid recursion depth reaches `m*n`; on a 1000x1000 grid prefer [[bfs]] or an explicit stack.
- Flood fill **destroys** the input. Use a separate `seen[][]` if the caller needs it intact.
- Clone Graph: register the copy before recursing.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the DFS skeleton - adjacency list, grid flood fill, and cycle colours
Back: Adjacency: `List<List<Integer>>` sized n, then per edge add `e[1]` to `adj.get(e[0])` (plus the reverse if undirected). Grids use a `DIRS` array.<br>Flood: one guard clause for bounds AND the region test, then mark visited BEFORE recursing (on entry, never on exit, or a cycle overflows the stack), then recurse the 4 directions accumulating.<br>Directed cycle: `color[]` 0/1/2 - set 1 on entry, 2 on exit; a colour-1 neighbour is a back edge. Colour 2 doubles as memoisation.<br>Reverse flow: DFS outward from the targets with an inverted condition, then intersect.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398771-->
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
