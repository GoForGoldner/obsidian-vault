---
tags: [algorithms, technique, stack]
category: algorithms
related: [two-pointers, prefix-sum, dfs]
---

## Description
A monotonic stack keeps elements in increasing or decreasing order so that when a new value breaks the invariant, you pop until the ordering is restored. That lets you solve next or previous greater or smaller element problems in O(n) total time because each element is pushed once and popped at most once.

## Examples
```java
int[] nextGreater(int[] nums) {
    int[] ans = new int[nums.length];
    Arrays.fill(ans, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < nums.length; i++) {
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            ans[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return ans;
}
```

## Related Topics
- [[two-pointers]]
- [[prefix-sum]]
- [[dfs]]

## Cards

```anki
START
Basic
You see: need to find the next greater (or smaller) element for each position in an array. What technique?
Back: Monotonic Stack. Use a decreasing stack for next greater and an increasing stack for next smaller. Each element is pushed and popped at most once, so the runtime is O(n). Store indices rather than raw values.
<!--ID: 1780580932932-->
END

START
Basic
How do you choose the stack type and iteration direction for monotonic stack problems?
Back: Next greater or smaller: iterate left to right. Previous greater or smaller: iterate right to left. Decreasing stack (pop when incoming > top) finds greater elements. Increasing stack (pop when incoming < top) finds smaller elements.
<!--ID: 1780580932933-->
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