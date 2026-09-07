---
tags: [algorithms, template, leetcode, neetcode, greedy]
category: algorithms
related: [intervals, dp-1d-linear, minimum-spanning-tree]
---

## Description
Greedy problems share almost no code - they share a **shape**: one linear scan holding two or
three variables, committing to a locally best choice at every step.

The code is trivial; the **justification** is not. Before writing anything, say why the greedy
choice cannot make the final answer worse - usually an exchange argument ("any optimal
solution can be rewritten to include my choice without getting worse"). **If that sentence
does not come, the problem is DP, not greedy** - and the tests will not tell you.

## Implementation
```java
int scan(int[] a) {
    int reach = 0, mark = 0, answer = 0;      // 2-3 running values, nothing else

    for (int i = 0; i < a.length; i++) {

        if (broken(i, reach)) return fail();  // (1) an unrecoverable state, detected early

        reach = extend(reach, i, a[i]);       // (2) how far the commitment now stretches

        if (i == mark) {                      // (3) a forced decision point
            answer++;
            mark = reach;
        }
    }

    return answer;
}
```

## Variations
| Problem shape | The running values, and the commitment |
|---|---|
| can I reach the end | `reach = max(reach, i + a[i])`; fail the moment `i > reach` |
| fewest jumps to the end | level expansion: same `reach`, and when `i == curEnd` do `jumps++; curEnd = reach`. Loop only to `n - 2`, or you count a jump you never make |
| a circular route with fuel | running `tank` **and** a `total`; when `tank < 0` reset `start = i + 1` and `tank = 0`. Answer is `start` iff `total >= 0` - a failing prefix cannot contain the start |
| cut into maximal independent chunks | precompute each item's **last** index; extend `end = max(end, last[c])` and cut when `i == end`. The cut point is *forced*, not chosen |
| an **ambiguous** token (a wildcard) | track a **range** of possible states: `lo`/`hi` for the min and max open count. Fail when `hi < 0`, clamp `lo` at 0, succeed only if `lo == 0` |
| repeatedly consume the smallest | a `TreeMap` of counts; `firstKey()` must start the next group |
| componentwise maximum | ignore any item that exceeds the target on **any** axis, then max the rest |

## When to use (NeetCode 150)
- **Jump Game**, **Jump Game II**, **Gas Station**, **Partition Labels**,
  **Valid Parenthesis String** (the range trick), **Hand of Straights**,
  **Merge Triplets to Form Target Triplet**.
- **Maximum Subarray** is filed under Greedy but is Kadane -> [[dp-1d-linear]].
- Sort-then-scan over ranges -> [[intervals]].

## Pitfalls
- Reaching for greedy with no exchange argument.
- Off-by-one on the last index (Jump Game II loops to `n - 2`).
- Restart *after* the failing element (`i + 1`), not at it.
- Clamp `lo` at 0 but let `hi` go negative and fail fast; clamping `hi` hides the invalid case.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the greedy scan shape, and the test for whether greedy is even valid
Back: One linear pass holding 2-3 running values, committing locally each step. FIRST state the exchange argument - why the local choice cannot make the final answer worse. If that sentence does not come, it is DP, and the tests will not tell you.<br>Reachability: `reach = max(reach, i + a[i])`, fail when `i > reach`. Fewest jumps: same, plus `if (i == curEnd) { jumps++; curEnd = reach; }`, looping only to `n-2`.<br>Circular fuel: running `tank` plus a `total`; on `tank < 0` reset `start = i+1`, `tank = 0`; answer is `start` iff `total >= 0`.<br>Ambiguous tokens: carry a RANGE (`lo`/`hi`) of possible states.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040424-->
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
