---
tags: [algorithms, template, leetcode, neetcode, graphs]
category: algorithms
related: [topological-sort, bfs, dfs, union-find]
---

## Description
An ordering of a **DAG** where every edge `u -> v` puts `u` first. Kahn's algorithm - repeatedly
emit nodes whose in-degree has reached 0 - is the default, because the emitted **count** is
also the cycle check: fewer than `n` emitted means no valid order exists.

Usually the sort is trivial and **building the graph is the actual problem**. Read the edge
direction off the statement out loud; reversing it yields a perfectly valid order for the
wrong graph.

## Implementation
```java
int[] kahn(int n, int[][] edges) {                 // edges[i] = {u, v}: u must precede v
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[n];

    for (int[] e : edges) {                        // (1) one pass builds both structures
        adj.get(e[0]).add(e[1]);
        indeg[e[1]]++;
    }

    Deque<Integer> q = new ArrayDeque<>();         // (2) swap for a PriorityQueue if the
    for (int i = 0; i < n; i++)                    //     smallest order is wanted
        if (indeg[i] == 0) q.offer(i);

    int[] order = new int[n];
    int k = 0;

    while (!q.isEmpty()) {
        int u = q.poll();
        order[k++] = u;

        for (int v : adj.get(u))
            if (--indeg[v] == 0) q.offer(v);       // v's last prerequisite just cleared
    }

    return k == n ? order : new int[0];            // k < n  =>  a cycle
}
```

## Variations
| Want | Change |
|---|---|
| feasibility only ("can I finish?") | `kahn(...).length == n` |
| lexicographically smallest order | `PriorityQueue` instead of `ArrayDeque` |
| the DFS form | post-order into a stack, then reverse - shorter, but needs a separate colour-based cycle check, so Kahn is the better default |
| **edges from sorted words** | compare each adjacent pair and take an edge from the **first** differing character only; nothing after it is implied. A word appearing *after* its own prefix (`"abc"` then `"ab"`) is invalid input, not a cycle |
| duplicate edges in the input | de-duplicate with a `Set`, or in-degrees inflate and nothing ever reaches 0 |

## When to use (NeetCode 150)
- **Course Schedule** (feasibility), **Course Schedule II** (the order). Note `[a, b]` means
  "b before a", so the edge is `b -> a`.
- **Alien Dictionary** - the sort is four lines; the graph construction and the prefix case
  are the problem.
- Undirected connectivity instead of ordering -> [[union-find]] or [[dfs]].

## Pitfalls
- Edge direction. Say it out loud before typing.
- `k < n` is the **only** cycle check needed - do not also run a colour pass.
- Build adjacency and in-degrees in the same pass, or they drift.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: Kahn's topological sort
Back: One pass over the edges builds the adjacency list AND `indeg[]` together. Enqueue every in-degree-0 node; pop, emit, and for each neighbour `if (--indeg[v] == 0) q.offer(v)`.<br>If the emitted count `< n` there is a cycle and no valid order - that count IS the cycle check, so no separate colour pass.<br>PriorityQueue instead of a queue gives the lexicographically smallest order.<br>Read the edge direction off the statement out loud - reversing it gives a valid order for the WRONG graph. Building the graph is usually the real problem.<br>Full reference in the ## Implementation section of this note.
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
