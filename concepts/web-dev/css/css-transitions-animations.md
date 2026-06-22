---
tags: [css, web-dev, animation]
category: web-dev
related: [css-backgrounds-borders, css-positioning, centering]
---

## Description
CSS moves things two ways. A **`transition`** animates a property from its old value to a new one *when the value changes* (e.g. on `:hover`) — it's reactive and needs a trigger. An **`animation`** runs a named **`@keyframes`** sequence on its own, with no trigger, and can loop. For smoothness, animate only `transform` and `opacity` — they're GPU-composited and don't trigger layout reflow, unlike animating `width`, `top`, or `margin`.

## Examples
```css
/* Transition: reacts to a state change */
.btn {
  background: #a78bfa;
  transition: transform 0.2s ease, background 0.2s ease;
}
.btn:hover { transform: scale(1.05); background: #c4b5fd; }

/* Animation: runs on its own, defined by @keyframes */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.spinner { animation: spin 1s linear infinite; }

/* shorthand: name duration timing delay iteration direction */
.pulse { animation: pulse 1.5s ease-in-out 0s infinite alternate; }
```

## Related Topics
- [[css-backgrounds-borders|Backgrounds & Borders]]
- [[css-positioning|Positioning]]
- [[centering|Centering (translate)]]
- @keyframes
- transform / opacity / GPU compositing

## Cards

```anki
START
Basic
What's the fundamental difference between a `transition` and an `animation`?
Back: A `transition` needs a trigger — it interpolates a property when its value changes (e.g. on `:hover`/class toggle), runs once, no looping. An `animation` runs a `@keyframes` sequence automatically with no trigger and can loop, alternate, and define multiple intermediate steps.
<!--ID: 1780758285352-->
END

START
Basic
Write the CSS to make a button smoothly scale up to 1.05× over 0.2s when hovered.
Back: `.btn { transition: transform 0.2s ease; }` and `.btn:hover { transform: scale(1.05); }` — the transition must live on the base rule, not only the `:hover`.
<!--ID: 1780758285357-->
END

START
Basic
Write a `@keyframes` rule named `spin` that rotates a full turn, plus the line that runs it forever at constant speed over 1s.
Back: `@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }` then `animation: spin 1s linear infinite;`
<!--ID: 1780758285363-->
END

START
Basic
For smooth, jank-free animation, which two properties should you prefer to animate, and why?
Back: `transform` and `opacity` — they're handled by the compositor/GPU and skip layout + paint. Animating `width`, `height`, `top`, or `margin` forces reflow on every frame and stutters.
<!--ID: 1780758285368-->
END

START
Basic
Your hover transition snaps instantly with no animation even though `:hover` changes the property. What's the usual mistake?
Back: The `transition` is declared only inside `:hover` (or missing). It must be on the element's resting/base state so the browser knows how to interpolate *both* into and out of the hover.
<!--ID: 1780758285377-->
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
