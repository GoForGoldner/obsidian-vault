---
tags: [typescript, web-dev, types]
category: web-dev
related: [typescript-overview, basic-types-annotations, union-intersection-narrowing, utility-types, components-and-props]
---

## Description
Both `interface` and `type` name a shape. **Interfaces** can be re-opened and merged (**declaration merging**) and extend via `extends`; they're idiomatic for object/class contracts. **Type aliases** can name *anything* — unions, intersections, primitives, tuples, mapped types — which interfaces can't. Members support `?` (optional) and `readonly`, and **index signatures** `[key: string]: T` describe open-ended keys. Rule of thumb: use `interface` for object shapes and public APIs (better merging/extension); use `type` when you need unions/intersections/conditionals. Unlike Java interfaces, these are purely structural and erased at runtime.

## Examples
### interface vs type for an object shape
```ts
interface User { id: number; name: string; }
type UserT = { id: number; name: string }; // equivalent here
```

### Only `type` can alias a union
```ts
type Status = "active" | "banned";   // interfaces CANNOT do this
type Id = string | number;
```

### Optional, readonly, index signature
```ts
interface Config {
  readonly id: number;        // can't reassign after creation
  name?: string;              // optional
  [key: string]: unknown;     // arbitrary extra keys allowed
}
```

### Extending & declaration merging
```ts
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }

interface Animal { age: number; } // MERGES — Animal now has name + age
```

## Related Topics
- [[typescript-overview|TypeScript Overview]]
- [[union-intersection-narrowing|Unions & Intersections]]
- [[utility-types|Utility Types]]
- [[components-and-props|React Components & Props]]

## Cards

```anki
START
Basic
When do you reach for `interface` vs `type` alias in TypeScript?
Back: `interface` for object/class shapes and public APIs (supports declaration merging, `extends`). `type` when you need a union, intersection, tuple, primitive alias, or mapped/conditional type — things interface can't express.
<!--ID: 1782407009611-->
END

START
Basic
What is declaration merging, and which one supports it — `interface` or `type`?
Back: Only `interface`. Two `interface` declarations with the same name merge into one combined shape. `type` aliases with a duplicate name are a redeclaration error. Useful for augmenting library types.
<!--ID: 1782407009614-->
END

START
Basic
Write an interface member that is optional and one that can't be reassigned.
Back: `name?: string;` (optional) and `readonly id: number;` (readonly). `readonly` is compile-time only — erased at runtime.
<!--ID: 1782407009617-->
END

START
Basic
You need a type for an object with unknown string keys all mapping to numbers. What syntax?
Back: An index signature: `interface Scores { [key: string]: number }` (or `Record<string, number>`).
<!--ID: 1782407009621-->
END

START
Basic
Why can't you write `interface Status = "a" | "b"`?
Back: Interfaces only describe object shapes — they can't alias a union of literals. Use a type alias: `type Status = "a" | "b";`.
<!--ID: 1782407009624-->
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
