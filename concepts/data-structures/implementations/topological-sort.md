---
tags: [data-structures, implementation, leetcode, graphs]
category: data-structures
related: [topological-sort, bfs, dfs, union-find]
---

## Description
A linear ordering of a **DAG** where every edge u->v puts u before v. Kahn's
algorithm (BFS on in-degrees) is the go-to: repeatedly emit nodes with in-degree 0.
If fewer than n nodes get emitted, the graph has a cycle (no valid order). O(V+E).

## Implementation
```java
// Returns a valid order, or an empty array if a cycle exists (course schedule).
int[] topoSort(int n, int[][] edges) {   // edges[i] = {u, v} meaning u -> v
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[n];
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        indeg[e[1]]++;
    }

    Deque<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);

    int[] order = new int[n];
    int k = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        order[k++] = u;
        for (int v : adj.get(u))
            if (--indeg[v] == 0) q.offer(v);
    }
    return k == n ? order : new int[0];   // k < n => cycle
}
```

## When to use (LeetCode)
- Course schedule I/II, build order, task/recipe dependencies, alien dictionary.
- Any "order things respecting prerequisites" or "is this dependency graph acyclic".
- Use a `PriorityQueue` instead of a plain queue for the lexicographically smallest order.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Topological Sort (Kahn's algorithm)
Back: Build adjacency list + in-degree array.<br>Queue all in-degree-0 nodes; pop one, emit it, decrement neighbors' in-degree, enqueue any that hit 0.<br>If emitted count < n, there's a cycle -> no valid order.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398782-->
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
