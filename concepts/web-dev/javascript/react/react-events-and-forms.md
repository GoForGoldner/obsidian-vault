---
tags: [react, web-dev, events, forms]
category: web-dev
related: [usestate, useref, jsx, dom-events, typing-the-dom]
---

## Description
React attaches handlers via camelCase JSX props (`onClick`, `onChange`, `onSubmit`) that take a **function reference**, not a string. The event object you receive is a **SyntheticEvent** — React's cross-browser wrapper around the native DOM event with the same API (`e.target`, `e.preventDefault()`); `e.target` for an input is the DOM element. The central form concept is **controlled vs uncontrolled**. A **controlled input** has its `value` driven by state and an `onChange` that writes back to state — React is the single source of truth, and the input can't change without going through your code. An **uncontrolled input** keeps its own value in the DOM and you read it imperatively via a ref (or on submit). Controlled is the default recommendation. On submit, call `e.preventDefault()` to stop the browser's full-page reload. In TypeScript, type handlers with `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`, `React.MouseEvent<HTMLButtonElement>`.

## Examples

### Controlled input (state is the source of truth)
```tsx
const [name, setName] = useState("");
<input
  value={name}                                       // value comes FROM state
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
/>;
// Without onChange writing back to state, a controlled input appears "frozen".
```

### Uncontrolled input (read via ref)
```tsx
const nameRef = useRef<HTMLInputElement>(null);
<input ref={nameRef} defaultValue="" />;   // defaultValue, not value
// later: const n = nameRef.current?.value; // DOM holds the value, not React
```

### Form submit with preventDefault and typed handler
```tsx
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();   // stop the default full-page navigation/reload
  console.log(name);
}
<form onSubmit={handleSubmit}><input value={name} onChange={...} /><button>Save</button></form>;
```

## Related Topics
- [[usestate|useState]]
- [[useref|useRef]]
- [[dom-events|DOM Events]]
- [[typing-the-dom|Typing the DOM]]

## Cards

```anki
START
Basic
What is a React SyntheticEvent and how does it relate to the native DOM event?
Back: A cross-browser wrapper React passes to handlers, with the same API as the native event (`e.target`, `e.preventDefault()`). It normalizes browser differences; `e.nativeEvent` gives the underlying event.
<!--ID: 1782407009788-->
END

START
Basic
Distinguish a controlled vs an uncontrolled input in React.
Back: Controlled: its `value` is driven by state with an `onChange` writing back — React is the source of truth. Uncontrolled: the DOM holds the value (use `defaultValue`) and you read it via a ref.
<!--ID: 1782407009791-->
END

START
Basic
You set `<input value={name} />` with no `onChange` and the field won't accept typing. Why?
Back: A controlled input's value is locked to state. With no onChange to update that state, React re-renders the same value on every keystroke, so it appears frozen.
<!--ID: 1782407009794-->
END

START
Basic
Write the TypeScript type for the event parameter of an `<input>`'s onChange handler.
Back: `React.ChangeEvent<HTMLInputElement>` — e.g. `(e: React.ChangeEvent<HTMLInputElement>) => setX(e.target.value)`.
<!--ID: 1782407009797-->
END

START
Basic
Why call `e.preventDefault()` in a form's onSubmit handler?
Back: To stop the browser's default form submission, which would reload/navigate the page and discard your SPA state. You then handle the data in JS instead.
<!--ID: 1782407009800-->
END

START
Basic
In JSX, how do you wire up a click handler, and what's the common mistake from HTML habits?
Back: `onClick={handleClick}` — pass a function reference (camelCase). Mistakes: writing `onclick`, passing a string `onClick="handleClick()"`, or calling it `onClick={handleClick()}` which runs it during render.
<!--ID: 1782407009803-->
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
