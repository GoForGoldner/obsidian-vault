---
tags: [css, web-dev, layout]
category: web-dev
related: [css-positioning, centering, css-units, flexbox]
---

## Description
Every element is a box made of four layers, inside-out: **content → padding → border → margin**. By default (`box-sizing: content-box`), a `width` you set applies to the *content* only, so padding and border are added *on top*, making the element render wider than the number you wrote. Switching to `box-sizing: border-box` makes `width` include padding and border — the box stays the size you asked for. This is the root cause of most "why is my element too big?" bugs.

## Examples
```css
/* The near-universal reset: width means width */
* { box-sizing: border-box; }

/* content-box (default): rendered width = 200 + 2*20 + 2*2 = 244px */
.a { box-sizing: content-box; width: 200px; padding: 20px; border: 2px solid; }

/* border-box: rendered width = exactly 200px */
.b { box-sizing: border-box;  width: 200px; padding: 20px; border: 2px solid; }

/* Center a fixed-width block horizontally */
.card { width: 400px; margin: 0 auto; }
```

## Related Topics
- [[css-positioning|Positioning]]
- [[centering|Centering]]
- [[css-units|CSS Units]]
- box-sizing
- Margin collapsing

## Cards

```anki
START
Basic
Name the four layers of the box model from the inside out.
Back: Content → padding → border → margin. (Padding is inside the border, margin is outside it.)
<!--ID: 1780758285045-->
END

START
Basic
You set `width: 200px` and `padding: 20px`, but the element renders 240px wide. Why, and what's the one-line fix?
Back: Default `box-sizing: content-box` adds padding/border *outside* the declared width. Fix: `box-sizing: border-box;` so width includes padding + border.
<!--ID: 1780758285052-->
END

START
Basic
Write the CSS reset that makes every element on the page size by its border edge.
Back: `* { box-sizing: border-box; }`
<!--ID: 1780758285057-->
END

START
Basic
What's the practical difference between margin and padding (think background and what sits where)?
Back: Padding is space *inside* the border — between content and edge — and shows the element's background. Margin is space *outside* the border — between this element and its neighbors — and is always transparent.
<!--ID: 1780758285065-->
END

START
Basic
Two stacked block elements each have `margin: 20px`. How much vertical space ends up between them, and what is this called?
Back: 20px, not 40px — **margin collapsing**. Adjacent vertical margins collapse to the larger of the two (only vertical, only in normal block flow).
<!--ID: 1780758285072-->
END

START
Basic
Write the CSS to horizontally center a block element that has a fixed width.
Back: `width: <value>; margin: 0 auto;` — auto left/right margins split the leftover space evenly. (Requires a defined width.)
<!--ID: 1780758285079-->
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
