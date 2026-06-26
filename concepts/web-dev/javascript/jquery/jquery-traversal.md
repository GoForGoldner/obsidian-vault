---
tags: [jquery, web-dev, dom, traversal]
category: web-dev
related: [jquery-overview-and-selectors, jquery-dom-manipulation, jquery-events, document-and-selectors, dom-manipulation]
---

## Description
Traversal methods take your current collection and return a **new collection** of related elements, so they chain like everything else. Walk **down** with `.find(sel)` (any descendant) and `.children(sel)` (direct children only); walk **up** with `.parent()` (immediate parent), `.parents(sel)` (all ancestors), and `.closest(sel)` (nearest *self-or-ancestor* matching — the one you reach for in event handlers). Move **sideways** with `.siblings(sel)`. Narrow a set with `.filter(sel)`, or pick by position with `.eq(i)`, `.first()`, `.last()`. To loop a collection use `.each(callback)` — and here's the gotcha that bites Java/JS devs coming from `Array.forEach`: jQuery's callback is **`(index, element)`**, index **first**, and `element` is a **raw DOM node** (wrap with `$(this)` or `$(el)`). `this` inside `.each` is also the raw element. Native array methods like `.map`/`.forEach` are not on jQuery collections; use `.each` or `$.map`.

## Examples
### Down, up, sideways
```js
const $row = $('#row-5');
$row.find('.cell');       // ALL descendant .cell (any depth)
$row.children('.cell');   // only DIRECT child .cell
$row.parent();            // immediate parent
$row.parents('.table');   // every ancestor matching .table
$row.closest('.table');   // nearest self-or-ancestor matching .table (stops at first)
$row.siblings();          // all sibling elements
// vanilla: el.querySelectorAll / el.children / el.parentElement / el.closest('.table')
```

### `.closest` is the event-handler workhorse
```js
$('#list').on('click', '.delete-btn', function () {
  $(this).closest('.item').remove();  // walk up to the row, delete it
});
// vanilla: e.target.closest('.item')
```

### Narrowing & positional picks
```js
$('li').filter('.active');  // keep only matching ones (selector OR predicate fn)
$('li').eq(2);              // the 3rd element as a jQuery object (0-based)
$('li').first();            // === .eq(0)
$('li').last();
```

### `.each` and the (index, el) gotcha
```js
$('li').each(function (index, el) {   // NOTE: index FIRST, then raw element
  console.log(index, el.textContent); // `this` === el (raw DOM node)
  $(el).addClass('seen');             // wrap to use jQuery methods
});
// Contrast Array.forEach: arr.forEach((el, index) => ...)  // element FIRST
```

## Related Topics
- [[jquery-overview-and-selectors|jQuery Overview & Selectors]]
- [[jquery-dom-manipulation|jQuery DOM Manipulation]]
- [[jquery-events|jQuery Events]]
- [[document-and-selectors|Document & Selectors (vanilla DOM)]]

## Cards

```anki
START
Basic
Distinction: when do you use `.find()` vs `.children()` on a jQuery collection?
Back: `.find(sel)` matches **any descendant** at any depth. `.children(sel)` matches only **direct children**. Both return new collections.
<!--ID: 1782407010132-->
END

START
Basic
In a delete-button click handler, how do you walk up to the enclosing `.item` row to remove it?
Back: `$(this).closest('.item').remove();` — `.closest` finds the nearest **self-or-ancestor** matching the selector. (Vanilla: `e.target.closest('.item')`.)
<!--ID: 1782407010135-->
END

START
Basic
Gotcha: what is the callback signature of jQuery's `.each()`, and how does it differ from `Array.forEach`?
Back: jQuery: `(index, element)` — **index first**, and `element` is a **raw DOM node**. `Array.forEach` is `(element, index)` — element first. Easy to mix up.
<!--ID: 1782407010138-->
END

START
Basic
Inside `$('li').each(function(i, el){...})`, what is `this` and how do you call jQuery methods on the current item?
Back: `this` is the **raw DOM element** (same as `el`). Wrap it: `$(this)` or `$(el)` to use jQuery methods like `.addClass()`.
<!--ID: 1782407010141-->
END

START
Basic
What's the difference between `.parent()`, `.parents('.x')`, and `.closest('.x')`?
Back: `.parent()` = immediate parent only. `.parents('.x')` = **all** ancestors matching `.x`. `.closest('.x')` = the **single nearest** self-or-ancestor matching `.x`.
<!--ID: 1782407010145-->
END

START
Basic
You have `$('li')` and want just the 3rd one as a jQuery object. Write it.
Back: `$('li').eq(2)` (0-based; returns a jQuery collection). `.first()` is `.eq(0)`, `.last()` is the final one. Note: `$('li')[2]` would give the **raw** element instead.
<!--ID: 1782407010147-->
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
