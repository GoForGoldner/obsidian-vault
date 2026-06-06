---
tags: [css, web-dev, typography]
category: web-dev
related: [css-units, css-backgrounds-borders, box-model]
---

## Description
Text styling splits into **font properties** (the typeface itself) and **text properties** (how the text flows and is decorated). Key font props: `font-family` (with fallbacks), `font-size`, `font-weight`, `line-height`. Key text props: `text-align`, `text-decoration`, `text-transform`, `letter-spacing`, and `text-overflow` for truncation. Prefer `rem` for `font-size` and a unitless `line-height` so spacing scales with the font.

## Examples
```css
body {
  font-family: 'Inter', system-ui, sans-serif;  /* fallback chain */
  font-size: 1rem;        /* 16px from root */
  font-weight: 400;
  line-height: 1.5;       /* unitless = 1.5 × element font-size */
}

.heading {
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

/* Truncate a single line with an ellipsis */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## Related Topics
- [[css-units|CSS Units (rem/em)]]
- [[css-backgrounds-borders|Backgrounds & Borders]]
- [[box-model|Box Model]]
- Web fonts / font fallback stack
- Unitless line-height

## Cards

```anki
START
Basic
Write the CSS to truncate a single line of text with an ellipsis (…) when it overflows its box.
Back: `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` — all three are required together.
<!--ID: 1780758285277-->
END

START
Basic
Why is a unitless `line-height` (e.g. `1.5`) preferred over `line-height: 24px` or `1.5em`?
Back: A unitless value is a multiplier each element computes against *its own* font-size, so it scales correctly when child elements change size. A fixed/em value is computed once and inherited as an absolute length, breaking on resized children.
<!--ID: 1780758285283-->
END

START
Basic
What is the purpose of a `font-family` like `'Inter', system-ui, sans-serif` having multiple values?
Back: It's a fallback chain — the browser uses the first font that's available, falling back rightward. The final generic family (`sans-serif`) guarantees something always renders.
<!--ID: 1780758285289-->
END

START
Basic
Which property uppercases text visually without changing the underlying HTML, and how does it differ from typing capitals?
Back: `text-transform: uppercase;`. It only changes display — the real text content (for copy/paste, screen readers, the DOM) stays as authored.
<!--ID: 1780758285295-->
END

START
Basic
You want to remove the underline from a link. Which property and value?
Back: `text-decoration: none;`
<!--ID: 1780758285302-->
END

START
Basic
Which property controls horizontal alignment of inline/text content — and what does it NOT center?
Back: `text-align` (`left`/`center`/`right`/`justify`). It does *not* center block-level boxes — use `margin: 0 auto` or fl/grid for those.
<!--ID: 1780758285307-->
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
