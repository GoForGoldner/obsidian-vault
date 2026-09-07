---
tags: [algorithms, template, leetcode, neetcode, bit-manipulation]
category: algorithms
related: [math-tricks, dp-1d-linear]
---

## Description
Three properties do all the work:

- **XOR cancels.** `x ^ x == 0`, `x ^ 0 == x`, and it is commutative and associative - so
  XOR-ing a whole collection annihilates everything appearing an even number of times, in any
  order.
- **`n & (n - 1)` clears the lowest set bit** - so a loop runs once per **set** bit rather
  than once per bit width, and `(n & (n-1)) == 0` tests a power of two.
- **`n & -n` isolates the lowest set bit** (two's complement: `-n` is `~n + 1`).

Plus the identity behind arithmetic-free addition: `a ^ b` is the sum **without** carries, and
`(a & b) << 1` is exactly the carries.

## Implementation
```java
// The vocabulary. Parenthesise every bit test: &, ^, | all bind LOOSER than ==.
// x & 1                  lowest bit (parity)
// x >> k    /  x << k    arithmetic shift - >> SIGN-EXTENDS
// x >>> k                LOGICAL right shift - use this whenever x may be negative
// x &  (1 << k)          test bit k          x |  (1 << k)   set bit k
// x & ~(1 << k)          clear bit k         x ^  (1 << k)   flip bit k
// n & (n - 1)            clear the lowest set bit
// n & -n                 isolate the lowest set bit
// Integer.bitCount(n)    population count, when hand-rolling is not the point

int loopOverSetBits(int n) {
    int acc = 0;

    while (n != 0) {
        // Do something with n & -n here if you need the bit's value.
        n &= (n - 1);              // drop the lowest set bit
        acc++;                     // one iteration per SET bit, not per bit width
    }

    return acc;
}
```

## Variations
| Want | How |
|---|---|
| the element appearing an odd number of times | XOR everything; pairs annihilate |
| the missing value in `0..n` | seed with `n`, then `x ^= i ^ a[i]` - every value appears once as an index and once as a value except the missing one |
| set bits for **every** `i` in `0..n` | DP on the bits: `dp[i] = dp[i & (i-1)] + 1`, or `dp[i >> 1] + (i & 1)` |
| reverse all 32 bits | 32 iterations of `out = (out << 1) \| (n & 1); n >>>= 1` - **logical** shift, `>>` sign-extends forever |
| add without `+` | `while (b != 0) { int carry = (a & b) << 1; a = a ^ b; b = carry; }`, computing the carry **before** overwriting `a`. It terminates because the carry marches left until it falls off the width |
| enumerate every subset of a small set | `for (int mask = 0; mask < (1 << n); mask++)` |

## When to use (NeetCode 150)
- **Single Number**, **Missing Number**, **Number of 1 Bits**, **Counting Bits**,
  **Reverse Bits**, **Sum of Two Integers**.
- **Reverse Integer** is decimal, not binary -> [[math-tricks]].
- Cue: pairing and cancellation, subset enumeration over a small `n`, or arithmetic with the
  operators taken away.

## Pitfalls
- `>>` sign-extends. Any 32-bit reversal or unsigned-style count needs `>>>`.
- Shifts are taken mod 32 for `int`, so `1 << 32` is `1`, not `0`. Use `1L << k` past 31 bits.
- `1 << 31` **is** `Integer.MIN_VALUE`.
- `&`, `^`, `|` bind looser than `==`. Parenthesise.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the bit-manipulation vocabulary and the set-bit loop
Back: XOR cancels (`x^x = 0`, order-independent), so XOR-ing a collection leaves only the odd-count element. Missing number: seed with `n`, then `x ^= i ^ a[i]`.<br>`n & (n-1)` CLEARS the lowest set bit - loop once per set bit, and `(n & (n-1)) == 0` tests a power of two. `n & -n` isolates it. Counting-bits DP: `dp[i] = dp[i & (i-1)] + 1`.<br>Reverse 32 bits: `out = (out << 1) | (n & 1); n >>>= 1` - LOGICAL shift, `>>` sign-extends forever.<br>Add without `+`: `a ^ b` is the sum without carries, `(a & b) << 1` is the carries; loop, computing the carry before overwriting `a`.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040387-->
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
