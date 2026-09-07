---
tags: [algorithms, template, leetcode, neetcode, graphs, shortest-path]
category: algorithms
related: [dijkstra, bfs]
---

## Description
Relax **every edge**, repeatedly. Slower than [[dijkstra]] at O(V*E), but it is the right tool
in the two cases Dijkstra cannot handle:

1. **negative weights** (and, with one extra round, detecting a negative cycle);
2. **a cap on how many edges you may use** - after `r` rounds `dist[v]` is the cheapest path
   using **at most `r` edges**, so the round count *is* a hop budget.

The correctness trick for the capped version: relax from a **snapshot** of the previous round,
so a single round cannot chain two edges together.

## Implementation
```java
int[] relaxRounds(int n, int[][] edges, int src, int rounds) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    for (int r = 0; r < rounds; r++) {

        int[] prev = dist.clone();                 // (1) THE trick - read last round only

        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];

            if (prev[u] == Integer.MAX_VALUE) continue;   // unreached: adding w would overflow

            dist[v] = Math.min(dist[v], prev[u] + w);
        }
    }

    return dist;
}
```

## Variations
| Want | Change |
|---|---|
| at most `k` **stops** | `rounds = k + 1` - k stops means k+1 edges. Off-by-one here is the standard failure |
| plain shortest path, negative weights allowed | `rounds = n - 1` (the longest simple path), and drop the `clone()` - chaining within a round is harmless and converges faster |
| detect a negative cycle | run one **extra** round; if anything still improves, a negative cycle exists |

## When to use (NeetCode 150)
- **Cheapest Flights Within K Stops** - the capped version. The only problem in the 150 that
  needs this, and precisely the one where [[dijkstra]] gives a wrong answer that passes
  small tests.
- Uniform weights -> [[bfs]]. Non-negative and no hop cap -> [[dijkstra]].

## Pitfalls
- **Without the `clone()`**, one round can relax `a -> b` and then `b -> c` using the freshly
  written `dist[b]`, spending two edges of the budget in one round. It still returns an
  answer - just for the uncapped problem.
- `k` stops = `k + 1` edges = `k + 1` rounds.
- Guard the `MAX_VALUE` sentinel before adding, or it overflows negative and poisons
  everything downstream.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: Bellman-Ford, and the hop-capped variant
Back: Relax EVERY edge, repeatedly. After r rounds `dist[v]` is the cheapest path using AT MOST r edges - the round count is a hop budget.<br>Capped: loop `k+1` rounds (k stops = k+1 edges) and relax from a `dist.clone()` SNAPSHOT of the previous round. Without the clone, one round chains two edges and silently solves the UNCAPPED problem.<br>Plain version: `n-1` rounds, no clone needed; one extra round that still improves anything means a negative cycle.<br>Guard the INF sentinel before adding a weight or it overflows negative.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040380-->
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
