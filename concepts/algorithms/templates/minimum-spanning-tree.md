---
tags: [algorithms, template, leetcode, neetcode, graphs, greedy]
category: algorithms
related: [union-find, dijkstra, greedy-scans]
---

## Description
Connect every node at minimum **total** edge cost. The useful thing to notice is how little
either algorithm differs from something you already know:

- **Prim** is [[dijkstra]] with one line changed - the heap key is the edge weight `w`, not
  `dist[u] + w`. Dijkstra minimises distance *from a source*; Prim minimises the cost of
  *joining the tree*. Reusing Dijkstra verbatim gives a shortest-path tree, which is
  generally **not** minimum weight.
- **Kruskal** is a sort plus [[union-find]].

Prim wins on dense or **implicit** graphs (where generating a weight beats materialising all
`n^2` edges); Kruskal wins when the edges already are a list.

## Implementation
```java
// Prim - lazy, same shape as Dijkstra.
int prim(int n) {
    boolean[] inTree = new boolean[n];
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(e -> e[0]));
    pq.offer(new int[]{0, 0});                          // {weight, node} - start anywhere

    int total = 0, taken = 0;

    while (taken < n) {
        int[] top = pq.poll();
        int w = top[0], u = top[1];

        if (inTree[u]) continue;                        // stale entry, as in Dijkstra

        inTree[u] = true;
        total += w;
        taken++;

        for (int v = 0; v < n; v++)                     // generated, not stored
            if (!inTree[v])
                pq.offer(new int[]{weight(u, v), v});   // key is the EDGE weight alone
    }

    return total;
}
```

## Variations
| Want | Change |
|---|---|
| Kruskal instead | sort edges by weight, then keep each edge whose `union` returns **true**; stop at `n - 1` edges. Fewer than `n - 1` at the end means the graph was disconnected |
| the edges themselves, not just the cost | record `{from, to}` alongside the weight |
| points on a plane | `weight(u, v)` is the Manhattan or Euclidean distance - never build the edge list |

A spanning tree has exactly `n - 1` edges. That count is the disconnected-graph check.

## When to use (NeetCode 150)
- **Min Cost to Connect All Points** - either algorithm; Prim avoids building all
  `n(n-1)/2` edges, which matters at n = 1000.
- Cue: "connect **all** nodes at minimum cost". If the question wants the cheapest route
  between *two* nodes, that is [[dijkstra]] - different objective, different tree.

## Pitfalls
- The key is `w`, not `d + w`. This is the entire difference from Dijkstra.
- Skip stale pops with `if (inTree[u]) continue;` or nodes get counted twice.
- Sorting `int[][]` with `a[2] - b[2]` overflows on large weights.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: minimum spanning tree (Prim, and Kruskal in one line each)
Back: Prim = lazy Dijkstra with ONE line changed: the heap key is the EDGE WEIGHT `w`, not `dist[u] + w`. Pop the cheapest, `continue` if already in the tree, else mark it, add `w`, and push its outgoing edges. Stop after n nodes.<br>Kruskal = sort edges by weight + union-find: keep every edge whose `union` returns true, stop at n-1 edges; fewer than n-1 means disconnected.<br>Dijkstra minimises distance FROM A SOURCE, Prim minimises the cost of JOINING THE TREE - reusing Dijkstra verbatim gives a shortest-path tree, not a minimum-weight one.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040473-->
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
