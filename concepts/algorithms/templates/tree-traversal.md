---
tags: [algorithms, template, leetcode, neetcode, trees, dfs]
category: algorithms
related: [tree-dfs-aggregate, bst-impl, bfs, tree-serialize]
---

## Description
One recursion, and a single decision: **where does the visit sit relative to the two
recursive calls?** That position is the entire difference between the traversal orders.

Level-order is the exception - it needs a queue, not recursion, and it is the same level loop
as [[bfs]].

## Implementation
```java
void traverse(TreeNode n, List<Integer> out) {
    if (n == null) return;                  // the only base case a tree recursion needs

    // out.add(n.val);                      // (A) PRE-order  - before both children
    traverse(n.left, out);
    out.add(n.val);                         // (B) IN-order   - between them
    traverse(n.right, out);
    // out.add(n.val);                      // (C) POST-order - after both children
}

// Iterative in-order: needed when you must STOP EARLY, or the tree is too deep to recurse.
List<Integer> inorderIterative(TreeNode root) {
    Deque<TreeNode> st = new ArrayDeque<>();
    TreeNode cur = root;
    List<Integer> out = new ArrayList<>();

    while (cur != null || !st.isEmpty()) {
        while (cur != null) { st.push(cur); cur = cur.left; }   // dive left, remembering the way

        cur = st.pop();
        out.add(cur.val);                                        // visit
        cur = cur.right;                                         // then the right subtree
    }

    return out;
}
```

## Variations
| Want | Change |
|---|---|
| serialise / copy / push state **down** | (A) pre-order - the root is fixed before its children |
| sorted output from a BST | (B) in-order |
| bottom-up aggregates, deletion | (C) post-order - children are done before the parent |
| one node per depth | queue + level loop -> [[bfs]] |
| compare two trees in lockstep | recurse on both at once; base case `if (a == null \|\| b == null) return a == b;` |
| mirror / invert | swap the children, then recurse into both |
| search a subtree everywhere | at every node of the big tree, run the lockstep comparison against the target |

## When to use (NeetCode 150)
- **Same Tree**, **Subtree of Another Tree**, **Invert Binary Tree** - structural recursion.
- **Kth Smallest Element in a BST** - iterative in-order, because it can stop at `k` instead
  of walking the whole tree. See [[bst-impl]].
- **Binary Tree Level Order Traversal**, **Binary Tree Right Side View** -> [[bfs]].
- Anything where a node's answer depends on its children's answers -> [[tree-dfs-aggregate]].

## Pitfalls
- Recursion depth is the tree **height**; a degenerate 10^5-node tree overflows the stack, so
  know the iterative form.
- `if (a == null || b == null) return a == b;` is the compact both-null-or-one-null base case.
- Null-check children before enqueueing - `ArrayDeque` rejects `null`.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the tree traversal skeleton (all four orders) and iterative in-order
Back: One recursion, `if (n == null) return;`, and the ONLY difference between orders is where the visit sits relative to the two recursive calls: before both = pre, between = in, after both = post. Level-order is the odd one out - queue, not recursion.<br>Iterative in-order: `while (cur != null || !st.isEmpty())`; inner `while (cur != null) { st.push(cur); cur = cur.left; }` to dive left, then `cur = st.pop()`, VISIT, `cur = cur.right`. Use it to stop early (kth smallest) or when the tree is too deep to recurse.<br>Two trees in lockstep: base case `if (a == null || b == null) return a == b;`.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040498-->
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
