---
tags: [jquery, web-dev, dom, selectors]
category: web-dev
related: [jquery-dom-manipulation, jquery-events, jquery-traversal, jquery-ajax, document-and-selectors, dom-manipulation]
---

## Description
jQuery is a library that wraps the browser DOM in a single global function, `$` (an alias for `jQuery`). `$('.x')` runs a **CSS selector** against the document and returns a **jQuery object** — an array-like *collection* of matched elements, never a single element, even when one matched. This is the #1 mental-model shift: every method you call (`.text()`, `.css()`, `.on()`) operates on the **whole set** and returns the set again, so calls **chain**. It's roughly `querySelectorAll` + wrapper methods + automatic looping. It exists because pre-2015 the native DOM API was verbose and browser-inconsistent; modern browsers closed that gap, so jQuery is now mostly **legacy**. Convention: store jQuery collections in variables prefixed `$` (`const $btn = $('#save')`) to signal "this is a jQuery object, not a raw element."

## Examples
### `$` is a function; selecting returns a collection
```js
const $items = $('.item');        // jQuery collection of ALL .item elements
// vanilla: const items = document.querySelectorAll('.item');  // NodeList

$items.length;                    // count, like a NodeList's .length
$('#save');                       // by id — still a collection (0 or 1 elements)
// vanilla: document.querySelector('#save')  // returns ONE element or null

$('ul > li.active');              // any CSS selector works
// vanilla: document.querySelectorAll('ul > li.active')
```

### Methods auto-loop over the whole set + chaining
```js
// One call hides EVERY matched element — no manual loop:
$('.error').addClass('seen').hide();   // returns the same collection, so it chains
// vanilla needs a loop:
// document.querySelectorAll('.error').forEach(el => {
//   el.classList.add('seen'); el.style.display = 'none';
// });
```

### Run code after the DOM is parsed
```js
// Modern, concise form — callback runs once the DOM tree is ready:
$(function () {
  $('#app').text('ready');
});
// $(document).ready(fn) is the older spelling of the exact same thing.
// vanilla: document.addEventListener('DOMContentLoaded', () => { ... });
```

### Getting a raw DOM element back out
```js
const $btn = $('#save');
const el = $btn[0];        // index into the collection -> raw HTMLElement
// or: $btn.get(0);  — .get() also accepts negative indexes
$(el);                     // wrap a raw element back into jQuery
```

## Related Topics
- [[jquery-dom-manipulation|jQuery DOM Manipulation]]
- [[jquery-events|jQuery Events]]
- [[jquery-traversal|jQuery Traversal]]
- [[jquery-ajax|jQuery Ajax]]
- [[document-and-selectors|Document & Selectors (vanilla DOM)]]

## Cards

```anki
START
Basic
You write `$('#save')` and `#save` matches exactly one element. Is the result a single element or something else?
Back: A **jQuery collection** (array-like), not the element. It holds 0 or 1 elements. Use `$('#save')[0]` or `.get(0)` to get the raw DOM element.
<!--ID: 1782407010113-->
END

START
Basic
What is the relationship between `$`, `jQuery`, and `document.querySelectorAll`?
Back: `$` is just an alias for the `jQuery` function. `$(selector)` is like `querySelectorAll` (CSS-selector based, returns a collection) but adds wrapper methods that auto-loop over the set.
<!--ID: 1782407010116-->
END

START
Basic
Why can you write `$('.error').addClass('seen').hide()` as one chain?
Back: jQuery methods operate on the whole collection and **return the same collection**, so each call feeds the next. (vanilla would need an explicit forEach loop.)
<!--ID: 1782407010119-->
END

START
Basic
Write the modern concise jQuery idiom to run code once the DOM is ready.
Back: `$(function () { ... });` (shorthand for `$(document).ready(fn)`). Vanilla equivalent: `document.addEventListener('DOMContentLoaded', fn)`.
<!--ID: 1782407010122-->
END

START
Basic
What does the `$` prefix on a variable name like `$btn` conventionally signal?
Back: That the variable holds a **jQuery object** (a wrapped collection), not a raw DOM element. Pure convention, no language meaning.
<!--ID: 1782407010125-->
END

START
Basic
A jQuery selector matched nothing. What does `$('.nope')` return and how do you detect "no match"?
Back: An **empty collection** (never null). Check `$('.nope').length === 0`. (Contrast: `document.querySelector` returns `null` on no match.)
<!--ID: 1782407010129-->
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
