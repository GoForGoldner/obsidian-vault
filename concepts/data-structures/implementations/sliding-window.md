---
tags: [data-structures, implementation, leetcode, arrays]
category: data-structures
related: [two-pointers, prefix-sum, monotonic-stack]
---

## Description
Two pointers bounding a contiguous window. Expand `right` each step; while the
window violates a constraint, shrink from `left`. Each index enters and leaves the
window once, so the whole scan is O(n) even though it looks nested.

## Implementation
```java
// Longest substring without repeating characters.
int longestUnique(String s) {
    int[] last = new int[128];
    Arrays.fill(last, -1);
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (last[c] >= left) left = last[c] + 1;   // jump past the previous copy
        last[c] = right;
        best = Math.max(best, right - left + 1);
    }
    return best;
}

// Generic "shrink while invalid" template (e.g. min window / at-most-K distinct).
int windowTemplate(int[] nums) {
    int left = 0, best = 0 /*, running state */;
    for (int right = 0; right < nums.length; right++) {
        // add nums[right] to the window state
        while (/* window is invalid */ false) {
            // remove nums[left] from the window state
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}
```

## When to use (LeetCode)
- Longest/shortest **contiguous** subarray or substring under a constraint.
- Fixed-size window (max sum of k elements) or variable window (min window, at-most-K).
- Cue: "contiguous" + "longest/shortest/count" -> sliding window before nested loops.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Sliding Window / Two Pointers
Back: Move `right` to grow the window; `while` the window is invalid, remove `nums[left]` and `left++`.<br>Update the answer once the window is valid each step.<br>Each index enters/leaves once -> O(n).<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398786-->
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
