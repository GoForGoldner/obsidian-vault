---
tags: [typescript, web-dev, dom, types]
category: web-dev
related: [type-assertions-and-satisfies, basic-types-annotations, document-and-selectors, dom-events, components-and-props]
---

## Description
The DOM lib types (`lib.dom.d.ts`) ship with TS. The key gotcha: `document.querySelector(selector)` returns `Element | null` — you must handle the null (the element might not exist) and you only get the generic `Element`, which lacks specifics like `.value` or `.checked`. Use the **generic form** `querySelector<HTMLInputElement>(...)` (or a CSS-tag selector TS recognizes, e.g. `querySelector("input")`) to get a narrower element type, or assert with `as HTMLInputElement` when you know better. Know the hierarchy: `Element` (any element) -> `HTMLElement` (HTML elements, has `.style`, `.dataset`) -> specific types like `HTMLInputElement`. Events are typed too: `addEventListener("click", e => ...)` infers `e: MouseEvent`; with a standalone handler, annotate it yourself.

## Examples
### querySelector returns Element | null
```ts
const el = document.querySelector(".btn"); // Element | null
el?.classList.add("on");                   // must guard against null
```

### Generic form narrows the element type
```ts
const input = document.querySelector<HTMLInputElement>("#email");
if (input) input.value = "a@b.com"; // .value exists on HTMLInputElement, not Element
```

### Casting when you're certain
```ts
const box = document.getElementById("agree") as HTMLInputElement;
box.checked; // getElementById returns HTMLElement | null, so a cast is common here
```

### Event typing
```ts
button.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  const t = e.currentTarget as HTMLButtonElement; // target is typed loosely
});
```

## Related Topics
- [[type-assertions-and-satisfies|Assertions & satisfies]]
- [[document-and-selectors|DOM Query Selectors]]
- [[dom-events|DOM Events]]
- [[components-and-props|React Props]]

## Cards

```anki
START
Basic
What does `document.querySelector(".btn")` return in TypeScript, and what must you do?
Back: `Element | null`. You must handle the `null` (optional chaining `?.` or an `if` guard) — TS won't let you use it directly because the element may not exist.
<!--ID: 1782407009661-->
END

START
Basic
You need `.value` off a queried element but only see `Element`. Two ways to get the right type?
Back: (1) Generic form: `querySelector<HTMLInputElement>("#x")`. (2) Assert: `querySelector("#x") as HTMLInputElement`. `.value` lives on `HTMLInputElement`, not the generic `Element`.
<!--ID: 1782407009664-->
END

START
Basic
Difference between `Element` and `HTMLElement` in the DOM types?
Back: `Element` is any element (incl. SVG/XML); `HTMLElement` is the HTML-specific subtype that adds members like `.style`, `.dataset`, `.click()`. Specific tags (`HTMLInputElement`) extend `HTMLElement`.
<!--ID: 1782407009667-->
END

START
Basic
In `el.addEventListener("click", e => {...})`, what type is `e` and why?
Back: `MouseEvent` — TS maps the event-name string literal `"click"` to its event type via overloads on `addEventListener`. (`"keydown"` -> `KeyboardEvent`, etc.)
<!--ID: 1782407009670-->
END

START
Basic
Why does `getElementById("x")` often need an `as` cast in TS?
Back: It returns `HTMLElement | null` (not the specific element type). After null-checking you still cast (e.g. `as HTMLInputElement`) to access input-specific members, since there's no generic form like querySelector has.
<!--ID: 1782407009674-->
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
