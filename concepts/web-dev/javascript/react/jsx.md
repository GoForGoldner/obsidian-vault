---
tags: [react, web-dev, jsx]
category: web-dev
related: [react-overview, components-and-props, conditional-rendering-and-lists, typing-the-dom]
---

## Description
JSX is a syntax extension that lets you write HTML-looking markup directly in TypeScript/JavaScript. It is **not** a string template — it compiles to function calls (`react/jsx-runtime`'s `jsx(...)`, historically `React.createElement(...)`), so a JSX expression is just an ordinary value you can store in a variable or return. Inside JSX, `{}` switches back to JS expression mode (only expressions, not statements — no `if`/`for`). Because it's really JS, attribute names use **camelCase** and a few are renamed to avoid reserved words: `class` becomes `className`, `for` becomes `htmlFor`. A component must return a **single root element**; wrap siblings in a fragment `<>...</>` (renders nothing extra to the DOM) when you don't want an extra wrapper div.

## Examples

### Embedding expressions with `{}`
```tsx
const user = { name: "Tyler", age: 30 };
const el = (
  <p>
    {user.name} is {user.age} years old. Next year: {user.age + 1}.
  </p>
);
// {} takes an expression. {user.age + 1} works; {if (...) {}} does NOT.
```

### className, camelCase attrs, fragments
```tsx
function Card() {
  return (
    <> {/* fragment: groups siblings without adding a wrapper element */}
      <div className="card" tabIndex={0} onClick={handleClick}>Hi</div>
      <label htmlFor="email">Email</label>
    </>
  );
}
```

### What JSX compiles to
```tsx
// This JSX:
const a = <button className="primary">Go</button>;
// is roughly equivalent to this call (so it's just a value):
const b = jsx("button", { className: "primary", children: "Go" });
```

## Related Topics
- [[react-overview|React Overview]]
- [[components-and-props|Components & Props]]
- [[conditional-rendering-and-lists|Conditional Rendering & Lists]]
- [[typing-the-dom|Typing the DOM]]

## Cards

```anki
START
Basic
In JSX, what kind of code can go inside `{ }`, and what's the one thing you can't put there?
Back: Any JS *expression* (produces a value): variables, calls, ternaries, `.map`. You cannot put *statements* — no `if`, `for`, or variable declarations inside the braces.
<!--ID: 1782407009747-->
END

START
Basic
Why is it `className` and not `class` in JSX, and what's the equivalent rename for the `for` attribute?
Back: `class` and `for` are reserved words in JS, so JSX uses `className` and `htmlFor`. Most other attributes just become camelCase (e.g. `tabindex` -> `tabIndex`, `onclick` -> `onClick`).
<!--ID: 1782407009754-->
END

START
Basic
You see `<>...</>` wrapping several elements. What is it and why use it instead of a `<div>`?
Back: A Fragment. It lets a component return multiple sibling elements (which must have a single root) without adding an extra wrapper node to the actual DOM.
<!--ID: 1782407009759-->
END

START
Basic
A coworker says JSX is "just an HTML string template." Why is that wrong?
Back: JSX compiles to function calls (`jsx(...)` / `React.createElement(...)`) that return plain JS objects (React elements). It's a value you can assign, return, or pass around — not a string.
<!--ID: 1782407009762-->
END

START
Basic
A component body is `return <h1>Hi</h1> <p>Bye</p>;`. Why does this fail, and how do you fix it?
Back: A component must return a single root element. Wrap the siblings in a fragment: `return <><h1>Hi</h1><p>Bye</p></>;`
<!--ID: 1782407009765-->
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
