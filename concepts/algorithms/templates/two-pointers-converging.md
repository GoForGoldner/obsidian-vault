---
tags: [algorithms, template, leetcode, neetcode, two-pointers, arrays]
category: algorithms
related: [two-pointers, sliding-window, binary-search]
---

## Description
Two ends walking inward. Each step discards one candidate **permanently**, which is why it is
O(n) and why the correctness argument is always "the discarded candidate could never have
won".

Needs a **monotone response**: moving `l` right and moving `r` left must push the measured
quantity in opposite directions. Sorted order supplies that for sums; shrinking width
supplies it for areas.

## Implementation
```java
int converge(int[] a) {
    int l = 0, r = a.length - 1;
    int best = 0;

    while (l < r) {

        best = Math.max(best, measure(a, l, r));   // (1) what this pair is worth

        // Move the end that could still improve the answer. The other end is
        // already as good as it gets, so advancing it can only lose candidates.
        if (moveLeft(a, l, r)) l++;                // (2) which end advances
        else                   r--;
    }

    return best;
}
```

## Variations
| Problem shape | (1) measure | (2) advance |
|---|---|---|
| pair hitting a target in a **sorted** array | `a[l] + a[r]` | `sum < target` -> `l++`, else `r--` |
| palindrome check | `a[l] == a[r]` | **both**, after skipping non-alphanumerics |
| largest container | `min(a[l], a[r]) * (r - l)` | the **shorter** side - width only ever shrinks |
| trapped water | running `max` minus height, on the lower side | the side with the **smaller** height |
| triples summing to 0 | fix `i`, converge over `[i+1, n-1]` | plus **three** dedup skips: the anchor, and both ends after a hit |
| palindromic substrings | start `l = r = centre` and move **apart** | expand while `a[l] == a[r]`; loop `2n-1` centres (odd **and** even) |

## When to use (NeetCode 150)
- **Two Sum II**, **Valid Palindrome**, **3Sum**, **Container With Most Water**,
  **Trapping Rain Water**.
- **Longest Palindromic Substring**, **Palindromic Substrings** - the expand-from-centre
  variation, which needs no DP table and no extra space.
- Unsorted input where the answer is a contiguous **run** rather than a pair -> [[sliding-window]].

## Pitfalls
- Move the end that *can* improve. On max-area, advancing the taller side can never help.
- 3Sum needs all three dedup guards; missing any one emits duplicate triples.
- Expand-from-centre needs both the odd (`c, c`) and even (`c, c+1`) call.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the converging two-pointer skeleton (and the rule for which end moves)
Back: `l = 0, r = n-1`, `while (l < r)`: measure the pair, then advance the end that could still IMPROVE the answer - the other end is already optimal, so moving it only loses candidates. Each step discards one candidate forever -> O(n).<br>Needs a monotone response (sorted order, or shrinking width).<br>Sorted pair sum: `sum < target -> l++`. Max area: move the SHORTER side. Rain water: move the side with the smaller height. Palindromic substrings: start l=r at a centre and move APART, over 2n-1 centres.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040504-->
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
