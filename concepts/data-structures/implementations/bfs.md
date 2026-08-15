---
tags: [data-structures, implementation, leetcode, graphs]
category: data-structures
related: [bfs, dfs, topological-sort, dijkstra]
---

## Description
Breadth-first search explores level by level using a queue, so on an unweighted
graph it finds shortest paths. The two templates you reuse constantly: **grid BFS**
(4-directional, with a `visited`/in-place marker) and **multi-source BFS** (seed
the queue with every source at distance 0 — rotting oranges, 0/1 matrix).

## Implementation
```java
// Grid BFS: shortest steps from (sr,sc) to any target, 4-directional.
int bfsGrid(int[][] grid, int sr, int sc) {
    int m = grid.length, n = grid[0].length;
    int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};
    boolean[][] seen = new boolean[m][n];
    Deque<int[]> q = new ArrayDeque<>();
    q.offer(new int[]{sr, sc});
    seen[sr][sc] = true;
    int dist = 0;

    while (!q.isEmpty()) {
        for (int sz = q.size(); sz > 0; sz--) {   // process one full level
            int[] cell = q.poll();
            int r = cell[0], c = cell[1];
            // if (isTarget(r, c)) return dist;
            for (int[] d : DIRS) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                if (seen[nr][nc] || grid[nr][nc] == 0) continue; // 0 = wall, adjust
                seen[nr][nc] = true;
                q.offer(new int[]{nr, nc});
            }
        }
        dist++;
    }
    return -1;
}

// Multi-source BFS: push ALL sources first (each at distance 0), then expand.
int multiSource(int[][] grid, List<int[]> sources) {
    Deque<int[]> q = new ArrayDeque<>(sources);
    // mark all sources as visited, then run the same level loop as above.
    return 0;
}
```

## When to use (LeetCode)
- Shortest path / fewest steps in an **unweighted** graph or grid.
- Level-order tree traversal; word ladder; number of islands (BFS flood fill).
- Multi-source when several starts spread simultaneously (rotting oranges).

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: BFS (grid + multi-source)
Back: Queue + visited; mark on ENQUEUE (not dequeue) to avoid duplicates.<br>Wrap the expansion in a `for (sz = q.size(); sz > 0; sz--)` loop to count levels/distance.<br>Multi-source: seed the queue with every source at distance 0 before expanding.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398751-->
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
