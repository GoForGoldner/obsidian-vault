---
tags: [algorithms, graph, traversal]
category: algorithms
related: [bfs, stack-and-heap]
---

## Description
Depth-First Search explores a graph by going as deep as possible down each branch before backtracking. Uses a stack (or recursion). Good for pathfinding, cycle detection, and topological sorting.
## Examples
```java
Stack<Integer> stack = new Stack<>();
Set<Integer> visited = new HashSet<>();
stack.push(start);

while (!stack.isEmpty()) {
    int node = stack.pop();
    if (visited.contains(node)) continue;
    visited.add(node);
    for (int neighbor : graph.get(node)) {
        stack.push(neighbor);
    }
}
```

Recursive version:
```java
void dfs(int node, Set<Integer> visited, Map<Integer, List<Integer>> graph) {
    visited.add(node);
    for (int neighbor : graph.get(node)) {
        if (!visited.contains(neighbor)) {
            dfs(neighbor, visited, graph);
        }
    }
}
```

## Related Topics
- [[bfs|BFS]]
- [[stack-and-heap|Stack]]
- [[dfs|Recursion]]
- [[dfs|Topological Sort]]
- [[dfs|Graph]]

## Cards
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
