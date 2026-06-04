---
tags: [algorithms, data-structures, graph]
category: algorithms
related: [dijkstra, topological-sort, bfs]
---

## Description
Union-Find, also called Disjoint Set Union, maintains a partition of elements into connected components and supports fast merges and connectivity checks. With path compression in `find` and union by rank in `union`, each operation is nearly O(1) amortized, which makes the structure a standard tool for connectivity queries and Kruskal's minimum spanning tree.

## Examples
```java
class UnionFind {
    int[] parent;
    int[] rank;

    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) parent[ra] = rb;
        else if (rank[ra] > rank[rb]) parent[rb] = ra;
        else {
            parent[rb] = ra;
            rank[ra]++;
        }
        return true;
    }
}
```

## Related Topics
- [[dijkstra]]
- [[topological-sort]]
- [[bfs]]

## Cards

```anki
START
Basic
You see: need to dynamically check if two elements are connected, or merge groups. What data structure?
Back: Union-Find. It combines `find()` with path compression and `union()` by rank, giving nearly O(1) amortized operations. A component counter can be decremented on each successful union.
<!--ID: 1780580932922-->
END

START
Basic
What do path compression and union by rank do in Union-Find?
Back: Path compression rewires nodes directly to the root during `find()`, flattening the tree. Union by rank attaches the shorter tree under the taller one. Together they make operations nearly O(1) amortized, more precisely inverse Ackermann.
<!--ID: 1780580932923-->
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