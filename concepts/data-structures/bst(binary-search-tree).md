---
tags: [data-structures, trees]
category: data-structures
related: [hash-table, dfs, bfs]
---

## Description
A binary tree where each node has at most 2 children (left and right), with the property: left subtree < root < right subtree.

Traversal orders:
Inorder (Left -> Root -> Right). gives sorted order
Preorder (Root -> Left -> Right). good for copying trees
Postorder (Left -> Right -> Root). good for deleting trees
Level-order (BFS). level by level

O(log n) search, insert, and delete when balanced. O(n) when unbalanced (degenerates into a linked list).
## Examples
```java
class TreeNode {
    int val;
    TreeNode left, right;
}

// Search: O(log n) when balanced
TreeNode search(TreeNode root, int target) {
    if (root == null || root.val == target) return root;
    if (target < root.val) return search(root.left, target);
    return search(root.right, target);
}

// Inorder traversal -> sorted output
void inorder(TreeNode root) {
    if (root == null) return;
    inorder(root.left);      // L
    System.out.print(root.val + " ");  // Root
    inorder(root.right);     // R
}
```

## Related Topics
- [[hash-table|Hash Table]]
- [[dfs|DFS]]
- [[bfs|BFS]]
- [[bst(binary-search-tree)|AVL Tree]]
- [[bst(binary-search-tree)|Red-Black Tree]]
- [[bst(binary-search-tree)|Binary Heap]]

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
