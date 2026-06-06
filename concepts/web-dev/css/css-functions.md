---
tags: [css, web-dev, fundamentals, responsive]
category: web-dev
related: [css-units, responsive-design, css-custom-properties]
---

## Description
CSS has built-in math/comparison functions that compute values at runtime. **`calc()`** does arithmetic and—crucially—**mixes units** (`calc(100% - 40px)`). **`min()`** / **`max()`** pick the smallest/largest of their arguments. **`clamp(min, preferred, max)`** locks a value between bounds, the go-to for fluid typography and widths without media queries. They combine with custom properties and any length unit, replacing a lot of breakpoint juggling.

## Examples
```css
/* Mix units — impossible without calc() */
.main { width: calc(100% - 250px); }   /* full width minus a 250px sidebar */

/* Never exceed a readable line length, shrink on small screens */
.container { width: min(90%, 1200px); }

/* Floor on a value */
.box { width: max(50%, 300px); }

/* Fluid font: 1rem floor, scales with viewport, 2.5rem ceiling */
h1 { font-size: clamp(1rem, 2vw + 1rem, 2.5rem); }
```

## Related Topics
- [[css-units|CSS Units]]
- [[responsive-design|Responsive Design]]
- [[css-custom-properties|Custom Properties]]
- calc / clamp / min / max
- Fluid typography

## Cards

```anki
START
Basic
What can `calc()` do that no static value can, and write an example for a main column beside a 250px sidebar.
Back: It mixes units and computes at runtime. `width: calc(100% - 250px);` — full container width minus the fixed sidebar. (Always put spaces around `+` and `-`.)
<!--ID: 1780758285523-->
END

START
Basic
Write the CSS for fluid heading text that's never smaller than 1rem, never larger than 2.5rem, and scales with the viewport in between — using no media queries.
Back: `font-size: clamp(1rem, 2vw + 1rem, 2.5rem);` — `clamp(MIN, PREFERRED, MAX)`.
<!--ID: 1780758285527-->
END

START
Basic
What's the practical effect of `width: min(90%, 1200px)` and why is it handy?
Back: The element is 90% of its container *until* that exceeds 1200px, then it caps at 1200px. It's a one-liner responsive max-width — narrower than the cap on small screens, capped on large ones.
<!--ID: 1780758285533-->
END

START
Basic
Counterintuitively, when do you use `max()` to set a *minimum* size? Give the pattern.
Back: `max(50%, 300px)` → the value is whichever is **larger**, so 300px acts as a floor (it'll be at least 300px, growing to 50% when that's bigger). `min()` sets a ceiling; `max()` sets a floor.
<!--ID: 1780758285539-->
END

START
Basic
What's the one syntax gotcha with the `+` and `-` operators inside `calc()`?
Back: They **must** be surrounded by whitespace — `calc(100% - 40px)` works, `calc(100%-40px)` is invalid and silently fails. (`*` and `/` don't require the spaces.)
<!--ID: 1780758285545-->
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
