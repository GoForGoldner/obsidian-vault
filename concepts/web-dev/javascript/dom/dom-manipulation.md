---
tags: [dom, web-dev, javascript]
category: web-dev
related: [document-and-selectors, dom-events, dom-traversal, dom-forms-inputs, jquery-overview-and-selectors]
---

## Description
Once you have an element, you build and mutate the tree imperatively: `document.createElement('div')` makes a detached node, then `parent.appendChild(child)` (or the newer `parent.append(...)`/`prepend(...)`) inserts it; `element.remove()` deletes it. Read/write text with `textContent` (plain text, **safe**) versus `innerHTML` (parses an HTML string — convenient but the classic **XSS hole** if you inject untrusted input). Attributes go through `setAttribute`/`getAttribute`, classes through the ergonomic `classList` API (`add`/`remove`/`toggle`/`contains`) rather than string-munging `className`, inline styles through the `style` object, and `data-*` attributes through `dataset`. Key JS-isms: `append` accepts multiple nodes **and** strings and returns nothing, whereas `appendChild` takes exactly one node and returns it; `classList.toggle('x')` returns the resulting boolean; and `dataset.userId` maps to the attribute `data-user-id` (kebab ⇄ camelCase conversion is automatic).

## Examples

### Create and insert
```js
const li = document.createElement('li');
li.textContent = 'New item';        // sets text, escapes automatically
const ul = document.querySelector('ul');
ul.append(li);                       // append: 1+ nodes/strings, returns undefined
ul.prepend('First!', anotherNode);   // insert at the start
li.remove();                         // delete from the tree
```

### textContent vs innerHTML (the XSS gotcha)
```js
el.textContent = userInput; // SAFE: '<img src=x onerror=alert(1)>' shown as literal text
el.innerHTML  = userInput;  // DANGER: parses & runs injected HTML/handlers
el.innerHTML  = '<strong>Trusted, static markup</strong>'; // fine for hardcoded HTML
```

### Attributes vs classList vs style vs dataset
```js
el.setAttribute('aria-hidden', 'true');
el.getAttribute('href');             // string or null

el.classList.add('active', 'big');
el.classList.remove('big');
el.classList.toggle('open');         // returns true if now present
el.classList.contains('active');     // boolean

el.style.backgroundColor = 'tomato'; // camelCase: background-color -> backgroundColor

el.dataset.userId = '42';            // writes attribute data-user-id="42"
const id = el.dataset.userId;        // reads it back (always a string)
```

### append vs appendChild
```js
parent.appendChild(node);            // one Node only, returns the node
parent.append(node1, node2, 'text'); // many nodes + strings, returns undefined
```

## Related Topics
- [[document-and-selectors|Document & Selectors]]
- [[dom-events|DOM Events]]
- [[dom-traversal|DOM Traversal]]
- [[dom-forms-inputs|DOM Forms & Inputs]]
- [[jquery-overview-and-selectors|jQuery Overview & Selectors]]

## Cards

```anki
START
Basic
What is the security risk of `el.innerHTML = userInput`, and what should you use instead for plain text?
Back: `innerHTML` parses the string as HTML, so untrusted input can inject scripts/handlers (XSS). Use `el.textContent = userInput`, which inserts it as literal text.
<!--ID: 1782407009508-->
END

START
Basic
Distinction: `parent.append(x)` vs `parent.appendChild(x)` — name two differences.
Back: `append` takes multiple nodes AND strings and returns undefined; `appendChild` takes exactly one Node and returns that node.
<!--ID: 1782407009512-->
END

START
Basic
You want to flip a CSS class on/off based on its current presence. Which `classList` method, and what does it return?
Back: `el.classList.toggle('open')` — adds the class if absent, removes it if present, and returns a boolean (true if the class is now present).
<!--ID: 1782407009515-->
END

START
Basic
You wrote `data-user-id="42"` in HTML. How do you read it in JS via `dataset`?
Back: `el.dataset.userId` — `data-*` attributes are exposed on `dataset` with the suffix camelCased (and the value is always a string).
<!--ID: 1782407009520-->
END

START
Basic
Write the JS to set the inline CSS property `background-color` to `red` on `el`.
Back: `el.style.backgroundColor = 'red';` — `style` uses camelCased property names, values are strings.
<!--ID: 1782407009524-->
END

START
Basic
How do you create a detached `<li>` with text "Hi" and add it as the last child of `ul`?
Back: `const li = document.createElement('li'); li.textContent = 'Hi'; ul.append(li);`
<!--ID: 1782407009529-->
END

START
Basic
When is `innerHTML` actually fine to use?
Back: When the HTML string is static/trusted (hardcoded markup you control), not built from user input. The risk is interpolating untrusted data.
<!--ID: 1782407009533-->
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
