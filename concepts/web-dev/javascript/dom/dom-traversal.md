---
tags: [dom, web-dev, javascript]
category: web-dev
related: [document-and-selectors, dom-manipulation, dom-events, dom-forms-inputs, jquery-overview-and-selectors]
---

## Description
Once you hold a node you can walk the tree relative to it instead of re-querying the whole document. The crucial JS gotcha: most properties come in an **"...Node" form that counts text/whitespace/comment nodes** and an **"...Element" form that skips them** — almost always you want the Element form. So prefer `parentElement`, `children` (an `HTMLCollection` of element children), `firstElementChild`/`lastElementChild`, and `nextElementSibling`/`previousElementSibling` over `parentNode`, `childNodes` (a `NodeList` including whitespace text nodes), `firstChild`, and `nextSibling`. `element.closest(selector)` walks **up** from the element (including itself) to the nearest ancestor matching a CSS selector — the workhorse of event delegation. `element.matches(selector)` returns a boolean: does this element match the selector? (no DOM movement, just a test).

## Examples

### Element-aware vs node-aware traversal
```js
li.parentElement;          // the parent element
li.children;               // HTMLCollection of element children (no text nodes)
li.childNodes;             // NodeList incl. whitespace TEXT nodes — usually NOT what you want
ul.firstElementChild;      // first child element
ul.lastElementChild;       // last child element
li.nextElementSibling;     // next sibling element (skips whitespace)
li.previousElementSibling; // previous sibling element
```

### Why the Element form matters
```html
<ul>
  <li>one</li>
</ul>
```
```js
const ul = document.querySelector('ul');
ul.firstChild;        // a TEXT node — the newline/indentation before <li>!
ul.firstElementChild; // the <li> — what you actually wanted
```

### closest() — walk up to a matching ancestor
```js
btn.closest('.card');        // nearest ancestor (or self) matching .card, else null
e.target.closest('li');      // canonical event-delegation pattern
```

### matches() — test, don't move
```js
if (el.matches('a.external')) {
  // el is an <a> with class 'external'
}
// Useful inside delegation to branch by what was clicked:
if (e.target.matches('button.delete')) { /* ... */ }
```

## Related Topics
- [[document-and-selectors|Document & Selectors]]
- [[dom-manipulation|DOM Manipulation]]
- [[dom-events|DOM Events]]
- [[dom-forms-inputs|DOM Forms & Inputs]]
- [[jquery-overview-and-selectors|jQuery Overview & Selectors]]

## Cards

```anki
START
Basic
Gotcha: why does `ul.firstChild` often return something unexpected, and what should you use instead?
Back: `firstChild` includes text nodes, so it usually returns a whitespace/newline TEXT node from indentation. Use `firstElementChild` to get the first element.
<!--ID: 1782407009483-->
END

START
Basic
Distinction: `parentNode`/`childNodes` vs `parentElement`/`children` — what's the difference and which do you usually want?
Back: The `...Node` forms include text/comment nodes; the `...Element` forms include only elements. You almost always want the Element forms (`parentElement`, `children`).
<!--ID: 1782407009487-->
END

START
Basic
What does `el.closest('.card')` do and what does it return when nothing matches?
Back: Walks UP from `el` (including `el` itself) to the nearest ancestor matching the CSS selector. Returns that element, or `null` if none matches.
<!--ID: 1782407009491-->
END

START
Basic
You see `if (e.target.matches('button.delete'))`. What does `matches` do?
Back: Returns a boolean — does this element match the given CSS selector? It tests the element in place; it does not move through the DOM.
<!--ID: 1782407009495-->
END

START
Basic
Write the property access to get the next sibling ELEMENT of `row` (skipping whitespace).
Back: `row.nextElementSibling` (not `nextSibling`, which would include text nodes).
<!--ID: 1782407009499-->
END

START
Basic
In event delegation, why is `closest()` preferred over checking `e.target` directly?
Back: The click may land on a descendant of the element you care about; `e.target.closest('li')` finds the intended `<li>` regardless of which inner node was clicked.
<!--ID: 1782407009504-->
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
