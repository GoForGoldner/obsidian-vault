---
tags: [javascript, web-dev, syntax, idioms]
category: web-dev
related: [arrays-higher-order, functions-and-arrows, objects-and-prototypes, modules-import-export]
---

## Description
Destructuring pulls values out of arrays/objects into variables in one statement — there is no Java equivalent, and it's *everywhere* in real JS/TS (function params, imports, React hooks). Array destructuring is **positional** (`const [a, b] = arr`); object destructuring is **by key name** (`const {x, y} = obj`). You can supply defaults (used only when the value is `undefined`), rename (`{x: localName}`), and nest. The `...` token is overloaded: as **spread** it expands an iterable/object into a new array or object (shallow copy / merge); as **rest** it collects "the remaining" items into one variable. Key gotchas: defaults trigger on `undefined`, not `null`; spread is a **shallow** copy; and object spread merge is last-wins for duplicate keys.

## Examples
### Array & object destructuring
```js
const [first, second] = [10, 20];          // first=10, second=20
const [, , third] = [1, 2, 3];             // skip with holes -> third=3

const user = { name: "Ada", age: 36 };
const { name, age } = user;                // by key, order irrelevant
const { name: userName } = user;           // rename -> userName="Ada"
const { role = "guest" } = user;           // default (key missing -> "guest")
```

### Nested + in function params (very common)
```js
function greet({ name, address: { city = "?" } = {} }) {
  return `${name} from ${city}`;
}
greet({ name: "Bo", address: { city: "NYC" } }); // "Bo from NYC"
```

### Spread: copy & merge
```js
const copy = [...arr];                 // shallow copy of array
const merged = [...a, ...b];           // concatenate
const obj2 = { ...base, active: true };// shallow copy + add/override (last wins)
const patched = { ...base, ...overrides }; // overrides win on key clash
```

### Rest: collect the remainder
```js
const [head, ...tail] = [1, 2, 3, 4];        // head=1, tail=[2,3,4]
const { id, ...everythingElse } = record;    // pull id out, keep the rest
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); } // varargs
```

## Related Topics
- [[arrays-higher-order|Array Higher-Order Methods]]
- [[functions-and-arrows|Functions & Arrow Functions]]
- [[objects-and-prototypes|Objects & Prototypes]]

## Cards

```anki
START
Basic
Write the syntax to destructure `name` and `age` out of an object `user`.
Back: `const { name, age } = user;` — object destructuring matches by key name, not position.
<!--ID: 1782407009099-->
END

START
Basic
A destructuring default `const { role = "guest" } = obj` — does it fire when `obj.role` is `null`?
Back: No. Defaults fire only when the value is `undefined` (missing key). `null` is a real value and is kept as-is.
<!--ID: 1782407009102-->
END

START
Basic
What does `...` do in `const obj2 = { ...base, active: true }` vs in `const [head, ...tail] = arr`?
Back: First is spread (shallow-copies `base`'s keys into a new object). Second is rest (collects remaining elements into `tail`). Same token, opposite roles.
<!--ID: 1782407009106-->
END

START
Basic
You see `const { name: userName } = user`. What is the resulting variable name and value?
Back: A variable `userName` holding `user.name`. The `key: alias` form renames during destructuring.
<!--ID: 1782407009109-->
END

START
Basic
Gotcha: is `const copy = [...arr]` a deep or shallow copy?
Back: Shallow. Top-level elements are copied, but nested objects/arrays are still shared references. Same for `{ ...obj }`.
<!--ID: 1782407009112-->
END

START
Basic
Two objects merged with `{ ...a, ...b }` share a key. Which value wins?
Back: `b`'s value — later spreads override earlier ones (last-wins), left to right.
<!--ID: 1782407009115-->
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
