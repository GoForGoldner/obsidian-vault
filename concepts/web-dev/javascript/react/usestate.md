---
tags: [react, web-dev, hooks, state]
category: web-dev
related: [react-overview, useeffect, useref, rules-of-hooks, components-and-props]
---

## Description
`useState` gives a function component a piece of **state** that survives re-renders and, when changed, triggers a re-render. It returns a two-element tuple: the current value and a **setter**. Calling the setter doesn't mutate a variable in place — it schedules a re-render with the new value, so the update is effectively **asynchronous and batched** (multiple setter calls in one event handler are coalesced into one render). Because of batching, reading the state variable right after setting it gives the *old* value; when the new value depends on the previous one, use the **functional update** form `setX(prev => next)`. You must **never mutate state directly** (no `state.push(...)`); always pass a new value/array/object so React detects the change by reference. TypeScript usually infers the type from the initial value; supply a generic when it can't (e.g. `useState<User | null>(null)`).

## Examples

### Basic counter and the batching gotcha
```tsx
const [count, setCount] = useState(0); // type inferred as number

function tripleWrong() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1); // all use the SAME stale `count` -> ends at +1, not +3
}

function tripleRight() {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1); // functional form chains correctly -> +3
}
```

### Never mutate; typing state explicitly
```tsx
const [user, setUser] = useState<User | null>(null); // can't infer null-or-User alone
const [items, setItems] = useState<string[]>([]);

// WRONG: items.push("x"); setItems(items);  // same array reference -> no re-render
setItems(prev => [...prev, "x"]);            // new array -> React re-renders
setUser(prev => prev ? { ...prev, name: "Tyler" } : prev); // copy, don't mutate
```

## Related Topics
- [[react-overview|React Overview]]
- [[useeffect|useEffect]]
- [[useref|useRef]]
- [[rules-of-hooks|Rules of Hooks]]

## Cards

```anki
START
Basic
What does `useState(0)` return, and how do you typically capture it?
Back: A tuple `[value, setter]`. You destructure it: `const [count, setCount] = useState(0)`. `count` is the current value; `setCount` schedules an update + re-render.
<!--ID: 1782407009896-->
END

START
Basic
You call `setCount(count + 1)` three times in one click handler but it only increments by 1. Why, and how do you fix it?
Back: State updates are batched and `count` stays the stale value for the whole handler. Use the functional form `setCount(prev => prev + 1)` so each update sees the latest value.
<!--ID: 1782407009899-->
END

START
Basic
Why is `items.push("x"); setItems(items);` broken in React?
Back: It mutates the existing array, so the reference is unchanged and React skips the re-render. Pass a new array: `setItems(prev => [...prev, "x"])`.
<!--ID: 1782407009902-->
END

START
Basic
Right after `setName("Tyler")`, you `console.log(name)` and it still prints the old name. Is that a bug?
Back: No. Setters are asynchronous/batched; `name` only updates on the next render. The current render keeps the old value. Read the new value in the next render or via the updater function.
<!--ID: 1782407009906-->
END

START
Basic
You need state that's either a `User` object or `null`. Why does `useState(null)` type it wrong, and what's the fix?
Back: It infers the type as `null`, so you can't later set a User. Supply the generic: `useState<User | null>(null)`.
<!--ID: 1782407009909-->
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
