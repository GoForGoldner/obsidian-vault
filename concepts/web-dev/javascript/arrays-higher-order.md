---
tags: [javascript, web-dev, arrays, functional]
category: web-dev
related: [destructuring-spread-rest, functions-and-arrows, objects-and-prototypes, async-promises]
---

## Description
JS arrays carry the same higher-order methods you'd build with Java Streams, but **directly on the array** — no `.stream()`/`.collect()` ceremony. `map`/`filter`/`reduce`/`find`/`some`/`every`/`forEach` each take a callback `(element, index, array) => ...`. The big gotcha: `sort` sorts **lexicographically by default** (converting to strings), so `[10, 2, 1].sort()` gives `[1, 10, 2]` — you must pass a comparator `(a, b) => a - b`. Unlike Java Streams, these are **eager** (each call walks the whole array and allocates a new array), so a long chain makes multiple passes. `sort` and `forEach` are not Stream-like at all: `sort` mutates in place and returns the same array; `forEach` returns `undefined` (you can't chain off it).

## Examples
### Core transforms
```js
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);           // [2, 4, 6, 8, 10]  — new array
nums.filter(n => n % 2 === 0);  // [2, 4]
nums.reduce((acc, n) => acc + n, 0); // 15 — second arg is the initial accumulator
nums.find(n => n > 3);          // 4   — first match, or undefined
nums.some(n => n > 4);          // true
nums.every(n => n > 0);         // true
nums.forEach(n => console.log(n)); // returns undefined; for side effects only
```

### The sort gotcha
```js
[10, 2, 1].sort();              // [1, 10, 2]  WRONG — string compare
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10] correct numeric ascending
// sort MUTATES in place. Copy first if you need the original:
const sorted = [...arr].sort((a, b) => a - b);
```

### Chaining vs Java Streams
```js
// JS: methods live on the array, evaluated eagerly left-to-right
const total = orders
  .filter(o => o.active)
  .map(o => o.price)
  .reduce((a, b) => a + b, 0);

// Java equivalent:
// orders.stream().filter(o -> o.active).mapToInt(o -> o.price).sum();
// JS has no lazy pipeline — each step allocates a new array.
```

## Related Topics
- [[functions-and-arrows|Functions & Arrow Functions]]
- [[destructuring-spread-rest|Destructuring, Spread & Rest]]
- [[objects-and-prototypes|Objects & Prototypes]]

## Cards

```anki
START
Basic
You call `[10, 2, 1].sort()` with no argument. What do you get and why?
Back: `[1, 10, 2]`. Default `sort` converts elements to strings and compares lexicographically. Pass a comparator `(a, b) => a - b` for numeric order.
<!--ID: 1782407009058-->
END

START
Basic
What does `arr.reduce((acc, n) => acc + n, 0)` do, and what is the `0`?
Back: Folds the array to a single value (here, the sum). `0` is the initial accumulator value passed as `acc` on the first call.
<!--ID: 1782407009061-->
END

START
Basic
Why can't you chain another method after `arr.forEach(...)`?
Back: `forEach` always returns `undefined` (it's for side effects). Use `map`/`filter` if you need a value to chain off.
<!--ID: 1782407009065-->
END

START
Basic
What's returned by `arr.find(predicate)` when nothing matches, vs `arr.filter(predicate)`?
Back: `find` returns `undefined` (the first match otherwise). `filter` returns an empty array `[]` (a new array of all matches otherwise).
<!--ID: 1782407009068-->
END

START
Basic
Gotcha: how does JS array chaining differ from Java Streams in evaluation?
Back: JS is eager — every `map`/`filter` walks the array and allocates a new one immediately. Java Streams are lazy and fuse operations into one pass.
<!--ID: 1782407009071-->
END

START
Basic
You need to sort an array without mutating the original. Write it.
Back: `const sorted = [...arr].sort((a, b) => a - b);` — spread copies first because `sort` mutates in place.
<!--ID: 1782407009075-->
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
