---
tags: [algorithms, template, leetcode, neetcode, linked-list, two-pointers]
category: algorithms
related: [linked-list-ops, two-pointers-converging, math-tricks]
---

## Description
Two walkers at different speeds over **implicit successor links** - a linked list, or an array
read as `i -> nums[i]`. Use it when there is no length to index into and no memory to spare.

Why it cannot fail: inside a cycle, fast gains exactly one position per step on slow, so it
closes the gap by one each time and can never jump over it.

## Implementation
```java
int cycleEntrance(int start) {

    // Phase 1 - find ANY meeting point inside the cycle.
    int slow = next(start), fast = next(next(start));
    while (slow != fast) {
        slow = next(slow);
        fast = next(next(fast));
    }

    // Phase 2 - reset one walker to the start; now BOTH step by one.
    // The distance from start to the entrance equals the distance from the
    // meeting point to the entrance, so they collide exactly there.
    slow = start;
    while (slow != fast) {
        slow = next(slow);
        fast = next(fast);
    }

    return slow;                     // the cycle entrance
}
```

## Variations
| Need | Change |
|---|---|
| does a cycle exist at all | stop after phase 1; guard the walk with `fast != null && fast.next != null` and return false when it falls off |
| middle node | phase 1 only, no cycle: when `fast` falls off, `slow` is the middle (the **second** middle on even length - start `fast = head.next` for the first) |
| k-th node from the end | open a gap of exactly `k` first, then advance both until the leader falls off |
| the repeated value in an array | `next(i) = nums[i]`; the duplicate **is** the cycle entrance, so run both phases |
| cycle in a numeric function | `next(n) =` that function (e.g. sum of squared digits) |

## When to use (NeetCode 150)
- **Linked List Cycle**, **Remove Nth Node From End of List**, **Happy Number**.
- **Find the Duplicate Number** - the only route to O(n) time and O(1) space without
  mutating the input; the trick is seeing `nums` as a linked list.
- **Reorder List** uses the middle to split - see [[linked-list-ops]].

## Pitfalls
- Guard `fast != null && fast.next != null` **in that order**, or you NPE on odd lengths.
- Phase 2 moves *both* pointers by one. Leaving fast at double speed lands on the wrong node.
- Decide which "middle" you need before writing the loop, then set the start offsets.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: fast/slow pointers, including Floyd's two-phase cycle entrance
Back: Over implicit successor links (a list, or `i -> nums[i]`). Fast gains one position per step inside a cycle, so it cannot skip slow.<br>Phase 1: slow += 1, fast += 2 until they meet - that is ANY point in the cycle.<br>Phase 2: reset one walker to the START and step BOTH by ONE; they collide at the cycle ENTRANCE, because start-to-entrance equals meeting-point-to-entrance.<br>Detect-only: stop after phase 1, guarding `fast != null && fast.next != null`. Middle: phase 1 with no cycle. Nth-from-end: open a gap of k first.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040418-->
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
