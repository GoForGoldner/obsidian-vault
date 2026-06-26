---
tags: [typescript, web-dev, types]
category: web-dev
related: [typescript-overview, union-intersection-narrowing, type-assertions-and-satisfies, functions-typing, interfaces-vs-type-aliases]
---

## Description
TS primitives are lowercase: `string`, `number` (one numeric type — no `int`/`double`), `boolean`. Arrays are `T[]` or `Array<T>`; fixed-length heterogeneous arrays are **tuples** `[string, number]`. `any` opts out of all checking (avoid it). `unknown` is the **safe** top type — you can hold anything but must narrow before using it. `void` is a function returning nothing useful; `never` is a value that can't exist (throws, infinite loops, exhaustiveness). TS has strong **inference**, so annotate at boundaries (function params, exported APIs) and let locals infer.

## Examples
### Primitives, arrays, tuples
```ts
let name: string = "Ada";
let count = 42;                 // inferred number — no annotation needed
let nums: number[] = [1, 2, 3];
let names: Array<string> = ["a"]; // identical to string[]
let pair: [string, number] = ["age", 30]; // tuple: fixed shape
```

### `unknown` vs `any`
```ts
let a: any = 10;
a.foo.bar;          // no error — any disables checking (dangerous)

let u: unknown = JSON.parse(input);
// u.length;        // ERROR: must narrow first
if (typeof u === "string") u.length; // OK after narrowing
```

### `void` and `never`
```ts
function log(msg: string): void { console.log(msg); }
function fail(m: string): never { throw new Error(m); } // never returns
```

### `null` / `undefined` (with strictNullChecks)
```ts
let maybe: string | null = null;   // must include null in the type
let opt: string | undefined;       // undefined is its own type
```

## Related Topics
- [[typescript-overview|TypeScript Overview]]
- [[union-intersection-narrowing|Unions, Intersections & Narrowing]]
- [[functions-typing|Typing Functions]]

## Cards

```anki
START
Basic
What's the difference between `unknown` and `any` in TypeScript?
Back: `any` disables all type checking (you can do anything, unsafely). `unknown` accepts any value but lets you do *nothing* with it until you narrow (typeof/instanceof/etc.). `unknown` is the safe choice for untrusted input.
<!--ID: 1782407009538-->
END

START
Basic
How many numeric types does TypeScript have, and what are they called?
Back: One: `number` (covers ints and floats; lowercase). There's no `int`/`long`/`double`. (`bigint` exists separately for arbitrary-precision integers.)
<!--ID: 1782407009542-->
END

START
Basic
Write a type annotation for a tuple holding a string then a number.
Back: `[string, number]` — e.g. `let pair: [string, number] = ["age", 30];`. Fixed length and per-position types, unlike `(string|number)[]`.
<!--ID: 1782407009546-->
END

START
Basic
When does the `never` type show up, and what does it mean?
Back: A value that can never occur. Return type of functions that always throw or loop forever, and the type that remains after exhaustive narrowing. Useful for compile-time exhaustiveness checks.
<!--ID: 1782407009550-->
END

START
Basic
You wrote `let nums = [1, 2, 3];` with no annotation. What type does TS infer?
Back: `number[]`. TS infers from the initializer, so locals usually don't need annotations — annotate function params and public APIs, not obvious locals.
<!--ID: 1782407009553-->
END

START
Basic
With `strictNullChecks` on, how do you type a variable that may hold a string or be null?
Back: `string | null` (an explicit union). Without it in the type, assigning `null` is an error — TS doesn't silently allow null like Java references.
<!--ID: 1782407009557-->
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
