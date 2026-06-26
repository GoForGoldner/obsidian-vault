---
tags: [jquery, web-dev, dom, manipulation]
category: web-dev
related: [jquery-overview-and-selectors, jquery-events, jquery-traversal, dom-manipulation, document-and-selectors]
---

## Description
jQuery's manipulation methods are **overloaded as getter/setter**: call with **no argument** to read, call **with an argument** to write the whole set. `.text(x)`/`.html(x)` write content (text-only vs raw HTML); `.val()` reads/writes form-field values; `.css(prop, val)` reads/writes inline styles. The sharpest gotcha is **`.attr()` vs `.prop()`**: `.attr()` reads the HTML *attribute* (the initial markup string), while `.prop()` reads the live DOM *property* (the current state). For things like a checkbox's checked-ness or an input's current value, you want `.prop('checked')`, not `.attr('checked')`. Class helpers (`addClass`/`removeClass`/`toggleClass`/`hasClass`) map directly onto the native `classList`. Insertion methods (`append`/`prepend`/`before`/`after`) add nodes; `.remove()` detaches them. **Getter calls return a plain value (a string/boolean), which breaks the chain** — only setter calls return the collection.

## Examples
### Getter vs setter overloading
```js
const $h = $('#title');
$h.text();          // GETTER -> returns the string, chain ends here
$h.text('Hello');   // SETTER -> sets text on all matched, returns collection (chains)

// .text() escapes; .html() does NOT (XSS risk with untrusted input)
$h.html('<em>Hi</em>');
// vanilla: el.textContent = 'Hello';  /  el.innerHTML = '<em>Hi</em>';
```

### `.val()` for form fields
```js
const name = $('#name').val();   // read input/select/textarea value
$('#name').val('');              // clear it
// vanilla: const name = document.querySelector('#name').value;
```

### `.attr()` vs `.prop()` — the key distinction
```js
const $cb = $('#agree');         // <input type="checkbox" checked>
$cb.attr('checked');   // "checked"  — the ORIGINAL HTML attribute (rarely what you want)
$cb.prop('checked');   // true/false — the LIVE checked state (what you want)
$cb.prop('checked', false);      // set the live state
// vanilla: el.getAttribute('checked')  vs  el.checked
```

### Classes and inline CSS
```js
$('.box')
  .addClass('active')
  .removeClass('hidden')
  .toggleClass('open');          // add if absent, remove if present
$('.box').hasClass('active');    // boolean (getter — ends chain)
$('.box').css('color', 'red');   // setter; .css('color') reads computed value
// vanilla: el.classList.add/remove/toggle/contains; el.style.color = 'red'
```

### Insert and remove
```js
$('#list').append('<li>last</li>');    // inside, at end
$('#list').prepend('<li>first</li>');  // inside, at start
$('#old').remove();                    // detach element + its handlers
// vanilla: el.append(node) / el.prepend(node) / el.remove()
```

## Related Topics
- [[jquery-overview-and-selectors|jQuery Overview & Selectors]]
- [[jquery-traversal|jQuery Traversal]]
- [[jquery-events|jQuery Events]]
- [[dom-manipulation|DOM Manipulation (vanilla)]]

## Cards

```anki
START
Basic
What's the difference between calling `$el.text()` and `$el.text('hi')`?
Back: No argument = **getter** (returns the string, ends the chain). With an argument = **setter** (writes to every matched element, returns the collection so it chains).
<!--ID: 1782407010073-->
END

START
Basic
You need a checkbox's current checked state in jQuery. Do you use `.attr('checked')` or `.prop('checked')`, and why?
Back: `.prop('checked')` — it reads the **live DOM property** (true/false). `.attr('checked')` reads the original HTML attribute string and won't reflect user changes.
<!--ID: 1782407010077-->
END

START
Basic
When does `.html()` bite you compared to `.text()`?
Back: `.html()` inserts raw HTML and does **not** escape — passing untrusted input is an XSS risk. `.text()` escapes and is safe for plain text.
<!--ID: 1782407010080-->
END

START
Basic
Write the jQuery to read the value of `<input id="name">` and then clear it.
Back: `const v = $('#name').val(); $('#name').val('');` Vanilla: `el.value`.
<!--ID: 1782407010083-->
END

START
Basic
Map these jQuery class methods to their vanilla `classList` equivalents: addClass, removeClass, toggleClass, hasClass.
Back: `classList.add`, `classList.remove`, `classList.toggle`, `classList.contains`. `hasClass` is a getter (returns boolean, ends the chain).
<!--ID: 1782407010086-->
END

START
Basic
Why does `.remove()` differ from just emptying an element's HTML?
Back: `.remove()` detaches the element from the DOM **and tears down its jQuery event handlers/data**, avoiding leaks. (`.empty()` clears children but keeps the element.)
<!--ID: 1782407010089-->
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
