---
tags: [react, web-dev, hooks, dom]
category: web-dev
related: [usestate, useeffect, typing-the-dom, react-events-and-forms]
---

## Description
`useRef` returns a stable, mutable container object `{ current: ... }` that persists for the component's whole lifetime and is the **same object on every render**. It has two uses. (1) A **DOM ref**: attach it via the `ref` attribute and after render `ref.current` holds the actual DOM node, so you can call `.focus()`, measure it, etc. (2) A **mutable instance variable**: store any value that should survive re-renders but should *not* trigger one when changed — a timer id, a previous value, a "did this already run" flag. The key distinction from state: **changing `ref.current` does NOT cause a re-render**, and it's not batched or async — the new value is visible immediately. Conversely, never read/write `ref.current` *during* render to derive output (that's what state/props are for); use it in event handlers and effects.

## Examples

### DOM ref: focus an input
```tsx
function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null); // null until mounted
  useEffect(() => {
    inputRef.current?.focus(); // .current is the real <input> after mount
  }, []);
  return <input ref={inputRef} />;
}
```

### Mutable value that doesn't re-render (timer id)
```tsx
function Timer() {
  const intervalId = useRef<number | null>(null);
  const start = () => {
    intervalId.current = window.setInterval(() => console.log("tick"), 1000);
    // reassigning .current does NOT trigger a render — exactly what we want here
  };
  const stop = () => {
    if (intervalId.current !== null) clearInterval(intervalId.current);
  };
  return <><button onClick={start}>Start</button><button onClick={stop}>Stop</button></>;
}
```

## Related Topics
- [[usestate|useState]]
- [[useeffect|useEffect]]
- [[typing-the-dom|Typing the DOM]]
- [[react-events-and-forms|React Events & Forms]]

## Cards

```anki
START
Basic
What does `useRef(initial)` return, and what's the one property you read/write?
Back: A stable object `{ current: initial }` that's identical across all renders. You read and mutate `ref.current`.
<!--ID: 1782407009913-->
END

START
Basic
The core distinction: what happens to rendering when you change `ref.current` vs when you call a `useState` setter?
Back: Changing `ref.current` does NOT cause a re-render (and is applied immediately/synchronously). A state setter schedules a re-render (and is batched/async).
<!--ID: 1782407009916-->
END

START
Basic
How do you grab the actual DOM element for an `<input>` so you can call `.focus()`?
Back: `const ref = useRef<HTMLInputElement>(null)`, put `ref={ref}` on the input, then after mount (in an effect/handler) call `ref.current?.focus()`.
<!--ID: 1782407009919-->
END

START
Basic
Why initialize a DOM ref with `null` and type it `useRef<HTMLInputElement>(null)`?
Back: The element doesn't exist until React mounts it, so `current` starts null. The generic types `current` as `HTMLInputElement | null`, forcing you to null-check (e.g. `?.`).
<!--ID: 1782407009923-->
END

START
Basic
When should you use a ref instead of state to hold a value (e.g. a timer id or previous value)?
Back: When the value must persist across renders but changing it should NOT re-render the UI. State is for values that affect output; refs are for "behind the scenes" mutable data.
<!--ID: 1782407009926-->
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
