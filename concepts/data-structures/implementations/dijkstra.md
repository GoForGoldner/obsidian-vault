---
tags: [data-structures, implementation, leetcode, graphs]
category: data-structures
related: [dijkstra, bfs, heap-priority-queue]
---

## Description
Shortest paths from a source on a graph with **non-negative** weights. A min-heap
(priority queue) always expands the closest unfinalized node. Lazy variant: push
duplicates and skip a popped entry if its distance is stale. O(E log V).

## Implementation
```java
// adj.get(u) = list of {v, weight}. Returns dist[] from src (Integer.MAX_VALUE if unreachable).
int[] dijkstra(int n, List<List<int[]>> adj, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    // pq entries: {distanceSoFar, node}, ordered by distance
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});

    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0], u = top[1];
        if (d > dist[u]) continue;                 // stale entry, skip
        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});   // lazy: may push a node twice
            }
        }
    }
    return dist;
}
```

## When to use (LeetCode)
- Weighted shortest path with non-negative edges (network delay, cheapest flights
  with a hop cap, path with min effort — swap the relaxation for max/min-of-max).
- If all weights are equal, plain BFS is simpler; negative weights need Bellman-Ford.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Dijkstra (shortest path, non-negative weights)
Back: `dist[]` = INF except src=0; min-heap of `{dist, node}`.<br>Pop smallest; skip if `d > dist[u]` (stale). Relax each edge: if `dist[u]+w < dist[v]`, update and push `{dist[v], v}`.<br>O(E log V). Non-negative weights only.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398778-->
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
