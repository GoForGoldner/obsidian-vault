---
tags: [data-structures, implementation, leetcode, stacks]
category: data-structures
related: [monotonic-stack, two-pointers]
---

## Description
A stack that stays sorted (here: increasing) by popping violators before each
push. Each element is pushed and popped at most once, so a full pass is O(n). The
classic use is "next greater element": while the top is smaller than the current
value, the current value is that top's answer.

## Implementation
```java
// Next Greater Element: ans[i] = first value to the right of i that is > nums[i], else -1
int[] nextGreater(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    Arrays.fill(ans, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // holds indices, values decreasing top->bottom

    for (int i = 0; i < n; i++) {
        // current nums[i] resolves everything smaller still on the stack
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            ans[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return ans;
}

// Variant: largest rectangle in histogram uses the same monotonic-increasing
// stack of indices; on each pop, width = i - stack.peek() - 1.
```

## When to use (LeetCode)
- Next/previous greater or smaller element; daily temperatures; stock span.
- Largest rectangle in histogram, maximal rectangle, trapping rain water.
- Cue: "for each element, find the nearest bigger/smaller one" in O(n).

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Monotonic Stack (next greater element)
Back: Stack holds indices; keep values monotonic (decreasing top->bottom).<br>Before pushing i, while `nums[top] < nums[i]` pop and set `ans[top] = nums[i]`.<br>Each index pushed/popped once -> O(n).<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398767-->
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
