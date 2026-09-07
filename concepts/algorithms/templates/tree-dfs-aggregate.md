---
tags: [algorithms, template, leetcode, neetcode, trees, dfs, recursion]
category: algorithms
related: [tree-traversal, bst-impl, dfs]
---

## Description
The highest-leverage tree template. Say one sentence before writing anything:

> **"Each call returns X to its parent, and separately I track Y."**

X and Y are usually *different expressions*, and that is the whole insight: a parent can only
extend a **single downward path**, while the answer may bend through a node and use both
sides. Returning the bent value would be a lie to the parent.

## Implementation
```java
private int best;                     // Y - the answer, accumulated on the side

int solve(TreeNode root) {
    best = worstCase();               // reset, so repeat calls are clean
    post(root);
    return best;
}

private int post(TreeNode n) {
    if (n == null) return identity();          // 0 for heights, 0 for clamped sums

    int l = post(n.left);                      // children finish FIRST - post-order
    int r = post(n.right);

    best = combine(best, bend(n, l, r));       // (1) Y: the path bending through n

    return extend(n, l, r);                    // (2) X: what the parent can extend
}
```

## Variations
| Problem | (1) bend / track | (2) return to parent |
|---|---|---|
| max depth | - | `1 + max(l, r)` |
| balanced? | - | `1 + max(l, r)`, or **`-1` as a failure flag** propagated up immediately - one pass instead of recomputing height everywhere |
| diameter | `max(best, l + r)` | `1 + max(l, r)` |
| max path sum | `max(best, n.val + l + r)` | `n.val + max(l, r)` - and clamp each child with `max(child, 0)`, because a negative branch is worth skipping entirely |
| count nodes beating an ancestor | information flows **down**: pass `maxSoFar` as a parameter, return a count up | `count + left + right` |
| lowest common ancestor | - | base case `n == null \|\| n == p \|\| n == q` -> return `n`; if **both** sides come back non-null, this node is the LCA; else pass up whichever is non-null |

## When to use (NeetCode 150)
- **Maximum Depth**, **Balanced Binary Tree**, **Diameter of Binary Tree**,
  **Binary Tree Maximum Path Sum**, **Count Good Nodes**, **Lowest Common Ancestor**.
- In a **BST** the ordering gives a shorter iterative answer -> [[bst-impl]].

## Pitfalls
- Never return the bent value (`l + r + n.val`) to the parent. X and Y must differ.
- Seed `best` with `Integer.MIN_VALUE` when values can be negative, not `0`.
- The `-1` failure flag only works because heights are non-negative. Do not reuse it for a
  quantity that can legitimately be negative.
- Diameter here counts **edges** (`l + r`); some statements want nodes (`l + r + 1`).

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the tree DFS aggregate skeleton (return X, track Y)
Back: State it first: "each call RETURNS X to its parent, and separately I TRACK Y in a field". They differ because a parent can only extend a SINGLE downward path, while the answer may bend through a node and use both sides.<br>Post-order: recurse left, recurse right, update `best` with the BEND, return the EXTEND.<br>Diameter: bend `l + r`, return `1 + max(l, r)`. Max path sum: bend `n.val + l + r`, return `n.val + max(l, r)`, clamping each child at `max(child, 0)`.<br>Balanced: return `-1` as a failure flag and propagate it up immediately - one pass, not height-per-node.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040480-->
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
