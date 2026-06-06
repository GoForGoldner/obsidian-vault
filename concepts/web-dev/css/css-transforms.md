---
tags: [css, web-dev, animation, layout]
category: web-dev
related: [css-transitions-animations, centering, stacking-context]
---

## Description
`transform` repositions/reshapes an element without disturbing layout — surrounding boxes stay put as if it never moved. Functions: `translate(x, y)` (move), `scale()` (resize), `rotate()` (spin), `skew()`. They compose in one declaration and apply **right to left**. `transform-origin` sets the pivot (default center `50% 50%`). Transforms are GPU-composited (cheap to animate) and create a new stacking context. Adding `perspective` and `rotateX/Y` unlocks 3D.

## Examples
```css
.move   { transform: translate(20px, -10px); }
.grow   { transform: scale(1.2); }
.spin   { transform: rotate(45deg); }

/* Composed — read right to left: rotate first, then translate */
.combo  { transform: translate(50px) rotate(45deg); }

/* Pivot from the top-left instead of the center */
.corner { transform-origin: top left; transform: rotate(10deg); }

/* The unknown-size centering trick */
.center { position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%); }
```

## Related Topics
- [[css-transitions-animations|Transitions & Animations]]
- [[centering|Centering (translate -50%)]]
- [[stacking-context|Stacking Context]]
- transform-origin
- 3D transforms / perspective

## Cards

```anki
START
Basic
What makes `transform` cheaper to animate than changing `top`/`left` or `width`?
Back: `transform` doesn't trigger layout/reflow — the element is composited on the GPU and neighbors don't move. Animating `top`/`left`/`width` forces the browser to recalculate layout every frame, causing jank.
<!--ID: 1780758285494-->
END

START
Basic
Write the transform that scales an element to 1.2× and rotates it 45°, and note which function applies first.
Back: `transform: scale(1.2) rotate(45deg);`. Composed transforms apply **right to left**, so the rotate happens first, then the scale.
<!--ID: 1780758285501-->
END

START
Basic
What does `transform-origin` control, and what's its default?
Back: The pivot point that `rotate`/`scale`/`skew` operate around. Default is `50% 50%` (the element's center). Set e.g. `top left` to pivot from a corner.
<!--ID: 1780758285507-->
END

START
Basic
Write the CSS to center an absolutely-positioned element of unknown size using transform.
Back: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);` — the percentages in translate are relative to the element's *own* size, pulling it back by half.
<!--ID: 1780758285512-->
END

START
Basic
A key side effect: applying any `transform` (or `filter`, `opacity < 1`) to an element does what to z-index layering?
Back: It creates a new **stacking context**, so the element's `z-index` is now resolved *within* that context — a common cause of "my z-index suddenly stopped working" bugs.
<!--ID: 1780758285517-->
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
