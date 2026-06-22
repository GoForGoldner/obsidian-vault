---
tags: [css, web-dev, layout]
category: web-dev
related: [flexbox, centering, css-units, flexbox-vs-grid]
---

## Description
CSS Grid is a **two-dimensional** layout model: it controls rows *and* columns at the same time. You set `display: grid` on the container and define tracks with `grid-template-columns` / `grid-template-rows`. The `fr` unit splits the leftover free space into fractions. Grid is "layout-first" — you draw the structure, then drop content into it — which makes it ideal for page skeletons, dashboards, and card galleries.

## Examples
```css
/* Three equal columns with a gap */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* Responsive: as many >=200px columns as fit, then wrap */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

/* Make one item span two columns */
.feature { grid-column: span 2; }
```

## Related Topics
- [[flexbox|Flexbox]]
- [[css-units|CSS Units (fr)]]
- [[centering|Centering]]
- [[flexbox-vs-grid|Flexbox vs Grid]]
- minmax / auto-fit / auto-fill

## Cards

```anki
START
Basic
You need rows and columns that line up with each other — a true grid like a dashboard or photo wall. Which layout system, and why not flexbox?
Back: CSS Grid — it's two-dimensional. Flexbox only handles one axis at a time, so aligning across both rows and columns fights the model.
<!--ID: 1780758285002-->
END

START
Basic
Write the CSS for a container with three equal-width columns separated by 16px gaps.
Back: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;`
<!--ID: 1780758285009-->
END

START
Basic
Write the CSS for a responsive gallery: as many columns as fit at a minimum of 200px each, each stretching to fill, wrapping otherwise.
Back: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));`
<!--ID: 1780758285024-->
END

START
Basic
In `repeat(auto-fit, ...)` vs `repeat(auto-fill, ...)`, what's the behavioral difference when there aren't enough items to fill the row?
Back: `auto-fit` collapses the empty tracks so existing items stretch to fill the row. `auto-fill` keeps the empty tracks reserved, leaving gaps.
<!--ID: 1780758285032-->
END

START
Basic
Write the CSS to make a single grid item span two columns.
Back: `grid-column: span 2;` (or by lines, e.g. `grid-column: 1 / 3`).
<!--ID: 1780758285039-->
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
