---
tags: [algorithms, graph, comparison]
category: vs
related: [bfs, dfs]
---

## Description
BFS explores level by level using a queue. finds the shortest path in unweighted graphs. DFS explores as deep as possible using a stack/recursion. better for exhaustive search and backtracking problems.
## Examples
```java
// BFS - queue, level by level (shortest path)
Queue<Integer> queue = new LinkedList<>();

// DFS - stack (or recursion), go deep first
Stack<Integer> stack = new Stack<>();

// BFS finds shortest path in unweighted graphs
// DFS better for exhaustive search / backtracking
```

## Related Topics
- [[bfs|BFS]]
- [[dfs|DFS]]
- [[bfs|Queue]]
- [[stack-and-heap|Stack]]
- Graph Traversal
- Shortest Path

## Cards

```anki
START
Basic
When do you use BFS vs DFS?
Back: BFS (queue): shortest path in unweighted graphs, answer is close to root. Uses more memory. DFS (stack/recursion): exhaustive search, backtracking, cycle detection, topological sort. Uses less memory.
<!--ID: 1773439958838-->
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
