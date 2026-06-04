---
tags: [algorithms, graph, shortest-path]
category: algorithms
related: [bfs, topological-sort, union-find]
---

## Description
Dijkstra's algorithm computes shortest paths from one source in a weighted graph as long as all edge weights are non-negative. It repeatedly expands the currently cheapest reachable node using a min-heap, giving a standard time complexity of O((V + E) log V) with adjacency lists.

## Examples
```java
int[] dijkstra(List<int[]>[] graph, int src) {
    int[] dist = new int[graph.length];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    pq.offer(new int[]{0, src});

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d = cur[0], u = cur[1];
        if (d > dist[u]) continue;

        for (int[] edge : graph[u]) {
            int v = edge[0], w = edge[1];
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}
```

## Related Topics
- [[bfs]]
- [[topological-sort]]
- [[union-find]]

## Cards

```anki
START
Basic
You see: weighted graph, non-negative edges, shortest path from one source. What algorithm?
Back: Dijkstra. Use a min-heap of `(cost, node)` pairs and always process the cheapest next state. The key stale-entry guard is `if (d > dist[u]) continue;`.
END

START
Basic
When do you use Dijkstra vs BFS vs Bellman-Ford?
Back: BFS for unweighted graphs. Dijkstra for weighted graphs with non-negative edges. Bellman-Ford when negative edges are allowed, assuming no negative cycle. Dijkstra can give wrong answers if negative edges exist.
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