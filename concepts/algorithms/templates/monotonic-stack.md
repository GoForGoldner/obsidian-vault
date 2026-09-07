---
tags: [algorithms, template, leetcode, neetcode, stack]
category: algorithms
related: [monotonic-stack, stack-parsing, sliding-window]
---

## Description
A stack of **indices** kept sorted by value. Before pushing `i`, pop everything the new
element beats - each pop is *resolved* by the current element, so every index is pushed and
popped at most once and the pass is O(n).

Store indices, never values: widths and distances need the position, and you cannot recover
it from a value.

## Implementation
```java
int[] monotonic(int[] a) {
    int n = a.length;
    int[] ans = new int[n];
    Arrays.fill(ans, -1);                              // "no answer" default

    Deque<Integer> st = new ArrayDeque<>();            // indices, values monotonic

    for (int i = 0; i <= n; i++) {                     // i == n is a sentinel flush

        // a[i] resolves every index still on the stack that it beats.
        while (!st.isEmpty() && beats(a, i, st.peek()))    // (1) the pop test
            ans[st.pop()] = resolve(a, i, st);             // (2) what the pop is worth

        st.push(i);
    }

    return ans;
}
```

## Variations
| Want | (1) pop while | (2) the popped index's answer | stack ends |
|---|---|---|---|
| next **greater** value | `a[top] < a[i]` | `a[i]` | decreasing |
| next **smaller** value | `a[top] > a[i]` | `a[i]` | increasing |
| **distance** to it | same test | `i - poppedIndex` | either |
| widest bar ≤ this height | `a[top] > a[i]` | `a[popped] * (i - st.peek() - 1)`, using `-1` when the stack empties | increasing |
| max over a size-`k` window | `a[dq.peekLast()] <= a[i]` | - | use a **deque**: also `pollFirst()` while `peekFirst() <= i - k` |

Iterating to `i <= n` with a sentinel (`0`, or `+inf`) flushes the stack, which removes the
separate post-loop drain.

Reach for a deque instead of a stack **only** when you also evict by window position.

## When to use (NeetCode 150)
- **Daily Temperatures** (distance), **Largest Rectangle in Histogram** (width formula).
- **Car Fleet** - sort by position descending, stack of arrival times; a car merges when it
  arrives no later than the fleet ahead.
- **Sliding Window Maximum** - the deque variation.
- **Trapping Rain Water** also yields to this, but converging pointers are shorter -
  see [[two-pointers-converging]].

## Pitfalls
- Strict vs non-strict comparison decides how **equal** values group - it changes histogram
  widths. Pick one and hold it.
- Without a sentinel you must drain the stack after the loop; forgetting that loses the
  tallest bars.
- `ArrayDeque` used as a stack works on the **front** (`push`/`pop`/`peek`). Do not mix those
  with `offerLast`/`pollFirst` casually.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the monotonic stack skeleton (and the deque variant)
Back: Stack of INDICES, kept monotonic. Before pushing i: `while (!st.isEmpty() && beats(a[i], a[st.peek()])) ans[st.pop()] = ...` then push i. Each index in/out once -> O(n).<br>Next greater: pop while `a[top] < a[i]`, answer `a[i]`. Distance instead: answer `i - popped`. Histogram width: pop while `a[top] > a[i]`, `width = i - st.peek() - 1` (use -1 when empty).<br>Loop to `i <= n` with a sentinel to flush the stack instead of draining afterwards.<br>Deque only when you ALSO evict by window position (`pollFirst` while `peekFirst() <= i - k`).<br>Full reference in the ## Implementation section of this note.
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
