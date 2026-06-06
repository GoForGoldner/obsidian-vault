---
tags: [css, web-dev, styling]
category: web-dev
related: [css-backgrounds-borders, css-colors, css-transforms, stacking-context]
---

## Description
`filter` applies graphical effects to an element and its contents — `blur()`, `brightness()`, `contrast()`, `grayscale()`, `drop-shadow()` — and they can be chained. **`backdrop-filter`** applies the same effects to whatever is *behind* a semi-transparent element (the "glassmorphism" frosted-glass look). `mix-blend-mode` controls how an element blends with what's underneath. Note: any `filter` (other than `none`) creates a new **stacking context** and can be GPU-accelerated.

## Examples
```css
/* Chained filters on an image */
.photo { filter: grayscale(100%) brightness(1.1); }

/* drop-shadow follows the shape's alpha (unlike box-shadow's rectangle) */
.icon { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); }

/* Frosted-glass panel — blurs the page behind it */
.glass {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
}
```

## Related Topics
- [[css-backgrounds-borders|box-shadow]]
- [[css-colors|alpha / opacity]]
- [[css-transforms|Transforms]]
- [[stacking-context|Stacking Context]]
- backdrop-filter / glassmorphism

## Cards

```anki
START
Basic
What's the difference between `filter` and `backdrop-filter`?
Back: `filter` applies effects to the element and its own content. `backdrop-filter` applies them to whatever is rendered *behind* the element (visible through its translucent background) — that's how the frosted-glass effect is made.
<!--ID: 1780758285749-->
END

START
Basic
Write the CSS for a frosted-glass ("glassmorphism") panel.
Back: `background: rgba(255,255,255,0.1); backdrop-filter: blur(12px);` — a translucent background plus a blur of the backdrop behind it.
<!--ID: 1780758285754-->
END

START
Basic
When would you use `filter: drop-shadow()` instead of `box-shadow`?
Back: When the element is a non-rectangular shape (transparent PNG, SVG icon, rounded/clipped content). `drop-shadow()` follows the actual alpha silhouette; `box-shadow` always traces the rectangular box.
<!--ID: 1780758285759-->
END

START
Basic
Write the filter that makes an image fully grayscale and 10% brighter, in one declaration.
Back: `filter: grayscale(100%) brightness(1.1);` — filters chain left to right in a single `filter` value.
<!--ID: 1780758285764-->
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
