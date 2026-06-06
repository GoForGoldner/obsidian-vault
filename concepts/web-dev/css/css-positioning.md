---
tags: [css, web-dev, layout]
category: web-dev
related: [box-model, centering, css-selectors-specificity, flexbox]
---

## Description
The `position` property decides how an element is placed and whether `top`/`right`/`bottom`/`left` apply. **static** (default) ignores offsets. **relative** offsets the element from its normal spot but keeps its space in the flow. **absolute** removes it from flow and positions it relative to the nearest *positioned* ancestor. **fixed** pins it to the viewport. **sticky** acts relative until a scroll threshold, then sticks like fixed. `z-index` only affects positioned (non-static) elements.

## Examples
```css
/* Badge pinned to the top-right corner of a card */
.card  { position: relative; }          /* establishes the anchor */
.badge { position: absolute; top: 0; right: 0; }

/* Floating action button glued to the viewport */
.fab { position: fixed; bottom: 24px; right: 24px; }

/* Section header that sticks once it hits the top while scrolling */
.section-header { position: sticky; top: 0; }
```

## Related Topics
- [[box-model|Box Model]]
- [[centering|Centering]]
- z-index / stacking context
- Containing block
- Normal flow

## Cards

```anki
START
Basic
You want a button that stays glued to a fixed spot on screen even as the page scrolls. Which `position` value?
Back: `position: fixed;` — positioned relative to the viewport, unaffected by scroll.
<!--ID: 1780758285086-->
END

START
Basic
You want a header that scrolls away normally but sticks to the top of the screen once it reaches it. Which `position` value, and what else must you set?
Back: `position: sticky;` plus a threshold like `top: 0;` (sticky does nothing without a top/bottom/left/right value).
<!--ID: 1780758285091-->
END

START
Basic
An element with `position: absolute` is positioned relative to *what*?
Back: Its nearest ancestor that is itself positioned (relative/absolute/fixed/sticky). If none exists, it falls back to the initial containing block (≈ the viewport).
<!--ID: 1780758285097-->
END

START
Basic
Write the CSS to pin a badge to the top-right corner of a card.
Back: Card: `position: relative;`. Badge: `position: absolute; top: 0; right: 0;` — the card becomes the anchor.
<!--ID: 1780758285115-->
END

START
Basic
Your `position: sticky` element refuses to stick. What are the usual culprits?
Back: (1) No `top`/`bottom` value set, (2) a parent has `overflow: hidden/auto/scroll`, or (3) the sticky element's parent isn't tall enough to scroll within.
<!--ID: 1780758285126-->
END

START
Basic
What's the difference between `relative` and `absolute` in terms of the document flow?
Back: `relative` keeps the element's original space in flow and just visually nudges it. `absolute` removes it from flow entirely, so surrounding content collapses as if it weren't there.
<!--ID: 1780758285133-->
END

START
Basic
Why does setting `z-index` sometimes do nothing?
Back: `z-index` only applies to **positioned** elements (anything except `position: static`) and grid/flex items. On a static element it's ignored.
<!--ID: 1780758285140-->
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
