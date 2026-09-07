---
tags: [algorithms, template, leetcode, neetcode, graphs, shortest-path]
category: algorithms
related: [dijkstra, bfs, bellman-ford, minimum-spanning-tree, heap-top-k]
---

## Description
Cheapest path from a source with **non-negative** weights. A min-heap always expands the
closest unfinalised node, so the first time a node is popped its cost is final.

The *lazy* form below pushes duplicates and skips stale pops - shorter than a decrease-key
heap and just as fast in practice. O(E log V).

The reusable insight: **the heap key does not have to be a sum.** Change the combine step and
the objective changes with it.

## Implementation
```java
int[] dijkstra(int n, List<List<int[]>> adj, int src) {      // adj entry = {to, weight}
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(e -> e[0]));
    pq.offer(new int[]{0, src});                             // {costSoFar, node}

    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0], u = top[1];

        if (d > dist[u]) continue;                           // stale duplicate - skip it

        for (int[] e : adj.get(u)) {
            int nd = combine(d, e[1]);                       // (1) the objective

            if (nd < dist[e[0]]) {                           // strictly better -> relax
                dist[e[0]] = nd;
                pq.offer(new int[]{nd, e[0]});
            }
        }
    }

    return dist;
}
```

## Variations
| Objective | (1) combine |
|---|---|
| cheapest total cost (classic) | `d + w` |
| minimise the **largest single edge** (bottleneck) | `max(d, w)` |
| maximum-probability path | `d * w`, with a **max**-heap |
| fewest steps, all weights equal | none - use [[bfs]], it is correct and cheaper |
| a cap on the number of edges used | Dijkstra is **wrong** -> [[bellman-ford]] |
| connect all nodes, not reach one | key on `w` alone -> [[minimum-spanning-tree]] |

For a grid, the "adjacency list" is the `DIRS` array and `dist` is a 2D array; nothing else
changes. Returning at the **first pop** of the goal is safe and saves the rest of the walk.

## When to use (NeetCode 150)
- **Network Delay Time** - classic; answer is `max(dist)`, or `-1` if any is unreachable.
- **Swim in Rising Water** - the bottleneck combine (or binary search the answer plus a
  reachability check, see [[binary-search]]).
- **Cheapest Flights Within K Stops** - do **not** use this. A hop cap breaks the
  first-pop-is-final guarantee, because a costlier path can use fewer stops.

## Pitfalls
- Any negative edge invalidates the algorithm outright.
- Keep the `if (d > dist[u]) continue;` skip, or the lazy form does redundant expansions.
- `(a, b) -> a[0] - b[0]` overflows when you push `Integer.MAX_VALUE`-ish sentinels; use
  `Comparator.comparingInt`.
- Uniform weights: reaching for Dijkstra is wasted effort.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: lazy Dijkstra, and the combine step that changes the objective
Back: `dist[]` = INF except `dist[src] = 0`; min-heap of `{costSoFar, node}`.<br>Pop the smallest, `if (d > dist[u]) continue` to skip stale duplicates, then for each edge compute the new cost and relax only if strictly better, pushing the new pair. O(E log V), non-negative weights only.<br>The heap key need not be a SUM - swap the combine: `d + w` = cheapest total, `max(d, w)` = minimise the largest edge (bottleneck), `d * w` with a max-heap = highest probability.<br>Equal weights -> use BFS. Hop cap -> Bellman-Ford, because a costlier path may use fewer stops.<br>Full reference in the ## Implementation section of this note.
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
