---
tags: [css, web-dev, fundamentals]
category: web-dev
related: [box-model, css-grid, responsive-design]
---

## Description
CSS sizes come in **absolute** units (`px`) and **relative** units that scale with context. `em` is relative to the *current element's* font-size (and compounds when nested); `rem` is relative to the *root* (`html`) font-size, so it stays predictable. `%` is relative to the parent's matching dimension. `vw`/`vh` are 1% of the viewport's width/height. The grid-only `fr` splits leftover space. Choosing relative units is what makes layouts scale with the user's font settings and screen size.

## Examples
```css
html { font-size: 16px; }       /* 1rem = 16px everywhere */

.title  { font-size: 2rem; }    /* 32px, ignores parent font-size */
.parent { font-size: 20px; }
.child  { font-size: 2em; }     /* 40px — relative to parent's 20px */

.hero   { height: 100vh; }      /* exactly the viewport height */
.col    { width: 50%; }         /* half the parent's width */
.gap    { padding: 5%; }        /* % padding is relative to parent WIDTH */
```

## Related Topics
- [[box-model|Box Model]]
- [[css-grid|CSS Grid (fr)]]
- [[responsive-design|Responsive Design]]
- Viewport units (vw/vh/vmin/vmax)
- Root font-size

## Cards

```anki
START
Basic
What is each of `em` and `rem` relative to, and which one compounds when elements are nested?
Back: `em` = relative to the current element's font-size, so it **compounds** down the tree. `rem` = relative to the root `<html>` font-size, so it stays constant regardless of nesting.
<!--ID: 1780758285183-->
END

START
Basic
You nest several elements that each set `font-size: 1.5em`. What goes wrong, and which unit fixes it?
Back: Sizes multiply at each level (1.5 × 1.5 × 1.5…), so text balloons unexpectedly. Use `rem` to anchor to the root and stop the compounding.
<!--ID: 1780758285188-->
END

START
Basic
Write the CSS to make a hero section exactly fill the viewport height.
Back: `height: 100vh;` (1vh = 1% of viewport height).
<!--ID: 1780758285193-->
END

START
Basic
A `%` value for `padding` or `margin` is calculated relative to which dimension of the parent — even for top/bottom?
Back: Always the parent's **width**, including vertical padding/margins. (This is the trick behind aspect-ratio boxes via `padding-top: 56.25%`.)
<!--ID: 1780758285199-->
END

START
Basic
What do `1vw` and `1vh` each represent?
Back: `1vw` = 1% of the viewport's width; `1vh` = 1% of the viewport's height.
<!--ID: 1780758285205-->
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
