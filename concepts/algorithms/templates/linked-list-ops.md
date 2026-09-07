---
tags: [algorithms, template, leetcode, neetcode, linked-list]
category: algorithms
related: [fast-slow-pointers, lru-cache, heap-top-k]
---

## Description
Two devices remove nearly every special case in this whole category:

- **Dummy head** - build onto a throwaway node and return `dummy.next`. Any operation that
  might touch the first node stops needing a branch.
- **Three-pointer reverse** - `prev / cur / next`. The one loop to know cold.

Everything else composes from these plus [[fast-slow-pointers]].

## Implementation
```java
ListNode reverse(ListNode head) {
    ListNode prev = null, cur = head;

    while (cur != null) {
        ListNode next = cur.next;    // SAVE first - the next line destroys this link
        cur.next = prev;             // flip
        prev = cur;                  // advance the pair
        cur = next;
    }

    return prev;                     // prev is the new head
}

ListNode buildOntoDummy(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;

    while (keepGoing(a, b)) {                  // (1) loop condition
        tail.next = new ListNode(pick(a, b));  // (2) what to emit this step
        tail = tail.next;
    }

    return dummy.next;                         // never `head` - it may have moved
}
```

## Variations
| Problem | (1) loop while | (2) emit |
|---|---|---|
| merge two sorted lists | `a != null && b != null` | the smaller head, then advance it; afterwards `tail.next = (a != null) ? a : b` to attach the remainder wholesale |
| add two numbers | `a != null \|\| b != null \|\| carry != 0` - that third clause removes the trailing-carry case | `sum % 10`, keeping `carry = sum / 10` |
| reorder list | - | split at the middle, `reverse` the second half, then weave the two |
| reverse in k-groups | walk `k` ahead; stop when fewer than `k` remain | reverse the segment with `prev` initialised to the node **after** it, so it stitches on as it flips |
| copy a list with extra pointers | two passes | pass 1 maps `old -> new`; pass 2 wires `next` and the extra pointer via the map (`map.get(null)` is `null`, so no branch) |

## When to use (NeetCode 150)
- **Reverse Linked List**, **Merge Two Sorted Lists**, **Add Two Numbers**,
  **Reorder List**, **Reverse Nodes in k-Group**, **Copy List with Random Pointer**.
- **Merge k Sorted Lists** - a min-heap of the k heads, see [[heap-top-k]].
- **LRU Cache** is a design problem on a different structure -> [[lru-cache]].
- Cycle, middle, nth-from-end -> [[fast-slow-pointers]].

## Pitfalls
- Save `cur.next` *before* overwriting it. That single line is the whole bug class.
- Return `dummy.next`, never `head`.
- Draw three nodes and trace one iteration before trusting a relink.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the two linked-list devices - three-pointer reverse, and the dummy head
Back: Reverse: `prev = null, cur = head`; per step SAVE `next = cur.next` FIRST, then `cur.next = prev`, then advance both. Return `prev`. Saving before overwriting is the entire bug class.<br>Dummy head: build onto a throwaway node with a `tail` cursor and return `dummy.next`, never `head` - that removes every "might be the first node" branch.<br>Merge: attach the remainder wholesale with `tail.next = (a != null) ? a : b`. Add-with-carry: loop `while (a != null || b != null || carry != 0)` - that third clause kills the trailing-carry case.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040455-->
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
