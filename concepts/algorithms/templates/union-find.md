---
tags: [algorithms, template, leetcode, neetcode, graphs, union-find]
category: algorithms
related: [union-find, dfs, minimum-spanning-tree]
---

## Description
Disjoint Set Union: answers "are these two connected?" in near-constant amortised time, using
**path compression** in `find` plus **union by size**. Both are needed - either alone still
degrades on adversarial input.

Pick it over [[dfs]] when edges arrive **incrementally** and you must answer between arrivals;
DFS would re-traverse the graph per query. Pick DFS when the graph is fixed up front.

Two return values do most of the work: `union` returning **false** means "already connected",
i.e. this edge closes a cycle; and `count` tracks components without a separate scan.

## Implementation
```java
class UnionFind {

    private final int[] parent, size;
    private int count;                        // number of disjoint components

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        count = n;

        for (int i = 0; i < n; i++) {         // every node starts as its own root
            parent[i] = i;
            size[i] = 1;
        }
    }

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];    // path halving - flattens as it walks
            x = parent[x];
        }
        return x;
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);       // find BOTH roots before comparing

        if (ra == rb) return false;           // already connected -> this edge makes a cycle

        // Attach the smaller tree under the larger, so depth grows as slowly as possible.
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }

        parent[rb] = ra;
        size[ra] += size[rb];
        count--;

        return true;
    }

    int componentCount() { return count; }
    int componentSize(int x) { return size[find(x)]; }
}
```

## Variations
| Want | How |
|---|---|
| number of components | union every edge, read `count` |
| the edge that creates a cycle | the first `union` returning **false** |
| is it a valid tree | every `union` returns true **and** `count == 1` at the end |
| size of a node's component | `size[find(x)]` |
| minimum spanning tree | sort edges by weight, keep the ones where `union` returns true -> [[minimum-spanning-tree]] |
| 2D grid cells | flatten with `r * cols + c` - the multiplier is the row **width** |

## When to use (NeetCode 150)
- **Number of Connected Components in an Undirected Graph**, **Redundant Connection**,
  **Graph Valid Tree**, **Min Cost to Connect All Points**.
- **Number of Islands** works but [[dfs]] is shorter; DSU only wins in the streaming variant.

## Pitfalls
- Include **both** optimisations.
- Call `find` on both ends before comparing - comparing `parent[a]` to `parent[b]` is wrong.
- DSU handles **undirected** connectivity only. It cannot detect a directed cycle.
- `r * cols + c`, not `r * rows + c`.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: Union-Find (DSU) with path compression and union by size
Back: `parent[]` + `size[]`, every node its own root, `count = n`.<br>`find`: walk to the root with path halving, `parent[x] = parent[parent[x]]`.<br>`union`: find BOTH roots first; equal -> return false (already connected, so this edge closes a cycle); else attach the smaller root under the larger, add the sizes, `count--`, return true. Both optimisations are required.<br>Uses: components = `count`; cycle edge = first false union; valid tree = all unions true AND count 1. Grid cells flatten as `r * cols + c`.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398793-->
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
