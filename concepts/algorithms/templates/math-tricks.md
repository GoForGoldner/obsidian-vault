---
tags: [algorithms, template, leetcode, neetcode, math]
category: algorithms
related: [bit-manipulation, matrix-manipulation, fast-slow-pointers]
---

## Description
A short list of numeric routines that are pure recall - nothing to derive under pressure.

The one skeleton worth having is **fast exponentiation**. The rest is a single discipline:
in Java, `int` overflow wraps **silently**, so every one of these problems is really testing
whether you check *before* the operation rather than after.

## Implementation
```java
double fastPow(double x, int n) {
    long e = n;                       // widen FIRST - negating Integer.MIN_VALUE overflows

    if (e < 0) {                      // x^-n == (1/x)^n
        x = 1 / x;
        e = -e;
    }

    double result = 1;

    while (e > 0) {
        if ((e & 1) == 1) result *= x;   // this bit of the exponent is set, so fold x in
        x *= x;                          // square the base...
        e >>= 1;                         // ...and halve the exponent
    }

    return result;                    // O(log n)
}
```

## Variations
| Want | How |
|---|---|
| reverse a number's digits safely | pull digits with `x % 10` (Java keeps the dividend's sign, so negatives handle themselves) and check `out > MAX/10 \|\| out < MIN/10` **before** `out = out*10 + d`. Checking after is already too late |
| increment a digit array | walk from the right: if the digit is `< 9`, bump it and return; else set it to 0 and carry. If the loop finishes, all were nines - allocate `n + 1` with a leading 1 |
| multiply two digit strings | schoolbook: `digits[i] * digits[j]` always lands in result slots `i+j+1` (units) and `i+j` (carry). `prod[i+j] += carry` **accumulates** - it is not assigned |
| detect a cycle in a numeric function | `next(n)` plus fast/slow pointers, O(1) space -> [[fast-slow-pointers]] |
| gcd / lcm | `gcd(a,b) = b == 0 ? a : gcd(b, a % b)`; `lcm = a / gcd(a,b) * b` - **divide first**, or it overflows |
| ceiling division | `(a + b - 1) / b`, positive operands only |
| a non-negative remainder | `((x % m) + m) % m` - Java's `%` keeps the sign of the dividend |

## When to use (NeetCode 150)
- **Pow(x, n)** - the skeleton. **Reverse Integer**, **Plus One**, **Multiply Strings**,
  **Happy Number**.
- Matrix problems -> [[matrix-manipulation]]. **Sum of Two Integers** is bitwise ->
  [[bit-manipulation]].

## Pitfalls
- `-Integer.MIN_VALUE` overflows back to itself. Widen to `long` before negating.
- Check for overflow **before** the arithmetic that would cause it; `if (out * 10 / 10 != out)`
  is not reliable.
- `-7 % 10 == -7` in Java. Convenient when reversing digits, a bug source when hashing.
- `Math.ceil((double) a / b)` loses precision on large longs - use the integer form.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: fast exponentiation, and the overflow discipline the rest of these share
Back: Widen the exponent to `long` FIRST (negating Integer.MIN_VALUE overflows), invert the base if negative, then `while (e > 0) { if ((e & 1) == 1) result *= x; x *= x; e >>= 1; }`. Square the base, halve the exponent. O(log n).<br>Overflow must be checked BEFORE the operation: reversing digits needs `out > MAX/10 || out < MIN/10` ahead of `out = out*10 + d`. Checking after is too late.<br>Java's `%` keeps the DIVIDEND's sign (`-7 % 10 == -7`) - use `((x % m) + m) % m` for a non-negative remainder. `lcm` divides before multiplying.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040461-->
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
