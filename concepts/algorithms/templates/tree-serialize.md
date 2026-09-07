---
tags: [algorithms, template, leetcode, neetcode, trees, strings]
category: algorithms
related: [tree-traversal, hash-map-counting]
---

## Description
Flattening a tree and rebuilding it. Both directions are **pre-order recursion driven by a
shared cursor**, and the shared cursor is the whole trick: each call consumes exactly its own
subtree, which leaves the cursor correct for its sibling.

Pre-order is required because it fixes the root **first**. In-order is not reversible even
with markers.

## Implementation
```java
private int cursor;                              // SHARED - a local int would restart per branch

TreeNode rebuild(String[] tokens) {
    cursor = 0;
    return build(tokens);
}

private TreeNode build(String[] tokens) {
    String t = tokens[cursor++];                 // consume exactly one token

    if (isAbsent(t)) return null;                // (1) how "no child here" is encoded

    TreeNode n = new TreeNode(Integer.parseInt(t));

    n.left  = build(tokens);                     // consumes its whole subtree...
    n.right = build(tokens);                     // ...so the cursor is right for this one

    return n;
}
```

## Variations
| Direction | Detail |
|---|---|
| **serialise** | mirror the same recursion: append `n.val + ","`, or a marker like `"#,"` when `n == null`. The marker is what makes the shape unambiguous |
| **deserialise** | the skeleton above, with `isAbsent(t)` = `t.equals("#")`. An `Iterator` over the split tokens works as the shared cursor too |
| rebuild from **preorder + inorder** | there are no null markers, so the *range* supplies the base case. `preorder[cursor++]` is the next root; a prebuilt `value -> inorder index` map finds the split in O(1); recurse `[lo, mid-1]` then `[mid+1, hi]`, returning null when `lo > hi` |

Build the **left** subtree before the right in every version - `cursor++` has to advance in
pre-order sequence, so those two statements cannot be swapped.

## When to use (NeetCode 150)
- **Serialize and Deserialize Binary Tree**.
- **Construct Binary Tree from Preorder and Inorder Traversal**.
- Generally: parsing any recursive structure out of a flat token stream.

## Pitfalls
- A local `int index` passed by value silently restarts each branch. Use a field, an
  `Iterator`, or an `int[1]`.
- The two recursive assignments are order-dependent. Swapping them mirrors the tree.
- Negative and multi-digit values rule out char-by-char parsing - split on a delimiter.
- The index map assumes unique values, which these problems guarantee.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: rebuilding a tree from a flat token stream (serialize/deserialize, and preorder+inorder)
Back: Pre-order recursion with a SHARED cursor (a field or Iterator - a local int restarts per branch). Each call consumes exactly its own subtree, leaving the cursor correct for its sibling.<br>`t = tokens[cursor++]`; return null if it is the absent-marker; else make the node and recurse LEFT then RIGHT - that order is load-bearing.<br>Serialise is the mirror recursion, emitting a "#" marker for null; the marker is what makes the shape unambiguous, and in-order is not reversible even with markers.<br>From preorder+inorder: no markers, so the RANGE gives the base case (`lo > hi` -> null); a `value -> inorder index` map splits in O(1).<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040486-->
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
