---
tags: [typescript, web-dev, types, enums]
category: web-dev
related: [union-intersection-narrowing, basic-types-annotations, type-assertions-and-satisfies, interfaces-vs-type-aliases]
---

## Description
TS `enum` (numeric or string) is one of the few features that **emits runtime code** (an object), unlike everything else that's erased — which is exactly why many teams avoid it. Numeric enums auto-increment and allow surprising reverse lookups; `const enum` inlines but has bundler caveats. The modern idiom is a **union of string literals** (`type Status = "active" | "done"`) for the type, or an **`as const` object** when you also need runtime values. `as const` freezes a literal to its narrowest readonly type, so `{ GET: "GET" } as const` gives literal types instead of widening `"GET"` to `string`. Literal narrowing is what makes unions and discriminated unions work.

## Examples
### Enums (and why teams skip them)
```ts
enum Color { Red, Green }   // Red=0, Green=1; emits a runtime object
enum Dir { Up = "UP", Down = "DOWN" } // string enum, no reverse map
```

### Union of literals — usually preferred
```ts
type Status = "active" | "paused" | "done"; // pure type, zero runtime cost
function set(s: Status) {/* ... */}
```

### `as const` object: type + runtime values
```ts
const Roles = { Admin: "ADMIN", Guest: "GUEST" } as const;
type Role = typeof Roles[keyof typeof Roles]; // "ADMIN" | "GUEST"
Roles.Admin; // usable value at runtime
```

### Literal widening vs `as const`
```ts
let a = "GET";              // type widens to string
const b = "GET";           // type is "GET" (const + literal)
let c = "GET" as const;    // type pinned to "GET"
```

## Related Topics
- [[union-intersection-narrowing|Unions & Narrowing]]
- [[type-assertions-and-satisfies|Assertions & satisfies]]
- [[basic-types-annotations|Basic Types]]

## Cards

```anki
START
Basic
Why do many TS teams avoid `enum` in favor of union-of-literals or `as const` objects?
Back: `enum` emits real runtime code (an object) unlike erased types, numeric enums have surprising reverse lookups, and `const enum` has bundler pitfalls. Unions/`as const` are lighter, tree-shakeable, and purely structural.
<!--ID: 1782407009561-->
END

START
Basic
What does `as const` do to `{ GET: "GET" } as const`?
Back: Pins it to the narrowest readonly literal type — properties become `readonly` and values get literal types (`"GET"`, not `string`). Prevents widening.
<!--ID: 1782407009564-->
END

START
Basic
`let a = "GET";` vs `const a = "GET";` — what types are inferred?
Back: `let a` widens to `string`; `const a` infers the literal type `"GET"` (because a const string can't change). Use `as const` to get literal types on `let` or in objects/arrays.
<!--ID: 1782407009568-->
END

START
Basic
How do you derive a union type of values from an `as const` object `Roles`?
Back: `type Role = typeof Roles[keyof typeof Roles];` — `typeof` gets its type, `keyof` the keys, indexed access the value union.
<!--ID: 1782407009571-->
END

START
Basic
Numeric enum `enum Color { Red, Green }` — what are the assigned values, and what's the gotcha?
Back: `Red = 0`, `Green = 1` (auto-incrementing). Gotcha: numeric enums create a reverse map (`Color[0] === "Red"`) and freely accept any number-ish value, which can hide bugs.
<!--ID: 1782407009574-->
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
