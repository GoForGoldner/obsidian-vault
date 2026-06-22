---
tags: [css, web-dev, fundamentals]
category: web-dev
related: [css-selectors-specificity, css-custom-properties, css-colors]
---

## Description
The **cascade** is the algorithm that picks a winning value when multiple rules set the same property. It resolves in this order: (1) **importance** (`!important` and origin), (2) **specificity**, (3) **source order** (last wins). **Inheritance** is separate: some properties (mostly typography — `color`, `font-*`, `line-height`) pass from parent to child automatically; box properties (`margin`, `border`, `width`, `background`) do not. The keywords `inherit`, `initial`, `unset`, and `revert` let you control inheritance explicitly.

## Examples
```css
/* Cascade tiebreakers, strongest first */
/* 1. !important   2. specificity   3. later source order */

p { color: blue; }
p { color: green; }   /* green wins — same specificity, comes later */

/* Inheritance: child <a> normally ignores parent color; force it: */
.footer a { color: inherit; }

/* Reset a property to what it WOULD be without author rules */
.btn { all: revert; }

/* unset = inherit if the property inherits, else initial */
.reset { color: unset; border: unset; }
```

## Related Topics
- [[css-selectors-specificity|Selectors & Specificity]]
- [[css-custom-properties|Custom Properties]]
- @layer (cascade layers)
- inherit / initial / unset / revert
- Inheritable vs non-inheritable properties

## Cards

```anki
START
Basic
Which kinds of properties inherit from parent to child by default, and which don't?
Back: Mostly text/typography properties inherit — `color`, `font-family`, `font-size`, `line-height`, `text-align`, `visibility`. Box/layout properties do **not** — `margin`, `padding`, `border`, `width`, `background`, `display`.
<!--ID: 1780758285386-->
END

START
Basic
A child element isn't picking up the parent's `color`, but you want it to. Write the declaration that forces inheritance.
Back: `color: inherit;` — explicitly takes the computed value of the parent's `color`.
<!--ID: 1780758285391-->
END

START
Basic
What does the `unset` keyword do, and how does it differ from `initial`?
Back: `unset` = behave as `inherit` if the property *naturally inherits*, otherwise as `initial`. `initial` always resets to the CSS-spec default regardless of inheritance.
<!--ID: 1780758285395-->
END

START
Basic
What is a cascade layer (`@layer`) and where does it sit in the cascade?
Back: `@layer` groups rules into ordered layers; earlier-declared layers lose to later ones *regardless of specificity*. Layers are compared after importance/origin but before normal specificity — a clean way to tame override wars without `!important`.
<!--ID: 1780758285400-->
END

START
Basic
Why is leaning on `!important` to win a conflict considered a code smell?
Back: It bypasses specificity and source order, so the only way to beat it later is *another* `!important` — escalating an arms race. Prefer raising specificity, fixing source order, or using `@layer`.
<!--ID: 1780758285404-->
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
