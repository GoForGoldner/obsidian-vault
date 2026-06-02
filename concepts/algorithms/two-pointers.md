---
tags: [algorithms, technique]
category: algorithms
related: [bfs, dfs]
---

## Description
A technique that uses two pointers (or indices) to traverse a data structure, usually a sorted array or linked list. The pointers move toward each other, in the same direction at different speeds, or from fixed positions. Reduces O(n²) brute force to O(n) by eliminating redundant comparisons.
## Examples
Two sum on a sorted array:
```java
int left = 0, right = arr.length - 1;
while (left < right) {
    int sum = arr[left] + arr[right];
    if (sum == target) return new int[]{left, right};
    else if (sum < target) left++;
    else right--;
}
```

Cycle detection (Floyd's):
```java
ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true; // cycle found
}
return false;
```

## Related Topics
- [[two-pointers|Binary Search]]
- [[two-pointers|Sliding Window]]
- Linked List
- Fast and Slow Pointers

## Cards

```anki
START
Basic
You see: sorted array, need to find a pair that satisfies a condition. What technique?
Back: Two Pointers - one at start, one at end, move inward based on comparison. O(n) instead of O(n^2). Requires sorted input.
<!--ID: 1773439958430-->
END

START
Basic
You see: linked list, need to detect a cycle. What technique?
Back: Fast and slow pointers (Floyd's). Slow moves 1 step, fast moves 2. If they meet, there's a cycle.
<!--ID: 1773439958437-->
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
