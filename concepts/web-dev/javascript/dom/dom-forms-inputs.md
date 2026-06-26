---
tags: [dom, web-dev, javascript, forms]
category: web-dev
related: [document-and-selectors, dom-manipulation, dom-events, dom-traversal, jquery-overview-and-selectors, react-events-and-forms]
---

## Description
Form controls expose their state as element properties, and these are the canonical accessors — not attributes. A text `<input>`/`<textarea>`/`<select>` reflects its current value in `.value` (**always a string**, even for `type="number"` — convert with `Number(...)`), checkboxes/radios use the boolean `.checked` (not `.value`), and a `<select>` also gives you `.value` (the chosen option). The form-wide gotcha: a real `<form>` **submit reloads the page by default**, so you listen for the `submit` event and call `event.preventDefault()` to handle it in JS. `FormData` reads every named control at once (`new FormData(formEl)`), giving an iterable of `[name, value]` pairs ready to POST. Finally, two distinct change events: `input` fires on **every keystroke / immediate value change** (live), while `change` fires only when the value is **committed** — on blur for text fields, but immediately for checkboxes and `<select>`.

## Examples

### Reading and setting values
```js
const name = document.querySelector('#name');
name.value;                 // current text (string)
name.value = 'Tyler';       // set it

const age = document.querySelector('#age'); // <input type="number">
const n = Number(age.value); // .value is STILL a string; convert explicitly

const agree = document.querySelector('#agree'); // checkbox
agree.checked;              // boolean — use this, not .value
agree.checked = true;

const sel = document.querySelector('#country'); // <select>
sel.value;                  // value of the selected <option>
```

### Submit handling with preventDefault + FormData
```html
<form id="signup">
  <input name="email" />
  <input name="password" type="password" />
  <button type="submit">Go</button>
</form>
```
```js
const form = document.getElementById('signup');
form.addEventListener('submit', (e) => {
  e.preventDefault();              // stop the full-page reload
  const data = new FormData(form); // reads all NAMED controls
  data.get('email');               // single value by name
  const obj = Object.fromEntries(data); // {email: '...', password: '...'}
  // fetch('/api/signup', { method: 'POST', body: data })
});
```

### input vs change
```js
search.addEventListener('input',  () => console.log('every keystroke'));
search.addEventListener('change', () => console.log('on blur / commit'));

checkbox.addEventListener('change', (e) => console.log(e.target.checked));
selectEl.addEventListener('change', (e) => console.log(e.target.value));
```

## Related Topics
- [[document-and-selectors|Document & Selectors]]
- [[dom-manipulation|DOM Manipulation]]
- [[dom-events|DOM Events]]
- [[dom-traversal|DOM Traversal]]
- [[react-events-and-forms|React Events & Forms]]
- [[jquery-overview-and-selectors|jQuery Overview & Selectors]]

## Cards

```anki
START
Basic
Gotcha: you read `.value` from an `<input type="number">`. What type do you get, and what must you do?
Back: A string, always. Convert explicitly with `Number(input.value)` (or `parseInt`/`parseFloat`) before doing math.
<!--ID: 1782407009423-->
END

START
Basic
How do you read whether a checkbox is ticked, and why not use `.value`?
Back: Use the boolean `input.checked`. `.value` on a checkbox is just its `value` attribute (default `"on"`), not whether it's selected.
<!--ID: 1782407009427-->
END

START
Basic
Why do you call `event.preventDefault()` in a form `submit` handler?
Back: A `<form>` submit triggers a full-page navigation/reload by default. `preventDefault()` cancels that so you can handle the data in JS (e.g. fetch).
<!--ID: 1782407009432-->
END

START
Basic
Distinction: the `input` event vs the `change` event on a text field.
Back: `input` fires on every keystroke / immediate value change (live). `change` fires only when the value is committed — for text that's on blur (focus leaves the field).
<!--ID: 1782407009436-->
END

START
Basic
Write the code to collect all named fields of `form` and turn them into a plain object.
Back: `const data = new FormData(form); const obj = Object.fromEntries(data);`
<!--ID: 1782407009440-->
END

START
Basic
You construct `new FormData(formEl)` — which controls does it include?
Back: Every form control that has a `name` attribute (and is not disabled). Unnamed controls are omitted. Access values with `data.get('field')`.
<!--ID: 1782407009445-->
END

START
Basic
For a checkbox or `<select>`, when does the `change` event fire compared to a text input?
Back: Immediately on toggle/selection (no blur needed), unlike text fields where `change` waits for blur/commit.
<!--ID: 1782407009449-->
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
