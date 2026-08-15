---
tags: [data-structures, implementation, leetcode, graphs]
category: data-structures
related: [union-find, topological-sort, bfs, dfs]
---

## Description
Disjoint Set Union (DSU). Tracks a partition of elements into disjoint sets and
answers "are a and b connected?" in near-constant amortized time using **path
compression** (in `find`) plus **union by size/rank**. Amortized O(α(n)) per op.

## Implementation
```java
class UnionFind {
    private final int[] parent;
    private final int[] size;   // size of each root's component
    private int count;          // number of disjoint components

    UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;   // each node starts as its own root
            size[i] = 1;
        }
    }

    // find root with path compression
    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]]; // path halving
            x = parent[x];
        }
        return x;
    }

    // union by size; returns false if already connected
    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;        // attach smaller under larger
        size[ra] += size[rb];
        count--;
        return true;
    }

    boolean connected(int a, int b) { return find(a) == find(b); }
    int componentCount() { return count; }
    int componentSize(int x) { return size[find(x)]; }
}
```

## When to use (LeetCode)
- Connectivity / "number of connected components" / "redundant connection".
- Detecting a cycle while adding undirected edges (`union` returns false).
- Kruskal's MST, accounts merge, grid island counting done incrementally.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Union-Find (Disjoint Set Union)
Back: `parent[]` + `size[]`, each node its own root initially.<br>`find`: walk to root with path halving (`parent[x] = parent[parent[x]]`).<br>`union`: attach smaller root under larger, decrement component count; return false if same root.<br>Full reference in the ## Implementation section of this note.
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
