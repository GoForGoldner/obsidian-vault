---
tags: [typescript, web-dev, types, utility-types]
category: web-dev
related: [generics-typescript, interfaces-vs-type-aliases, functions-typing, basic-types-annotations, components-and-props]
---

## Description
Utility types are built-in generic type transformers that derive new types from existing ones — so you define a shape once and project variants instead of duplicating. The core set: `Partial<T>` (all optional), `Required<T>`, `Readonly<T>`, `Pick<T, K>` / `Omit<T, K>` (subset by keys), `Record<K, V>` (object from key union to value). Function-related: `ReturnType<F>`, `Parameters<F>`, and `Awaited<T>` (unwrap a Promise). The primitives behind them are `keyof T` (union of a type's keys) and **indexed access** `T[K]` (the type of a property). These keep types DRY and in sync with the source type.

## Examples
### Partial / Pick / Omit
```ts
interface User { id: number; name: string; email: string; }

type Draft   = Partial<User>;          // every field optional
type Public  = Omit<User, "email">;    // { id; name }
type IdName  = Pick<User, "id"|"name">; // { id; name }
```

### Record, keyof, indexed access
```ts
type Roles = Record<"admin" | "guest", boolean>; // { admin: boolean; guest: boolean }
type Keys  = keyof User;        // "id" | "name" | "email"
type NameT = User["name"];      // string  (indexed access)
```

### ReturnType / Parameters / Awaited
```ts
function load() { return { ok: true }; }
type R = ReturnType<typeof load>;   // { ok: boolean }
type P = Parameters<typeof load>;   // []  (tuple of params)

type Data = Awaited<Promise<number>>; // number
```

## Related Topics
- [[generics-typescript|Generics]]
- [[interfaces-vs-type-aliases|Interfaces vs Types]]
- [[components-and-props|React Props]]

## Cards

```anki
START
Basic
You have `interface User {...}` and need a type with every field optional for a PATCH update. Which utility type?
Back: `Partial<User>` — makes all properties optional. (`Required<T>` is the inverse.)
<!--ID: 1782407009696-->
END

START
Basic
Difference between `Pick<T, K>` and `Omit<T, K>`?
Back: `Pick<T, K>` keeps only the listed keys `K`; `Omit<T, K>` keeps everything except `K`. Both produce a subset object type from `T`.
<!--ID: 1782407009699-->
END

START
Basic
What does `keyof User` produce, given `User` has `id`, `name`, `email`?
Back: The union of its keys as string literals: `"id" | "name" | "email"`.
<!--ID: 1782407009702-->
END

START
Basic
You have `function load(): {...}`. How do you get its return type as a type, without re-typing it?
Back: `ReturnType<typeof load>`. `typeof load` gets the function's type; `ReturnType<>` extracts what it returns.
<!--ID: 1782407009705-->
END

START
Basic
How do you build a type `{ admin: boolean; guest: boolean }` from a key union and a value type?
Back: `Record<"admin" | "guest", boolean>`. `Record<K, V>` maps each key in union `K` to value type `V`.
<!--ID: 1782407009708-->
END

START
Basic
You have `type T = Promise<User>`. How do you get just `User` out of it as a type?
Back: `Awaited<T>` — unwraps the Promise (and recursively nested promises) to its resolved value type.
<!--ID: 1782407009711-->
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
