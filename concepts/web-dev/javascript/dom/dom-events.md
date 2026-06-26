---
tags: [dom, web-dev, javascript, events]
category: web-dev
related: [document-and-selectors, dom-manipulation, dom-traversal, dom-forms-inputs, jquery-overview-and-selectors, react-events-and-forms]
---

## Description
You react to user activity by registering callbacks with `element.addEventListener('click', handler)`. The handler receives an **event object** carrying details; two of its properties trip up newcomers: `event.target` is the **actual element that triggered** the event (where the click landed), while `event.currentTarget` is the element **whose listener is currently running** (the one you called `addEventListener` on). Events **propagate in three phases**: capture (root → target, listeners added with `{ capture: true }`), then the target, then **bubbling** (target → root, the default). Bubbling enables **event delegation** — attach one listener to a parent and inspect `event.target` (often via `.closest()`), instead of binding a listener per child; this is the idiomatic way to handle dynamic lists. `event.preventDefault()` cancels the browser's default action (e.g. form submit, link navigation); `event.stopPropagation()` halts further propagation. To remove a listener you must pass the **same function reference** to `removeEventListener` — an inline anonymous arrow can never be removed (Java contrast: there's no listener-object identity to detach unless you keep the reference).

## Examples

### Basic listener and the event object
```js
const btn = document.querySelector('#save');
function onClick(event) {
  console.log(event.type);        // 'click'
  console.log(event.target);      // element clicked
  event.currentTarget === btn;    // true — the element the listener is bound to
}
btn.addEventListener('click', onClick);
```

### target vs currentTarget
```html
<button id="card"><span>Buy</span></button>
```
```js
document.getElementById('card').addEventListener('click', (e) => {
  // Click the inner <span>:
  e.target;        // <span> — what was actually clicked
  e.currentTarget; // <button id="card"> — what the listener is on
});
```

### Event delegation (one listener for a dynamic list)
```js
document.querySelector('ul').addEventListener('click', (e) => {
  const li = e.target.closest('li');   // find the <li> ancestor of whatever was clicked
  if (!li) return;                     // clicked outside any <li>
  console.log('clicked item', li.dataset.id);
});
// New <li>s added later still work — no need to rebind.
```

### preventDefault and stopPropagation
```js
link.addEventListener('click', (e) => {
  e.preventDefault();   // stop the browser navigating to href
});
child.addEventListener('click', (e) => {
  e.stopPropagation();  // parent listeners won't fire for this event
});
```

### Capturing phase, and removing a listener
```js
parent.addEventListener('click', handler, { capture: true }); // fires on the way DOWN
parent.addEventListener('click', handler, { once: true });    // auto-removes after 1 call

function handler(e) { /* ... */ }
el.addEventListener('click', handler);
el.removeEventListener('click', handler); // works ONLY because handler is a named ref
// el.addEventListener('click', () => {}) can never be removed — no reference to it.
```

## Related Topics
- [[document-and-selectors|Document & Selectors]]
- [[dom-manipulation|DOM Manipulation]]
- [[dom-traversal|DOM Traversal]]
- [[dom-forms-inputs|DOM Forms & Inputs]]
- [[react-events-and-forms|React Events & Forms]]
- [[jquery-overview-and-selectors|jQuery Overview & Selectors]]

## Cards

```anki
START
Basic
Inside a click handler bound to a `<button>` containing a `<span>`, you click the span. What is `event.target` vs `event.currentTarget`?
Back: `event.target` is the `<span>` (what was actually clicked). `event.currentTarget` is the `<button>` (the element the listener is attached to).
<!--ID: 1782407009454-->
END

START
Basic
What is event delegation and why use it for a list whose items change?
Back: Attach ONE listener to the parent and use `event.target`/`.closest()` to identify the originating child. It relies on bubbling, so dynamically-added children work without rebinding listeners.
<!--ID: 1782407009459-->
END

START
Basic
Why can't you remove a listener added as `el.addEventListener('click', () => {...})`?
Back: `removeEventListener` matches by function reference. An inline anonymous arrow has no stored reference, so you can never pass the same function to remove it. Use a named function.
<!--ID: 1782407009463-->
END

START
Basic
Distinction: `event.preventDefault()` vs `event.stopPropagation()`.
Back: `preventDefault()` cancels the browser's default action (e.g. form submit, link navigation) but lets the event keep propagating. `stopPropagation()` stops the event reaching other elements but does not cancel the default action.
<!--ID: 1782407009467-->
END

START
Basic
By default, which propagation phase do listeners fire in, and how do you opt into the capture phase?
Back: By default the bubbling phase (target up to root). Pass `{ capture: true }` as the third arg to `addEventListener` to fire during the capture phase (root down to target).
<!--ID: 1782407009472-->
END

START
Basic
Write `addEventListener` so the handler runs at most once and auto-removes itself.
Back: `el.addEventListener('click', handler, { once: true });`
<!--ID: 1782407009475-->
END

START
Basic
In a delegated list handler, how do you map a click on any descendant back to its `<li>`?
Back: `const li = e.target.closest('li');` then guard `if (!li) return;`. `closest` walks up from the target to the nearest matching ancestor (or itself).
<!--ID: 1782407009479-->
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
