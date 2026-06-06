---
tags: [css, web-dev, comparison]
category: vs
related: [flexbox, css-grid]
---

## Description
Both lay out children, but they think differently. **Flexbox is one-dimensional and content-first**: you place items along a single axis and they size themselves from their content outward — great for navbars, toolbars, and rows that wrap. **Grid is two-dimensional and layout-first**: you define the row/column structure up front and drop content into it — great for page skeletons and dashboards. They compose well: grid for the macro layout, flex for aligning items inside each cell.

## Examples
```css
/* Flexbox — distribute a row of items (1D, content-first) */
.toolbar { display: flex; justify-content: space-between; align-items: center; }

/* Grid — define a 2D page skeleton (layout-first) */
.page {
  display: grid;
  grid-template-columns: 240px 1fr;   /* sidebar + main */
  grid-template-rows: auto 1fr auto;  /* header / body / footer */
}
```

## Related Topics
- [[flexbox|Flexbox]]
- [[css-grid|CSS Grid]]
- 1D vs 2D layout
- Content-first vs layout-first

## Cards

```anki
START
Basic
When do you reach for flexbox over grid, and vice versa?
Back: Flexbox for **1D** flows — a single row/column of items, distributing space along one axis (navbars, button groups). Grid for **2D** structure where rows *and* columns must align (page layouts, dashboards, galleries).
<!--ID: 1780758285771-->
END

START
Basic
What does "content-first" (flexbox) vs "layout-first" (grid) mean?
Back: Flexbox sizes the track from the items' content outward — content drives the layout. Grid defines the row/column structure first, then content flows into the cells — the layout drives the content.
<!--ID: 1780758285777-->
END

START
Basic
Can flexbox and grid be used together, and what's the common division of labor?
Back: Yes, frequently. Use Grid for the overall page skeleton (rows + columns), and Flexbox inside individual cells/components to align their contents.
<!--ID: 1780758285784-->
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
