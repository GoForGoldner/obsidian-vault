---
tags: [css, web-dev, layout, legacy]
category: web-dev
related: [css-display, flexbox, css-positioning]
---

## Description
`float` pulls an element to the left or right of its container and lets inline content (text) wrap around it. It was the backbone of pre-flexbox layouts but is now mostly **legacy** — its one remaining good use is wrapping text around an image. The classic problem: a floated child is taken out of normal flow, so its parent **collapses to zero height**. The fix is "clearing" — historically the `::after { clear: both }` clearfix hack, now simply `display: flow-root` on the parent. Use Flexbox/Grid for actual layout.

## Examples
```css
/* Legitimate modern use: text wraps around an image */
.article img { float: left; margin: 0 16px 8px 0; }

/* Problem: parent collapses because its only child is floated */

/* Modern fix — one line, no extra markup */
.parent { display: flow-root; }

/* Legacy clearfix (still seen in older codebases) */
.clearfix::after { content: ""; display: block; clear: both; }
```

## Related Topics
- [[css-display|Display (flow-root / BFC)]]
- [[flexbox|Flexbox (modern replacement)]]
- [[css-positioning|Positioning]]
- clear: both
- Clearfix hack

## Cards

```anki
START
Basic
What is the one use case where `float` is still the right tool today?
Back: Wrapping inline text around an image (or pull-quote) within a paragraph — `float: left/right`. For page/component layout, use Flexbox or Grid instead.
<!--ID: 1780758285725-->
END

START
Basic
A container with only floated children collapses to zero height. Why, and what's the modern one-line fix?
Back: Floated elements are removed from normal flow, so they don't contribute to the parent's height. Fix: `display: flow-root;` on the parent — it establishes a BFC that contains the floats. (Legacy fix was the `::after { clear: both }` clearfix.)
<!--ID: 1780758285731-->
END

START
Basic
Write the legacy clearfix hack you'll still encounter in older codebases.
Back: `.clearfix::after { content: ""; display: block; clear: both; }`
<!--ID: 1780758285738-->
END

START
Basic
What does `clear: both` actually do?
Back: It forces the element to move below (clear past) any preceding left- AND right-floated elements, rather than sitting beside them.
<!--ID: 1780758285744-->
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
