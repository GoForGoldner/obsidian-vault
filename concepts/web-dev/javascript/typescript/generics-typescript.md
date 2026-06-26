---
tags: [typescript, web-dev, generics, types]
category: web-dev
related: [typescript-overview, utility-types, functions-typing, interfaces-vs-type-aliases, union-intersection-narrowing]
---

## Description
Generics parameterize types so code is reusable without losing type info. Syntax mirrors Java (`<T>`), and you can constrain a parameter with `extends` (an upper bound), give **default type params** (`<T = string>`), and use generics on functions, interfaces, classes, and type aliases. Two big differences from Java: TS generics are **erased like everything else** (no `T.class`, no `new T()`, no reified arrays — but also no Java erasure casts/warnings), and TS **inference** is much stronger — you rarely write the type argument explicitly because it's inferred from the arguments. Use a constraint when the body needs to access members of `T`.

## Examples
### Generic function with inference
```ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }
const n = first([1, 2, 3]);   // T inferred as number; no <number> needed
```

### Constraint with `extends`
```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b; // .length allowed thanks to constraint
}
longest("abc", "de");        // ok
// longest(3, 5);            // ERROR: number has no .length
```

### Default type parameter
```ts
interface Box<T = string> { value: T; }
const b: Box = { value: "hi" };   // T defaults to string
```

### Generic class
```ts
class Stack<T> {
  private items: T[] = [];
  push(x: T) { this.items.push(x); }
  pop(): T | undefined { return this.items.pop(); }
}
```

## Related Topics
- [[utility-types|Utility Types]]
- [[functions-typing|Typing Functions]]
- [[typescript-overview|TypeScript Overview]]

## Cards

```anki
START
Basic
How do you require that a generic parameter `T` has a `.length` property?
Back: Constrain it: `<T extends { length: number }>`. `extends` sets an upper bound, so the body can safely access `.length`.
<!--ID: 1782407009595-->
END

START
Basic
Why does `first([1,2,3])` not need `first<number>(...)` in TypeScript?
Back: TS inference deduces the type argument from the call arguments (`number[]` -> `T = number`). Explicit type args are usually only needed when inference can't see them.
<!--ID: 1782407009598-->
END

START
Basic
Two ways TS generics differ from Java generics?
Back: (1) Like all TS types they're fully erased — no `new T()`, no `T.class`, no reified generic arrays. (2) Inference is far stronger, so you rarely annotate the type argument. (No unchecked-cast warnings either.)
<!--ID: 1782407009601-->
END

START
Basic
Write a generic interface whose type parameter defaults to `string`.
Back: `interface Box<T = string> { value: T; }`. Used as `Box` it behaves like `Box<string>`.
<!--ID: 1782407009605-->
END

START
Basic
You wrote `function id<T>(x: T): T`. Why is that better than `(x: any): any`?
Back: Generics preserve the relationship: output type equals input type, so the caller keeps full type info. `any` throws it away and disables checking.
<!--ID: 1782407009608-->
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
