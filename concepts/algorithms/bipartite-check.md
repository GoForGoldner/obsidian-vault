---
tags: [algorithms, graph]
category: algorithms
related: [bfs, dfs, dynamic-programming]
---

## Description
A graph is bipartite if you can color every node with one of two colors so that no edge connects nodes of the same color, which is equivalent to saying the graph contains no odd-length cycle. The standard solution uses BFS or DFS to alternate colors across edges, checking every connected component in O(V + E) time.

## Examples
BFS coloring approach:
```java
int[] color = new int[n];
Arrays.fill(color, -1);

for (int start = 0; start < n; start++) {
    if (color[start] != -1) continue;

    Queue<Integer> queue = new LinkedList<>();
    queue.offer(start);
    color[start] = 0;

    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int nei : graph[node]) {
            if (color[nei] == -1) {
                color[nei] = 1 - color[node];
                queue.offer(nei);
            } else if (color[nei] == color[node]) {
                return false;
            }
        }
    }
}
return true;
```

## Related Topics
- [[bfs|BFS]]
- [[dfs|DFS]]
- Graph Coloring
- Odd Cycles
- Connected Components

## Cards

```anki
START
Basic
You see: need to check if a graph can be split into two groups with no edges within a group. What algorithm?
Back: Bipartite Check. BFS/DFS with 2-coloring: assign color 0 to start, alternate for neighbors. If a neighbor already has the same color → not bipartite (odd cycle found). Must check all components for disconnected graphs.
END

START
Basic
What graph property is equivalent to being bipartite?
Back: A graph is bipartite if and only if it has no odd-length cycle. During BFS or DFS coloring, a conflict where adjacent nodes need the same color is exactly evidence of an odd cycle.
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
