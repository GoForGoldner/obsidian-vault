---
tags: [typescript, web-dev, types, narrowing]
category: web-dev
related: [basic-types-annotations, interfaces-vs-type-aliases, enums-literals-as-const, generics-typescript, type-assertions-and-satisfies]
---

## Description
A **union** `A | B` is a value that is one of several types; an **intersection** `A & B` is a value that has all members of both. **Literal types** (`"GET" | "POST"`, `1 | 2`) let unions enumerate exact values. To use a union you must **narrow** it — TS tracks control flow, so `typeof`, `instanceof`, the `in` operator, and truthiness checks refine the type inside the branch. A **discriminated union** (each member sharing a literal "tag" field) is the idiomatic pattern; switching on the tag narrows cleanly, and a `never`-typed default gives **compile-time exhaustiveness** so adding a new variant breaks the build until you handle it. This is the TS replacement for sealed-class/visitor patterns.

## Examples
### Narrowing with typeof / in
```ts
function pad(x: string | number) {
  if (typeof x === "number") return " ".repeat(x); // x: number here
  return x.padStart(10);                            // x: string here
}
```

### Discriminated union + exhaustiveness
```ts
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; size: number };

function area(s: Shape): number {
  switch (s.kind) {              // discriminant narrows each branch
    case "circle": return Math.PI * s.r ** 2;
    case "square": return s.size ** 2;
    default:
      const _exhaustive: never = s; // ERROR if a new kind is unhandled
      return _exhaustive;
  }
}
```

### Intersection
```ts
type Named = { name: string };
type Aged  = { age: number };
type Person = Named & Aged;     // must have BOTH name and age
```

## Related Topics
- [[basic-types-annotations|Basic Types]]
- [[enums-literals-as-const|Enums, Literals & as const]]
- [[type-assertions-and-satisfies|Assertions & satisfies]]

## Cards

```anki
START
Basic
What's a discriminated union and what makes narrowing on it work?
Back: A union whose members each carry the same literal "tag" field (e.g. `kind: "circle"`). Switching/branching on that tag narrows the value to the matching member, exposing its specific fields.
<!--ID: 1782407009677-->
END

START
Basic
You want the compiler to force you to handle every variant of a union. What's the trick?
Back: Exhaustiveness via `never`: in the `default`/`else`, assign the value to a `never`-typed variable (`const _x: never = s`). If a new variant is added and unhandled, it won't be `never` and the build fails.
<!--ID: 1782407009680-->
END

START
Basic
Difference between `A | B` and `A & B` in TypeScript?
Back: `A | B` (union) = one of the types; you can only use members common to all until you narrow. `A & B` (intersection) = a single value having all members of both.
<!--ID: 1782407009683-->
END

START
Basic
You have `x: string | number`. How do you make `x.padStart()` type-check?
Back: Narrow first: `if (typeof x === "string") { x.padStart(...) }`. Inside the branch TS knows `x` is `string`.
<!--ID: 1782407009686-->
END

START
Basic
Which narrowing operator checks whether a property exists on an object union member?
Back: The `in` operator — `if ("swim" in animal)` narrows to the union member(s) that have a `swim` property.
<!--ID: 1782407009689-->
END

START
Basic
Why use a union of string literals like `"GET" | "POST"` instead of `string`?
Back: It restricts the value to an exact allowed set, catches typos at compile time, and gives autocomplete — far stronger than a plain `string`.
<!--ID: 1782407009693-->
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
