---
tags: [css, web-dev, layout]
category: web-dev
related: [box-model, css-display, css-positioning]
---

## Description
`overflow` controls what happens when content is larger than its box: **`visible`** (default — content spills out), **`hidden`** (clipped, no scrollbar), **`scroll`** (always shows scrollbars), **`auto`** (scrollbars only when needed). Use `overflow-x` / `overflow-y` to set axes independently. A side effect that matters: any `overflow` value other than `visible` makes the element establish a **block formatting context** (so it contains floats and stops margin collapse) — and it can break `position: sticky` on descendants. `scroll-behavior: smooth` animates jumps.

## Examples
```css
/* Clip overflow with no scrollbar */
.clip { overflow: hidden; }

/* Scroll only when content is too tall */
.panel { max-height: 400px; overflow-y: auto; }

/* Horizontal scroller (e.g. a carousel row) */
.carousel { display: flex; overflow-x: auto; }

/* Smooth anchor-jump scrolling for the whole page */
html { scroll-behavior: smooth; }
```

## Related Topics
- [[box-model|Box Model]]
- [[css-display|Display / BFC]]
- [[css-positioning|Positioning (sticky)]]
- overflow-x / overflow-y
- Block formatting context

## Cards

```anki
START
Basic
Compare `overflow: hidden`, `scroll`, and `auto` for content that's too big for its box.
Back: `hidden` clips the overflow with no scrollbar. `scroll` always shows scrollbars (even when not needed). `auto` shows scrollbars **only when** content actually overflows — usually the one you want.
<!--ID: 1780758285551-->
END

START
Basic
Write the CSS for a panel that's at most 400px tall and scrolls vertically only when its content exceeds that.
Back: `max-height: 400px; overflow-y: auto;`
<!--ID: 1780758285555-->
END

START
Basic
What surprising layout side effect does setting any `overflow` value other than `visible` have?
Back: It makes the element establish a **block formatting context (BFC)** — so it now contains floated children and won't margin-collapse with them. It can also disable `position: sticky` on descendants.
<!--ID: 1780758285560-->
END

START
Basic
Your `position: sticky` child stopped sticking after you added `overflow: hidden` to an ancestor. Why?
Back: Sticky positions itself within its nearest scroll container. An ancestor with `overflow: hidden/auto/scroll` becomes that container and clips/changes the sticky behavior — remove or relocate the overflow.
<!--ID: 1780758285565-->
END

START
Basic
Write the one declaration that makes in-page anchor jumps animate smoothly instead of snapping.
Back: `html { scroll-behavior: smooth; }`
<!--ID: 1780758285570-->
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
