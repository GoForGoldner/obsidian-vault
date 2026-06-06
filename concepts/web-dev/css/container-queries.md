---
tags: [css, web-dev, responsive, layout]
category: web-dev
related: [responsive-design, css-grid, css-functions]
---

## Description
Container queries style an element based on the size of its **parent container** rather than the viewport — the missing piece that makes components truly reusable. You mark an ancestor as a query container with `container-type: inline-size`, then write `@container (min-width: ...)` rules that respond to *that* container's width, wherever it sits on the page. A card can show a horizontal layout in a wide sidebar and a stacked layout in a narrow one — with one rule set. New unit `cqi` = 1% of the container's inline size.

## Examples
```css
/* 1. Declare the parent as a size container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;     /* optional name */
}

/* 2. Query the CONTAINER's width, not the viewport */
@container card (min-width: 400px) {
  .card { display: flex; gap: 16px; }
}
@container (max-width: 399px) {
  .card { display: block; }
}
```

## Related Topics
- [[responsive-design|Responsive Design (media queries)]]
- [[css-grid|CSS Grid]]
- [[css-functions|Fluid sizing]]
- container-type / container-name
- cqi / cqw units

## Cards

```anki
START
Basic
What's the fundamental difference between a container query and a media query?
Back: A media query responds to the **viewport** (whole window) size. A container query responds to a **specific ancestor element's** size — so a component adapts to the space it's actually placed in, no matter where that is on the page.
<!--ID: 1780758285672-->
END

START
Basic
Write the two-step CSS to make a `.card` switch to a flex row when its container (not the viewport) is at least 400px wide.
Back: On the parent: `container-type: inline-size;`. Then: `@container (min-width: 400px) { .card { display: flex; } }`
<!--ID: 1780758285676-->
END

START
Basic
Why do container queries make components more reusable than media queries?
Back: The same component reacts to whatever container it's dropped into — wide sidebar vs narrow column vs full page — without knowing the viewport or needing page-level breakpoints. Layout logic lives with the component.
<!--ID: 1780758285682-->
END

START
Basic
What must you set on the ancestor before any `@container` rule will work, and what's the usual value?
Back: `container-type` — usually `inline-size` (queries the width). Without declaring a query container, `@container` rules match nothing.
<!--ID: 1780758285687-->
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
