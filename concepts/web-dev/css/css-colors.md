---
tags: [css, web-dev, styling]
category: web-dev
related: [css-backgrounds-borders, css-custom-properties, cascade-inheritance]
---

## Description
Colors can be written as **named** keywords (`red`), **hex** (`#rrggbb` or shorthand `#rgb`, plus `#rrggbbaa` for alpha), **`rgb()`** / **`hsl()`** functions, or special keywords `transparent` and `currentColor`. Alpha (opacity of the color itself) is set via the 4th channel — modern syntax uses a slash: `rgb(255 0 0 / 50%)`. `hsl()` (hue, saturation, lightness) is the most human-friendly for building palettes. `currentColor` resolves to the element's `color`, great for keeping icons/borders in sync with text.

## Examples
```css
.a { color: #a78bfa; }                  /* hex */
.b { color: #fff; }                     /* shorthand = #ffffff */
.c { background: rgb(167 139 250 / 0.5); }   /* modern rgb with alpha */
.d { background: hsl(255 90% 75%); }    /* hue saturation lightness */
.e { border: 1px solid currentColor; }  /* matches this element's text color */

/* opacity vs alpha */
.f { opacity: 0.5; }                    /* fades the WHOLE element + children */
.g { background: rgb(0 0 0 / 0.5); }    /* fades ONLY this background */
```

## Related Topics
- [[css-backgrounds-borders|Backgrounds & Borders]]
- [[css-custom-properties|Custom Properties (theming)]]
- [[cascade-inheritance|Inheritance (color inherits)]]
- hsl / rgb / hex / alpha
- currentColor / transparent

## Cards

```anki
START
Basic
What's the difference between setting `opacity: 0.5` on an element and using a color with 50% alpha like `rgb(0 0 0 / 0.5)`?
Back: `opacity` fades the **entire element and all its children** (text, borders, content). An alpha color fades **only that one color channel** (e.g. just the background), leaving text/borders fully opaque.
<!--ID: 1780758285410-->
END

START
Basic
What does the `currentColor` keyword resolve to, and why is it useful?
Back: It resolves to the element's computed `color` value. Use it for borders, icons (SVG `fill`), or shadows so they automatically track the text color — change `color` once and they all follow.
<!--ID: 1780758285414-->
END

START
Basic
In `hsl(255 90% 75%)`, what does each of the three values represent?
Back: Hue (0–360° around the color wheel), Saturation (0–100%, gray→vivid), Lightness (0–100%, black→color→white). HSL makes it easy to build tints/shades by only nudging lightness.
<!--ID: 1780758285419-->
END

START
Basic
What does the hex shorthand `#fff` expand to, and what does a 4th pair like `#ffffff80` add?
Back: `#fff` → `#ffffff` (each digit doubled). An 8-digit hex `#rrggbbaa` adds an alpha channel; `80` ≈ 50% opacity.
<!--ID: 1780758285424-->
END

START
Basic
Write a background color that is pure black at 50% transparency using modern CSS syntax.
Back: `background: rgb(0 0 0 / 0.5);` (or `rgb(0 0 0 / 50%)`). The slash separates the alpha; legacy form is `rgba(0,0,0,0.5)`.
<!--ID: 1780758285428-->
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
