---
tags: [jquery, web-dev, events]
category: web-dev
related: [jquery-overview-and-selectors, jquery-dom-manipulation, jquery-traversal, dom-events, document-and-selectors]
---

## Description
`.on(eventName, handler)` is jQuery's general event binder — it attaches the same handler to **every element in the collection** at once (no loop). Older shorthands like `.click(fn)` and `.submit(fn)` are just thin wrappers around `.on('click', fn)`; prefer `.on()` in real code. The killer feature is **delegated events**: `$parent.on('click', '.child', handler)` binds **one** listener on the parent that fires only when the event bubbles up from a descendant matching `.child` — so it works for elements added to the DOM *later*, which a direct binding can't. Inside the handler, `this` is the raw DOM element that was matched, and the first arg is a normalized jQuery **event object** (`e.target`, `e.preventDefault()`, plus jQuery's `e.currentTarget`). Remove handlers with `.off()`. The vanilla parallel is `addEventListener`, but vanilla has **no built-in delegation** — you'd manually check `e.target.matches('.child')`.

## Examples
### `.on()` vs the `.click()` shorthand
```js
$('#save').on('click', function (e) {
  console.log('clicked', this);   // `this` = the raw DOM element
});
$('#save').click(fn);             // shorthand for .on('click', fn) — older style
// vanilla: document.querySelector('#save').addEventListener('click', fn);
```

### Delegated events — the reason jQuery events are still worth knowing
```js
// ONE listener on #list handles clicks on any current OR future .item:
$('#list').on('click', '.item', function (e) {
  $(this).toggleClass('selected'); // `this` is the .item that was clicked
});
// Direct binding would miss items added after this line ran.

// vanilla equivalent (manual delegation):
// document.querySelector('#list').addEventListener('click', (e) => {
//   const item = e.target.closest('.item');
//   if (item) item.classList.toggle('selected');
// });
```

### The event object + preventDefault
```js
$('form').on('submit', function (e) {
  e.preventDefault();             // normalized across browsers
  console.log(e.target, e.type);  // 'submit'
});
```

### Removing handlers
```js
$('#save').off('click');          // remove all click handlers
const onClick = () => {};
$('#save').on('click', onClick);
$('#save').off('click', onClick); // remove that specific handler (needs the same ref)
// vanilla: el.removeEventListener('click', onClick);
```

## Related Topics
- [[jquery-overview-and-selectors|jQuery Overview & Selectors]]
- [[jquery-dom-manipulation|jQuery DOM Manipulation]]
- [[jquery-traversal|jQuery Traversal]]
- [[dom-events|DOM Events (vanilla)]]

## Cards

```anki
START
Basic
You see `$('#list').on('click', '.item', handler)`. What does the `.item` argument do?
Back: It sets up **delegated** binding: one listener on `#list` that fires only when the event bubbles from a descendant matching `.item`. Works for `.item` elements added later, too.
<!--ID: 1782407010093-->
END

START
Basic
Why prefer `.on('click', fn)` over the `.click(fn)` shorthand?
Back: `.click()` is just a wrapper around `.on('click', ...)`. `.on()` is the general form that also supports delegation, namespaces, and multiple events — so it's the form real/modern jQuery uses.
<!--ID: 1782407010096-->
END

START
Basic
Inside a jQuery event handler `function(e){...}`, what is `this`?
Back: The **raw DOM element** the handler is bound to (the matched/delegated element). Wrap it with `$(this)` to call jQuery methods on it.
<!--ID: 1782407010099-->
END

START
Basic
What's the vanilla DOM gap that makes jQuery delegated events convenient?
Back: `addEventListener` has **no built-in delegation** — you must manually do `e.target.closest('.child')` and check it. jQuery bakes the selector filter into `.on()`.
<!--ID: 1782407010103-->
END

START
Basic
You bound a handler with `$('#x').on('click', onClick)`. Write how to remove exactly that handler.
Back: `$('#x').off('click', onClick);` — must pass the **same function reference**. (Vanilla: `removeEventListener('click', onClick)`.)
<!--ID: 1782407010106-->
END

START
Basic
Why can't a *direct* (non-delegated) binding handle dynamically added elements?
Back: A direct binding attaches the listener to the elements that exist **at bind time**. Elements added later never got the listener. Delegation binds on a stable ancestor instead, so it catches future descendants.
<!--ID: 1782407010110-->
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
