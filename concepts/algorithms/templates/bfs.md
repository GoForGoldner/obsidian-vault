---
tags: [algorithms, template, leetcode, neetcode, graphs, bfs, trees]
category: algorithms
related: [bfs, dfs, dijkstra, tree-traversal, topological-sort]
---

## Description
Queue-driven, level by level. On an **unweighted** graph the first time BFS reaches a node it
has done so by a shortest path - that is the only reason to prefer it over DFS.

Two devices make it reusable: the **level loop**, which turns distance into a counter, and
**multi-source seeding**, which answers "distance to the nearest source" for every cell in one
pass.

## Implementation
```java
int bfs(Collection<int[]> sources) {
    Deque<int[]> q = new ArrayDeque<>(sources);   // seed ALL sources at distance 0
    markVisited(sources);                         // mark on ENQUEUE, never on dequeue

    for (int dist = 0; !q.isEmpty(); dist++) {

        // Cache the size BEFORE the loop - the queue grows inside it.
        for (int sz = q.size(); sz > 0; sz--) {

            int[] cur = q.poll();
            if (isTarget(cur)) return dist;       // (1) the stop condition

            for (int[] nxt : neighbours(cur)) {   // (2) how neighbours are produced
                if (!passable(nxt)) continue;
                markVisited(nxt);
                q.offer(nxt);
            }
        }
    }

    return -1;
}
```

## Variations
| Want | (2) neighbours | Notes |
|---|---|---|
| grid shortest path | the 4 `DIRS` offsets | `seen[][]`, or write into the grid |
| spread from many starts at once | same | seed **every** source before expanding; this is the whole multi-source trick |
| "minutes until everything is reached" | same | count a level only when it did real work, and check a remaining-count at the end to detect unreachable cells |
| level-order tree traversal | `n.left`, `n.right` if non-null | one list per outer iteration |
| one node per depth (right side view) | same | take the element where `i == size - 1` |
| implicit graph (word transforms) | **generate** them on demand - mutate each position over the alphabet and keep the ones in the dictionary | never build the graph; `seen.add(x)` returning false doubles as the visited check |
| weights differ | - | BFS is wrong -> [[dijkstra]]. A **hop cap** -> [[bellman-ford]] |

## When to use (NeetCode 150)
- **Rotting Oranges**, **Walls and Gates** - multi-source.
- **Word Ladder** - implicit graph.
- **Binary Tree Level Order Traversal**, **Binary Tree Right Side View** - the tree variation.
- **Number of Islands** - either traversal; [[dfs]] is shorter.

## Pitfalls
- Mark visited when you **enqueue**. Marking on dequeue lets a node enter the queue many
  times and quietly turns O(V+E) exponential.
- Cache `q.size()` before the inner loop, or the next level bleeds into this one.
- Increment `dist` once per **level**, never per node.
- `ArrayDeque` rejects `null`.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the BFS skeleton - level loop and multi-source seeding
Back: Queue + visited; mark on ENQUEUE, never on dequeue (else nodes re-enter and it goes exponential).<br>Level loop: `for (int sz = q.size(); sz > 0; sz--)` around the expansion, with the size CACHED before the loop, and `dist` incremented once per outer iteration - not per node.<br>Multi-source: push EVERY source at distance 0 before expanding; one pass then gives each cell its distance to the nearest source.<br>Neighbours can be generated on demand for an implicit graph (mutate each position, keep dictionary hits) - never build it.<br>Full reference in the ## Implementation section of this note.
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
