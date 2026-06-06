---
tags: [css, web-dev, comparison]
category: vs
related: [css-display, css-colors]
---

## Description
Three ways to "hide" an element, with very different consequences. **`display: none`** removes it from the layout *and* the accessibility tree — it takes no space and screen readers skip it. **`visibility: hidden`** hides it visually but **keeps its space** in the layout (a hole) and removes it from the a11y tree; it can't be interacted with. **`opacity: 0`** keeps it fully present — space reserved, still clickable, still read by some AT — just transparent. Pick based on whether you want the space and interactivity preserved.

## Examples
```css
.gone     { display: none; }        /* no space, not clickable, AT skips it */
.invisible{ visibility: hidden; }   /* keeps space, not clickable */
.faded    { opacity: 0; }           /* keeps space, STILL clickable */

/* visibility (unlike display) is animatable / transitionable */
.fade { transition: opacity 0.3s; }
```

## Related Topics
- [[css-display|Display]]
- [[css-colors|opacity]]
- Accessibility tree
- Hit-testing / pointer-events

## Cards

```anki
START
Basic
Compare `display: none`, `visibility: hidden`, and `opacity: 0` on two axes: does the element keep its layout space, and can it still be clicked?
Back: `display: none` → no space, not clickable. `visibility: hidden` → keeps space, not clickable. `opacity: 0` → keeps space, **still clickable** (and still in the DOM/flow).
<!--ID: 1780758285790-->
END

START
Basic
You want to hide an element but keep the exact gap it occupied so the layout doesn't shift. Which property?
Back: `visibility: hidden;` (or `opacity: 0`) — both preserve the element's box. `display: none` would collapse the space.
<!--ID: 1780758285796-->
END

START
Basic
Which "hide" technique still lets the hidden element receive clicks, and how do you stop that?
Back: `opacity: 0` — it's only transparent, so it still captures pointer events. Add `pointer-events: none;` to make it click-through, or use `visibility: hidden`.
<!--ID: 1780758285803-->
END

START
Basic
Why can't you smoothly animate hiding with `display: none`, and what do you use instead for a fade-out?
Back: `display` isn't an animatable property — it flips instantly. Fade with `opacity` (and optionally `visibility`) under a `transition`, since those interpolate.
<!--ID: 1780758285809-->
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
