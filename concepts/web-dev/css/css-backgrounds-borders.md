---
tags: [css, web-dev, styling]
category: web-dev
related: [box-model, text-typography, css-transitions-animations]
---

## Description
These are the "surface" properties that make a box look like something. **`background`** sets color, images, and gradients. **`border`** draws a line *on* the box edge and takes up layout space (it's part of the box model). **`outline`** draws a line *outside* the border that does **not** affect layout — ideal for focus rings. **`border-radius`** rounds corners. **`box-shadow`** casts a shadow (or, with `inset`, an inner glow). Knowing border-vs-outline and the shadow syntax covers most "make this look nice" needs.

## Examples
```css
.card {
  background: #1e1e1e;                              /* solid color */
  border: 1px solid rgba(255,255,255,0.15);        /* width style color */
  border-radius: 14px;                             /* rounded corners */
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);          /* x y blur color */
}

/* Linear gradient background */
.hero { background: linear-gradient(90deg, #a78bfa, #c4b5fd); }

/* Focus ring that doesn't shift layout (outline is outside the box) */
.btn:focus-visible { outline: 2px solid #a78bfa; outline-offset: 2px; }

/* Inner shadow */
.well { box-shadow: inset 0 2px 6px rgba(0,0,0,0.5); }
```

## Related Topics
- [[box-model|Box Model]]
- [[text-typography|Text & Typography]]
- [[css-transitions-animations|Transitions & Animations]]
- linear-gradient
- box-shadow / inset / focus rings

## Cards

```anki
START
Basic
What's the key difference between `border` and `outline` in terms of layout?
Back: `border` is part of the box model — it adds to the element's size and pushes neighbors. `outline` is drawn outside the border and takes **no** layout space, so toggling it never shifts the page (perfect for focus rings).
<!--ID: 1780758285314-->
END

START
Basic
Write the CSS for a card with a dark background, a 1px subtle border, 14px rounded corners, and a soft drop shadow.
Back: `background: #1e1e1e; border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; box-shadow: 0 4px 24px rgba(0,0,0,0.4);`
<!--ID: 1780758285320-->
END

START
Basic
What does each value mean in `box-shadow: 0 4px 24px rgba(0,0,0,0.4)`?
Back: x-offset (0), y-offset (4px down), blur radius (24px), color. An optional 4th length is spread, and a leading `inset` keyword turns it into an inner shadow.
<!--ID: 1780758285327-->
END

START
Basic
Write the CSS to give an element a left-to-right gradient background from purple to light purple.
Back: `background: linear-gradient(90deg, #a78bfa, #c4b5fd);` (the angle sets direction; `90deg` = left→right).
<!--ID: 1780758285333-->
END

START
Basic
What are the three parts of the `border` shorthand, in order?
Back: `border: <width> <style> <color>;` e.g. `1px solid #000`. The `style` (solid/dashed/etc.) is required — omit it and no border renders.
<!--ID: 1780758285339-->
END

START
Basic
You want a focus indicator that's clearly visible but doesn't nudge surrounding elements when it appears. Which property, and what pushes it off the edge?
Back: `outline` (it's layout-neutral), plus `outline-offset` to add a gap between the element and the ring.
<!--ID: 1780758285346-->
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
