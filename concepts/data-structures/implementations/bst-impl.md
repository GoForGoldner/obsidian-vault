---
tags: [data-structures, implementation, leetcode, trees]
category: data-structures
related: [bst(binary-search-tree), dfs, bfs]
---

## Description
Binary search tree with iterative insert/search and recursive delete (the tricky
op: a two-child node is replaced by its in-order successor). Balanced ops are
O(log n); degenerates to O(n) if inserted in sorted order.

## Implementation
```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int v) { val = v; }
}

class BST {
    TreeNode root;

    void insert(int val) { root = insert(root, val); }
    private TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) node.left = insert(node.left, val);
        else if (val > node.val) node.right = insert(node.right, val);
        return node; // ignore duplicates
    }

    boolean search(int val) {
        TreeNode cur = root;
        while (cur != null) {
            if (val == cur.val) return true;
            cur = val < cur.val ? cur.left : cur.right;
        }
        return false;
    }

    void delete(int val) { root = delete(root, val); }
    private TreeNode delete(TreeNode node, int val) {
        if (node == null) return null;
        if (val < node.val)      node.left  = delete(node.left, val);
        else if (val > node.val) node.right = delete(node.right, val);
        else {
            if (node.left == null)  return node.right;   // 0 or 1 child
            if (node.right == null) return node.left;
            TreeNode succ = node.right;                  // in-order successor
            while (succ.left != null) succ = succ.left;
            node.val = succ.val;
            node.right = delete(node.right, succ.val);   // remove successor
        }
        return node;
    }

    // in-order traversal -> ascending order
    void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);
        inorder(node.right, out);
    }
}
```

## When to use (LeetCode)
- Validate-BST, kth-smallest (in-order), range-sum, insert/delete into a BST.
- In-order traversal gives sorted output; successor = leftmost of right subtree.
- For guaranteed balance, prefer `TreeMap`/`TreeSet` (red-black) in real problems.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Binary Search Tree (insert / search / delete)
Back: Insert/search compare and go left (`<`) or right (`>`).<br>Delete: leaf/one-child returns the other child; two children -> copy in-order successor (leftmost of right subtree) then delete it.<br>In-order traversal yields sorted order.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398760-->
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
