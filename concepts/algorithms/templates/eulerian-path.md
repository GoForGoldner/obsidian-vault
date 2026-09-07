---
tags: [algorithms, template, leetcode, neetcode, graphs, dfs]
category: algorithms
related: [dfs, topological-sort]
---

## Description
Walk a graph consuming **every edge exactly once**. Hierholzer's algorithm, and the reason it
needs its own template is that the natural greedy walk gets stuck - you can burn the edge you
needed to leave by.

The fix is counter-intuitive and worth memorising as a rule:
**append a node to the result only once it has no edges left**, then reverse. A node that
strands you is emitted early in the reversed order, i.e. late in the real route, which is
exactly where a dead end belongs.

## Implementation
```java
List<String> route = new LinkedList<>();

void visit(String u, Map<String, PriorityQueue<String>> adj) {
    PriorityQueue<String> out = adj.get(u);

    // Consume every outgoing edge before recording u at all.
    while (out != null && !out.isEmpty())
        visit(out.poll(), adj);            // poll() removes the edge - that IS the marking

    route.addFirst(u);                     // post-order + addFirst == reversed order
}
```

## Variations
| Want | Change |
|---|---|
| lexicographically smallest route | `PriorityQueue` per node, as above; a plain list/stack gives *some* valid route |
| a `List<int[]>` graph | keep a per-node index pointer instead of polling, and advance it |
| does one even exist | in-degree must equal out-degree at every node, except one node with `out - in == 1` (the start) and one with `in - out == 1` (the end) |

## When to use (NeetCode 150)
- **Reconstruct Itinerary** - the only problem in the 150 that needs this. Reach for a plain
  [[dfs]] with backtracking and it either times out or returns the wrong route.
- Cue: "use **every** ticket / edge exactly once", as opposed to visiting every *node*
  (which is Hamiltonian, and NP-hard).

## Pitfalls
- Do not mark **nodes** visited; you mark **edges**, by removing them. Nodes are revisited
  freely, which is the entire point.
- `route.addFirst` (or reverse at the end). Appending gives the route backwards.
- Recording the node before draining its edges produces a route that skips edges.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: Hierholzer's algorithm (Eulerian path - use every edge exactly once)
Back: Recurse while the node still HAS unused edges, removing each edge as you take it (`out.poll()` IS the marking) - mark EDGES, never nodes; nodes are revisited freely.<br>Then `route.addFirst(u)` on the way out: post-order plus addFirst gives the route reversed into the right order. Appending instead gives it backwards.<br>The rule: append a node only once it has no edges left, so a node that strands you lands late in the real route - which is where a dead end belongs.<br>PriorityQueue per node for the lexicographically smallest route.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040522-->
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
