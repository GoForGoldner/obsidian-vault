---
tags: [data-structures, implementation, leetcode, graphs]
category: data-structures
related: [dfs, bfs, backtracking, topological-sort]
---

## Description
Depth-first search goes as deep as possible before backtracking. Two reusable
forms: **grid DFS** (flood fill / island counting, marking cells visited in place)
and **graph DFS** with a color/visited array that also detects cycles in a directed
graph (WHITE/GRAY/BLACK). Recursion depth is the call stack; convert to an explicit
stack if you risk overflow.

## Implementation
```java
// Grid DFS flood fill: mark the whole connected region of '1's starting at (r,c).
void dfsGrid(char[][] grid, int r, int c) {
    int m = grid.length, n = grid[0].length;
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
    grid[r][c] = '0';                 // mark visited in place
    dfsGrid(grid, r + 1, c);
    dfsGrid(grid, r - 1, c);
    dfsGrid(grid, r, c + 1);
    dfsGrid(grid, r, c - 1);
}

// Directed-graph DFS with cycle detection. color: 0=unvisited,1=in-stack,2=done.
boolean hasCycle(List<List<Integer>> adj) {
    int n = adj.size();
    int[] color = new int[n];
    for (int i = 0; i < n; i++)
        if (color[i] == 0 && dfs(i, adj, color)) return true;
    return false;
}
private boolean dfs(int u, List<List<Integer>> adj, int[] color) {
    color[u] = 1;                     // gray: on current path
    for (int v : adj.get(u)) {
        if (color[v] == 1) return true;               // back edge -> cycle
        if (color[v] == 0 && dfs(v, adj, color)) return true;
    }
    color[u] = 2;                     // black: fully explored
    return false;
}
```

## When to use (LeetCode)
- Connected components / islands / flood fill; path existence.
- Directed cycle detection; enumerate all paths (pairs with backtracking).
- Tree recursion (subtree sums, diameter, LCA) is DFS in disguise.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: DFS (grid flood fill + directed cycle detection)
Back: Grid: bounds-check, return if not target, mark visited in place, recurse 4 dirs.<br>Directed cycle: 3-color (0 unvisited / 1 on-path / 2 done); seeing a color==1 neighbor is a back edge -> cycle.<br>Full reference in the ## Implementation section of this note.
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
