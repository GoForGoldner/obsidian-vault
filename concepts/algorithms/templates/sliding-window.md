---
tags: [algorithms, template, leetcode, neetcode, sliding-window, arrays, strings]
category: algorithms
related: [sliding-window, two-pointers-converging, monotonic-stack, prefix-sum]
---

## Description
Two pointers moving the **same** direction over a contiguous run. `right` always advances;
`left` only advances to restore validity. Each index enters and leaves once, so the
nested-looking scan is O(n).

Requires the constraint to be **monotone in length**: growing the window can only make it
harder to satisfy. If growing can *fix* a violation, this is the wrong tool.

## Implementation
```java
int window(int[] a) {
    int left = 0, best = 0;

    for (int right = 0; right < a.length; right++) {

        add(a[right]);                                // grow: fold a[right] into the state

        while (invalid())                             // (1) shrink condition
            drop(a[left++]);                          //     un-fold a[left] and advance

        best = Math.max(best, right - left + 1);      // (2) where the answer is recorded
    }

    return best;
}
```

## Variations
| Want | (1) shrink while | (2) record |
|---|---|---|
| **longest** valid run | `invalid()` | **after** the loop - the window is valid there |
| **shortest** valid run | `valid()` | **inside** the loop, *before* dropping |
| exactly size `k` | `right - left + 1 > k` | once the window is full |
| exactly `k` distinct | - | `atMost(k) - atMost(k - 1)`, where `atMost` is the longest shape |

Cheap state, instead of re-scanning the window each step:
- last-seen index per char: skip the shrink loop entirely, `if (last[c] >= left) left = last[c] + 1`
- `int[26]` counts + a running `maxFreq`: validity becomes `length - maxFreq <= k`
- one `missing` counter for "have I covered the target multiset", decremented only when
  `need[c]-- > 0` - one int replaces a whole map comparison per step

## When to use (NeetCode 150)
- **Longest Substring Without Repeating Characters**, **Longest Repeating Character
  Replacement** - longest shape.
- **Minimum Window Substring** - shortest shape plus the `missing` counter.
- **Permutation in String** - fixed size; compare two `int[26]` with `Arrays.equals`.
- **Best Time to Buy and Sell Stock** - degenerate window: track the running minimum.
- **Sliding Window Maximum** is a window whose state is a monotonic deque -> [[monotonic-stack]].

## Pitfalls
- `while`, not `if` - one removal often is not enough to restore validity.
- Longest records after shrinking; shortest records before. Swapping them is the classic bug.
- Every `add` needs an exactly-inverse `drop`, or the state drifts.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the sliding-window skeleton, and the longest-vs-shortest divergence
Back: `for right` grows the window and folds in state; `left` only advances to restore validity. Each index in/out once -> O(n). Needs a constraint that is monotone in length.<br>LONGEST: `while (invalid) drop(a[left++]);` then record AFTER the loop.<br>SHORTEST: `while (valid) { record(right-left+1); drop(a[left++]); }` - record INSIDE, before dropping.<br>FIXED k: shrink on `right-left+1 > k`. EXACTLY k distinct: `atMost(k) - atMost(k-1)`.<br>Every `add` needs an exact inverse `drop`.<br>Full reference in the ## Implementation section of this note.
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
