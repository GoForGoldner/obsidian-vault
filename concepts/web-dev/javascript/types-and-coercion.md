---
tags: [javascript, web-dev, types]
category: web-dev
related: [equality-and-nullish, variables-scope-hoisting, objects-and-prototypes]
---

## Description
JS is **dynamically typed**: a variable has no declared type and can hold anything. There are **7 primitives** — `string`, `number`, `boolean`, `undefined`, `null`, `bigint`, `symbol` — plus `object` (which includes arrays and functions). You inspect a value's runtime type with `typeof`, but beware its two famous quirks: `typeof null === "object"` and `typeof function(){} === "function"`. Unlike Java, there's no compile-time type checking and `+` is overloaded: if **either** operand is a string, `+` concatenates, so `1 + "2"` is `"12"` while `1 - "2"` is `-1`. Coercion also drives truthiness — the falsy values are exactly `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`; everything else (including `"0"`, `[]`, and `{}`) is truthy. `NaN` is the only value not equal to itself, so test it with `Number.isNaN`.

## Examples
### typeof and its quirks
```js
typeof "hi";        // "string"
typeof 42;          // "number"
typeof 10n;         // "bigint"
typeof undefined;   // "undefined"
typeof null;        // "object"   <- historical bug, but stable
typeof function(){};// "function" <- not "object"
typeof [1, 2];      // "object"   <- arrays are objects; use Array.isArray()
```

### `+` concatenation surprises (no Java compile error)
```js
1 + "2"      // "12"   -- string wins, becomes concatenation
1 - "2"      // -1     -- minus has no string meaning, coerces to number
"5" * 2      // 10     -- coerced to number
[] + []      // ""     -- both stringify to ""
[] + {}      // "[object Object]"
```

### Truthy/falsy and NaN
```js
if ("0") console.log("runs");   // "0" is a non-empty string -> truthy
if ([])  console.log("runs");   // empty array is truthy!
Boolean("");  // false
NaN === NaN;          // false -- NaN is never equal to itself
Number.isNaN(NaN);    // true  -- the correct test
isNaN("foo");         // true  but coerces first; prefer Number.isNaN
```

## Related Topics
- [[equality-and-nullish|Equality & Nullish]]
- [[variables-scope-hoisting|Variables, Scope & Hoisting]]
- [[objects-and-prototypes|Objects & Prototypes]]

## Cards

```anki
START
Basic
List the 7 JavaScript primitive types.
Back: `string`, `number`, `boolean`, `undefined`, `null`, `bigint`, `symbol`. (Everything else is an `object`.)
<!--ID: 1782407009355-->
END

START
Basic
`typeof` returns two surprising results that bite people. What are they?
Back: `typeof null` is `"object"` (legacy bug), and `typeof someFunction` is `"function"` (not `"object"`).
<!--ID: 1782407009360-->
END

START
Basic
Coming from Java, why does `1 + "2"` give `"12"` but `1 - "2"` gives `-1`?
Back: `+` is overloaded: if either operand is a string it concatenates, so `1` becomes `"1"`. `-` has no string meaning, so both sides coerce to numbers. No compile-time check stops this.
<!--ID: 1782407009364-->
END

START
Basic
Which JS values are falsy? (the complete set)
Back: `false`, `0`, `-0`, `0n`, `""` (empty string), `null`, `undefined`, and `NaN`. Everything else is truthy.
<!--ID: 1782407009369-->
END

START
Basic
Is an empty array `[]` truthy or falsy in an `if` condition?
Back: Truthy. All objects (including `[]` and `{}`) are truthy; only the 8 specific falsy values are falsy.
<!--ID: 1782407009373-->
END

START
Basic
How do you correctly test whether a value is `NaN`, and why can't you use `===`?
Back: Use `Number.isNaN(x)`. `NaN === NaN` is `false` because `NaN` is the only value not equal to itself.
<!--ID: 1782407009377-->
END

START
Basic
How do you reliably check if a value is an array, given `typeof` won't tell you?
Back: `Array.isArray(x)` — because `typeof [1,2]` returns `"object"`, not `"array"`.
<!--ID: 1782407009381-->
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
