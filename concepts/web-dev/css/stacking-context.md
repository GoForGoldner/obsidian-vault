---
tags: [css, web-dev, layout]
category: web-dev
related: [css-positioning, css-transforms, css-colors]
---

## Description
A **stacking context** is a self-contained layer group on the z-axis. Within one context, children paint by: non-positioned elements first, then by `z-index` (and source order for ties). The catch: `z-index` values **only compete inside the same stacking context** — a child with `z-index: 9999` can never escape above an element in a *higher* parent context. Contexts are created by the root element, `position` + a `z-index`, `opacity < 1`, any `transform`/`filter`, `will-change`, and `isolation: isolate`.

## Examples
```css
/* z-index only applies to positioned elements */
.modal { position: fixed; z-index: 100; }

/* This INNOCENTLY creates a stacking context and can trap children */
.card { opacity: 0.99; }   /* now .card's kids can't z-index above siblings of .card */

/* Deliberately create a context without side effects */
.layer { isolation: isolate; }
```

## Related Topics
- [[css-positioning|Positioning]]
- [[css-transforms|Transforms (create contexts)]]
- [[css-colors|opacity]]
- z-index
- isolation: isolate

## Cards

```anki
START
Basic
Why can an element with `z-index: 9999` still appear *behind* another element that has a much lower z-index?
Back: They're in different **stacking contexts**. z-index only orders siblings within the same context; if the 9999 element's parent context sits below the other element's context, no z-index can lift it above.
<!--ID: 1780758285575-->
END

START
Basic
List the common things that create a new stacking context (beyond the root element).
Back: A positioned element (`relative`/`absolute`/`fixed`/`sticky`) **with a z-index**, `opacity < 1`, any `transform` or `filter`, `will-change`, and `isolation: isolate`. Also flex/grid children with a z-index.
<!--ID: 1780758285580-->
END

START
Basic
On what kind of element does `z-index` have no effect at all?
Back: A `position: static` element (the default) — z-index is ignored. It only applies to positioned elements and flex/grid items.
<!--ID: 1780758285587-->
END

START
Basic
You add `opacity: 0.99` or a `transform` to a card and suddenly its dropdown gets clipped behind other content. What happened?
Back: That property created a new stacking context on the card, trapping its descendants' z-index inside it — they can no longer layer above elements outside the card. Remove the property or restructure the z-index hierarchy.
<!--ID: 1780758285592-->
END

START
Basic
Within a single stacking context, what's the paint order from back to front?
Back: (1) the context root's background/border, (2) negative z-index children, (3) non-positioned block boxes, (4) non-positioned floats, (5) inline content, (6) positioned children by z-index (then source order for ties).
<!--ID: 1780758285599-->
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
