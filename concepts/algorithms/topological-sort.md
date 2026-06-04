---
tags: [algorithms, graph, dag]
category: algorithms
related: [dfs, bfs, dijkstra]
---

## Description
Topological sort produces a linear ordering of vertices in a directed acyclic graph so every edge `u -> v` places `u` before `v`. The two classic approaches are Kahn's algorithm with in-degrees and a queue, or DFS with reverse post-order, and both can be used to detect cycles because a graph with a cycle cannot produce a full valid ordering.

## Examples
```java
List<Integer> topoSort(List<Integer>[] graph, int n) {
    int[] indegree = new int[n];
    for (int u = 0; u < n; u++) {
        for (int v : graph[u]) indegree[v]++;
    }

    Queue<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) queue.offer(i);
    }

    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order.add(u);
        for (int v : graph[u]) {
            if (--indegree[v] == 0) queue.offer(v);
        }
    }
    return order;
}
```

## Related Topics
- [[dfs]]
- [[bfs]]
- [[dijkstra]]

## Cards

```anki
START
Basic
You see: DAG, need to process nodes in dependency order. What algorithm?
Back: Topological Sort. Kahn's algorithm starts with all in-degree `0` nodes, removes their outgoing edges, and repeats. If `result.size() != n`, the graph contains a cycle. Common uses: build systems, course scheduling, and task dependencies.
<!--ID: 1780580932928-->
END

START
Basic
How does Kahn's algorithm detect a cycle?
Back: If the final ordering has fewer than `n` nodes, some vertices never reached in-degree `0`, which means a cycle blocked them. Every valid topological ordering of a DAG must contain all `n` nodes.
<!--ID: 1780580932930-->
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