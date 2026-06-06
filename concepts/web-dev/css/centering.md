---
tags: [css, web-dev, layout]
category: web-dev
related: [flexbox, css-grid, box-model, css-positioning]
---

## Description
"How do I center this?" has different answers depending on *what* you're centering and *which axes*. The modern default is flexbox or grid on the parent. For a single fixed-width block, `margin: 0 auto` still wins. For an absolutely-positioned element of unknown size, the `translate(-50%, -50%)` trick is the classic. This note ties together [[flexbox]], [[css-grid]], [[box-model]], and [[css-positioning]] around one practical problem.

## Examples
```css
/* Inline content (text) horizontally */
.text { text-align: center; }

/* Fixed-width block horizontally (box-model way) */
.block { width: 400px; margin: 0 auto; }

/* Both axes — flexbox */
.flex { display: flex; justify-content: center; align-items: center; }

/* Both axes — grid one-liner */
.grid { display: grid; place-items: center; }

/* Absolutely-positioned element of unknown size */
.abs {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
```

## Related Topics
- [[flexbox|Flexbox]]
- [[css-grid|CSS Grid]]
- [[box-model|Box Model (margin auto)]]
- [[css-positioning|Positioning]]
- transform: translate

## Cards

```anki
START
Basic
Write the CSS to center plain inline text horizontally inside its container.
Back: `text-align: center;` on the container. (Works for inline / inline-block content, not block-level boxes.)
<!--ID: 1780758285211-->
END

START
Basic
Write the CSS to horizontally center a block element that has a known width — using the box model, not flexbox.
Back: `margin: 0 auto;` (with a set `width`). Auto left/right margins absorb the leftover space equally.
<!--ID: 1780758285216-->
END

START
Basic
Write the shortest CSS that centers a child on BOTH axes using grid.
Back: `display: grid; place-items: center;` on the parent.
<!--ID: 1780758285221-->
END

START
Basic
Write the CSS to center an absolutely-positioned element whose width and height you don't know.
Back: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);` — the negative translate pulls it back by half its own size.
<!--ID: 1780758285226-->
END

START
Basic
Why doesn't `margin: auto` vertically center a block in normal document flow, and where does it actually work vertically?
Back: In normal block flow, vertical `auto` margins compute to 0 — no centering. `margin: auto` *does* center vertically inside a **flex** (or grid) container.
<!--ID: 1780758285232-->
END

START
Basic
You need to quickly center one item both horizontally and vertically in a container. What are the two go-to modern one-block answers?
Back: Flexbox — `display: flex; justify-content: center; align-items: center;` — or Grid — `display: grid; place-items: center;`.
<!--ID: 1780758285238-->
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
