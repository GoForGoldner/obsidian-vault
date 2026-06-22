---
tags: [css, web-dev, layout, responsive]
category: web-dev
related: [css-units, css-grid, flexbox, box-model]
---

## Description
Responsive design makes one layout adapt to any screen. The core tool is the **media query** (`@media`), which applies a block of CSS only when conditions like viewport width are met. The modern best practice is **mobile-first**: write the base styles for small screens, then use `min-width` queries to layer on enhancements as the screen grows. The `<meta name="viewport">` tag is mandatory or mobile browsers fake a desktop width.

## Examples
```html
<!-- Without this, phones render at ~980px and zoom out -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```
```css
/* Mobile-first base: single column */
.grid { display: grid; grid-template-columns: 1fr; gap: 12px; }

/* Tablet and up: two columns */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop and up: three columns */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

## Related Topics
- [[css-units|Relative Units (rem, vw, %)]]
- [[css-grid|CSS Grid (auto-fit/minmax)]]
- [[flexbox|Flexbox (wrap)]]
- Mobile-first
- Breakpoints / viewport meta tag

## Cards

```anki
START
Basic
Write a media query that applies its rules only when the viewport is at least 768px wide.
Back: `@media (min-width: 768px) { ... }`
<!--ID: 1780758285245-->
END

START
Basic
What does "mobile-first" mean in practice, and which media-query direction does it imply?
Back: Write the base CSS for small screens first, then add complexity for larger ones using `min-width` queries (layering up). The opposite, desktop-first, uses `max-width` (stripping down).
<!--ID: 1780758285251-->
END

START
Basic
What's a way to get a responsive multi-column grid that needs ZERO media queries?
Back: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));` — the grid reflows the column count on its own as width changes.
<!--ID: 1780758285263-->
END

START
Basic
For text and spacing that scale with the user's font settings across breakpoints, which units should you prefer over `px`?
Back: Relative units — `rem` (and `em`) for type/spacing, `%`/`vw`/`fr` for layout widths. They adapt; fixed `px` doesn't.
<!--ID: 1780758285269-->
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
