---
tags: [algorithms, template, leetcode, neetcode, trees, bst]
category: algorithms
related: [bst(binary-search-tree), tree-traversal, tree-dfs-aggregate]
---

## Description
Every BST problem rests on one fact: **each node constrains an open interval for its whole
subtree**, and in-order traversal therefore yields sorted order. Once you carry the interval,
you stop needing any comparison against a neighbour.

## Implementation
```java
// The walk: at every node, the comparison tells you which single subtree can contain
// the answer, so the other one is discarded. O(h) with no recursion needed.
TreeNode walk(TreeNode root, int target) {
    TreeNode cur = root;

    while (cur != null && !isAnswer(cur, target))     // (1) stop condition
        cur = goLeft(cur, target) ? cur.left          // (2) which way to descend
                                  : cur.right;

    return cur;
}

// The interval: pass the allowed open range down. Comparing only against the parent is
// the classic wrong answer - a node deep in a left subtree can beat a distant ancestor.
boolean inRange(TreeNode n, long low, long high) {    // start (Long.MIN, Long.MAX)
    if (n == null) return true;
    if (n.val <= low || n.val >= high) return false;

    return inRange(n.left,  low,   n.val)             // left subtree is capped by n
        && inRange(n.right, n.val, high);             // right subtree is floored by n
}
```

## Variations
| Want | (1) stop when | (2) descend |
|---|---|---|
| find a value | `cur.val == target` | `target < cur.val` |
| insert | `cur` is null (recursive form returns the new node) | same comparison |
| lowest common ancestor | `p` and `q` fall on **opposite** sides, or one is `cur` - they split here | both smaller -> left, both larger -> right |
| delete | node found | 0-or-1 child returns the other child; **two children** -> copy the in-order successor (leftmost of the right subtree), then delete that successor from the right subtree |
| k-th smallest | - | not a walk: iterative in-order with `if (--k == 0) return`, so it stops at `k` -> [[tree-traversal]] |
| validate | - | the `inRange` form above |

Prefer `TreeMap` / `TreeSet` (`floorKey`, `ceilingKey`, `headMap`) in real problems - they give
guaranteed balance for free.

## When to use (NeetCode 150)
- **Validate Binary Search Tree** - the interval form.
- **Kth Smallest Element in a BST** - iterative in-order.
- **Lowest Common Ancestor of a BST** - the walk; a plain binary tree needs the recursive
  return-from-both-sides version in [[tree-dfs-aggregate]].

## Pitfalls
- Validation bounds must be `long` - a node holding `Integer.MIN_VALUE` breaks an `int` sentinel.
- Strict `<` / `>`: BSTs here disallow duplicates.
- Sorted input degenerates the tree to a linked list, O(n) per op.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the BST walk, and validation by interval
Back: The walk: `while (cur != null && !isAnswer(cur))` descend into the ONE subtree that can contain the answer (`target < cur.val` -> left) - the other is discarded. O(h), no recursion.<br>LCA is the same walk: both values smaller -> left, both larger -> right, otherwise they SPLIT here and this is the LCA.<br>Validate: pass an open interval DOWN - `inRange(n.left, low, n.val)` and `inRange(n.right, n.val, high)`, with `long` bounds. Comparing only against the parent is the classic wrong answer.<br>Delete with two children: copy the in-order successor, then delete it from the right subtree.<br>Full reference in the ## Implementation section of this note.
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
