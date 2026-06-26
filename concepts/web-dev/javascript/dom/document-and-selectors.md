---
tags: [dom, web-dev, javascript]
category: web-dev
related: [dom-manipulation, dom-events, dom-traversal, dom-forms-inputs, jquery-overview-and-selectors]
---

## Description
The **DOM** (Document Object Model) is the browser's live, tree-shaped object representation of the parsed HTML. `document` is the global root object you query to find elements; mutating DOM nodes re-renders the page. You find elements with `document.getElementById('x')` (fast, returns one element or `null`) or the general-purpose `querySelector`/`querySelectorAll`, which take **CSS selector strings** (`'#id'`, `'.class'`, `'div > a'`). The Java-relevant gotcha: selector methods return a `NodeList` or `HTMLCollection`, **not an array** — these are array-*like* (have `.length`, are indexable, iterable with `for...of`) but lack `.map`/`.filter`/`.reduce`, so you convert with `[...nodeList]` or `Array.from(...)` before using array methods. A second trap: `getElementsByClassName`/`getElementsByTagName` return a **live** `HTMLCollection` that updates as the DOM changes, while `querySelectorAll` returns a **static** snapshot `NodeList`.

## Examples

### Selecting elements
```js
const header = document.getElementById('main-header'); // one element or null
const firstBtn = document.querySelector('.btn');        // first match or null
const allBtns = document.querySelectorAll('.btn');      // static NodeList (all matches)
const nested = document.querySelector('nav ul > li.active a'); // full CSS selector
```

### NodeList is not an array
```js
const items = document.querySelectorAll('li');
items.map(...);                       // TypeError: items.map is not a function
[...items].map(li => li.textContent); // ok — spread to a real array
Array.from(items, li => li.textContent); // Array.from also takes a map fn

// NodeList DOES support forEach + for...of without converting:
items.forEach(li => console.log(li));
for (const li of items) console.log(li);
```

### Live HTMLCollection vs static NodeList
```js
const live = document.getElementsByClassName('row'); // HTMLCollection, live
const snap = document.querySelectorAll('.row');       // NodeList, static
document.body.append(document.createElement('div')); // (if it had class 'row')
// live.length would reflect the new element; snap.length would not.
```

### Scoping a query to an element
```js
const card = document.querySelector('.card');
const title = card.querySelector('h2'); // searches WITHIN card, not whole doc
```

## Related Topics
- [[dom-manipulation|DOM Manipulation]]
- [[dom-events|DOM Events]]
- [[dom-traversal|DOM Traversal]]
- [[dom-forms-inputs|DOM Forms & Inputs]]
- [[jquery-overview-and-selectors|jQuery Overview & Selectors]]

## Cards

```anki
START
Basic
What does `document.querySelector('.btn')` return when no element matches, and how does that differ from `querySelectorAll`?
Back: `querySelector` returns `null` for no match; `querySelectorAll` returns an empty `NodeList` (length 0), never null.
<!--ID: 1782407009386-->
END

START
Basic
You have `const items = document.querySelectorAll('li')` and call `items.map(...)`. Why does it throw, and how do you fix it?
Back: A `NodeList` is array-like but has no `.map`. Convert first: `[...items].map(...)` or `Array.from(items, fn)`.
<!--ID: 1782407009390-->
END

START
Basic
When do you reach for `getElementById` over `querySelector`?
Back: When selecting by id and you want the most direct/fast call. `getElementById('x')` vs `querySelector('#x')` — same result, getElementById is marginally faster and reads clearer.
<!--ID: 1782407009394-->
END

START
Basic
Distinction: `getElementsByClassName(...)` vs `querySelectorAll(...)` — what's the live-vs-static difference?
Back: `getElementsByClassName` returns a LIVE `HTMLCollection` that auto-updates as the DOM changes. `querySelectorAll` returns a STATIC `NodeList` snapshot taken at call time.
<!--ID: 1782407009399-->
END

START
Basic
Write the call to find the first `<a>` inside an element already stored in `card` (not the whole document).
Back: `card.querySelector('a')` — querySelector/All exist on every element and scope the search to that subtree.
<!--ID: 1782407009403-->
END

START
Basic
What kind of argument do `querySelector`/`querySelectorAll` take?
Back: A CSS selector string, e.g. `'#id'`, `'.cls'`, `'ul > li.active'`, `'[data-x]'`. Same syntax as CSS rules.
<!--ID: 1782407009415-->
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
