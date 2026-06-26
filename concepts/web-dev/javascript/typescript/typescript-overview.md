---
tags: [typescript, web-dev, types]
category: web-dev
related: [basic-types-annotations, interfaces-vs-type-aliases, types-and-coercion, generics-typescript]
---

## Description
TypeScript is JavaScript plus a **compile-time** type layer. `tsc` checks your types and then **erases** them, emitting plain JS — so types have **zero runtime presence** (no reflection, no `instanceof MyInterface`, no runtime type checks for free, unlike Java). The biggest mental shift from Java is **structural ("duck") typing**: a value is assignable to a type if its shape matches, regardless of declared names or `implements` clauses. There is no JVM; the output runs in browsers and Node. Types catch bugs and power editor tooling, but at runtime you are running ordinary JavaScript.

## Examples
### Types are erased — they don't exist at runtime
```ts
interface User { name: string; }
const u: User = { name: "Ada" };
// console.log(u instanceof User); // ERROR: 'User' only refers to a type, not a value
```
Compiles to just: `const u = { name: "Ada" };`

### Structural typing: no `implements` needed
```ts
interface Point { x: number; y: number; }
function dist(p: Point) { return Math.hypot(p.x, p.y); }

// Never mentions Point, but its shape matches — accepted.
const thing = { x: 3, y: 4, label: "extra" };
dist(thing); // OK
```

### Compiling
```bash
tsc app.ts          # type-check + emit app.js
tsc --noEmit        # type-check only (CI/lint use)
```

## Related Topics
- [[basic-types-annotations|Basic Types & Annotations]]
- [[interfaces-vs-type-aliases|Interfaces vs Type Aliases]]
- [[generics-typescript|Generics in TypeScript]]
- [[types-and-coercion|JavaScript Types & Coercion]]

## Cards

```anki
START
Basic
In TypeScript, when do type annotations actually run / take effect?
Back: Never at runtime. Types are checked by `tsc` at compile time, then fully erased — the emitted JS has no type info. No runtime reflection like Java.
<!--ID: 1782407009644-->
END

START
Basic
A function takes `interface Point { x: number; y: number }`. You pass `{ x: 3, y: 4, label: "hi" }` declared with no relation to Point. Does it type-check?
Back: Yes. TS uses structural ("duck") typing — shape compatibility is enough. The object has the required `x`/`y`, so it's assignable. (Excess-property checks only fire on object *literals* passed directly.)
<!--ID: 1782407009647-->
END

START
Basic
What's the key typing difference between Java and TypeScript that bites Java devs first?
Back: Java is nominal (must `implements`/`extends` by name); TS is structural — matching shape is sufficient, no declared relationship required.
<!--ID: 1782407009650-->
END

START
Basic
Why can't you write `if (x instanceof MyInterface)` in TypeScript?
Back: Interfaces are erased at compile time, so they don't exist as runtime values. `instanceof` needs a real constructor/class. Use a runtime shape check or a class instead.
<!--ID: 1782407009654-->
END

START
Basic
What does `tsc --noEmit` do and when do you use it?
Back: Type-checks without producing any `.js` output. Used in CI / lint steps where another tool (Babel, esbuild, Vite) does the actual transpilation.
<!--ID: 1782407009657-->
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
