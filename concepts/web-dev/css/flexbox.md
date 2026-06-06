---
tags: [css, web-dev, layout]
category: web-dev
related: [css-grid, centering, box-model, flexbox-vs-grid]
---

## Description
Flexbox is a **one-dimensional** layout model: it arranges items along a single axis (a row *or* a column). You make a parent a flex container with `display: flex`, and its direct children become flex items. The **main axis** (set by `flex-direction`) is controlled by `justify-content`; the **cross axis** (perpendicular) is controlled by `align-items`. Reach for it for navbars, toolbars, button groups, and "spread these items out" layouts.

## Examples
```css
/* Perfectly centered child, both axes */
.container {
  display: flex;
  justify-content: center;  /* main axis  */
  align-items: center;      /* cross axis */
}

/* Logo left, links right */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

/* Items that wrap onto new lines, each flexible */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.cards > * { flex: 1 1 200px; }  /* grow, shrink, basis 200px */
```

## Related Topics
- [[css-grid|CSS Grid]]
- [[centering|Centering]]
- [[box-model|Box Model]]
- [[flexbox-vs-grid|Flexbox vs Grid]]
- Main axis / Cross axis

## Cards

```anki
START
Basic
You need to lay items out along a single line (a row or a column) and distribute the space between them. Which layout system, and why not the other one?
Back: Flexbox — it's one-dimensional (one axis at a time). Use Grid only when you need rows *and* columns aligned together (2D).
<!--ID: 1780758284956-->
END

START
Basic
Write the CSS to perfectly center a single child both horizontally and vertically using flexbox.
Back: `display: flex; justify-content: center; align-items: center;` on the parent.
<!--ID: 1780758284964-->
END

START
Basic
In a default flex row, which property controls horizontal placement and which controls vertical — and what happens to them with `flex-direction: column`?
Back: `justify-content` = main axis, `align-items` = cross axis. In a row the main axis is horizontal; switch to `column` and the axes flip — `justify-content` now controls vertical, `align-items` horizontal.
<!--ID: 1780758284971-->
END

START
Basic
Write the CSS to push one item to the far left and another to the far right of the same bar.
Back: `display: flex; justify-content: space-between;` on the container.
<!--ID: 1780758284979-->
END

START
Basic
What does the shorthand `flex: 1` expand to, and what's the effect?
Back: `flex-grow: 1; flex-shrink: 1; flex-basis: 0;`. Items grow from a zero basis to share all free space equally.
<!--ID: 1780758284987-->
END

START
Basic
By default a flex container forces everything onto one line (items shrink/overflow). What's the one declaration that lets items wrap to new lines?
Back: `flex-wrap: wrap;` (default is `nowrap`).
<!--ID: 1780758284994-->
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
