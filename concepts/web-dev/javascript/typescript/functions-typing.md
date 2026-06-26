---
tags: [typescript, web-dev, functions, types]
category: web-dev
related: [basic-types-annotations, generics-typescript, utility-types, union-intersection-narrowing, functions-and-arrows]
---

## Description
Type the parameters and (optionally) the return — the return is usually inferred. Params can be **optional** (`x?: T`, trailing only) or have **defaults** (`x = 5`, which also makes them optional); **rest params** collect the rest as a tuple/array (`...args: number[]`). A standalone **function type expression** is `(a: string) => number`. Interfaces/types can carry **call signatures** and **overloads** (multiple signatures + one implementation) when one input shape returns different output types. The `this` parameter is a fake first param used purely for typing — it has no runtime cost and disappears on emit. Java contrast: arrow functions lexically bind `this`, and TS has no method overloading at runtime (overloads are type-only).

## Examples
### Optional, default, rest params
```ts
function greet(name: string, greeting = "Hi", ...tags: string[]): string {
  return `${greeting}, ${name} ${tags.join(",")}`;
}
```

### Function type expression & call signature
```ts
type BinOp = (a: number, b: number) => number;
const add: BinOp = (a, b) => a + b;        // params inferred from BinOp

interface Logger { (msg: string): void; level: number; } // callable + property
```

### Overloads (type-level only)
```ts
function parse(x: string): string[];
function parse(x: number): number[];
function parse(x: string | number) {        // single implementation
  return typeof x === "string" ? x.split("") : [x];
}
```

### Typing `this`
```ts
function handler(this: HTMLButtonElement, e: Event) {
  this.disabled = true;   // 'this' typed; not a real runtime parameter
}
```

## Related Topics
- [[basic-types-annotations|Basic Types]]
- [[generics-typescript|Generics]]
- [[utility-types|Utility Types (ReturnType/Parameters)]]

## Cards

```anki
START
Basic
Write a standalone TS type for a function taking two numbers and returning a number.
Back: `type BinOp = (a: number, b: number) => number;`. Note the `=>` arrow in *type* position (different from a value arrow function).
<!--ID: 1782407009578-->
END

START
Basic
What's the difference between `x?: number` and `x = 5` in a parameter list?
Back: `x?: number` is optional (may be `undefined`). `x = 5` gives a default value (also makes it optional, but supplies 5 when omitted). Optional params must be trailing.
<!--ID: 1782407009581-->
END

START
Basic
How do TypeScript function overloads work at runtime?
Back: They don't — overloads are type-only. You write multiple signature lines, then ONE implementation that handles all cases (and whose own signature isn't callable). After emit, it's a single JS function.
<!--ID: 1782407009584-->
END

START
Basic
How do you type the `this` value inside a standalone function, and does it cost anything at runtime?
Back: Add a fake first parameter `this: SomeType` (e.g. `function f(this: HTMLButtonElement, e: Event)`). It's type-only and erased — not a real argument.
<!--ID: 1782407009588-->
END

START
Basic
How do you type a rest parameter that collects any number of strings?
Back: `...args: string[]` (or a tuple type). Must be the last parameter.
<!--ID: 1782407009591-->
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
