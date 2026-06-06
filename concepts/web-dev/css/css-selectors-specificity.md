---
tags: [css, web-dev, fundamentals]
category: web-dev
related: [css-positioning, box-model]
---

## Description
When two rules target the same element, **specificity** decides which one wins. Specificity is a four-part score `(inline, id, class, element)` compared left to right: inline styles beat IDs, IDs beat classes/attributes/pseudo-classes, which beat element/pseudo-element selectors. `!important` overrides the whole calculation. When specificity ties, the rule that appears **later in the source** wins. Knowing this stops the "why won't my style apply?" guessing game.

## Examples
```css
/* Specificity scores: */
a               { }   /* (0,0,0,1) */
.item a         { }   /* (0,0,1,1) */
#nav .item a    { }   /* (0,1,1,1)  ← wins over the two above */
a[href^="http"] { }   /* (0,0,1,1) — attribute counts as a class */

/* Combinators */
.menu  a   { }  /* descendant: any <a> inside .menu, at any depth */
.menu > a  { }  /* child: only <a> that is a direct child of .menu */

/* Pseudo-class (state) vs pseudo-element (sub-part) */
button:hover  { }   /* state */
p::first-line { }   /* generated/targeted sub-part */
```

## Related Topics
- [[css-positioning|Positioning]]
- !important
- Combinators (descendant / child / sibling)
- Pseudo-classes vs pseudo-elements
- Source order

## Cards

```anki
START
Basic
List the specificity tiers from strongest to weakest, including the escape hatch that beats them all.
Back: `!important` > inline `style=""` > `#id` > `.class` / `[attr]` / `:pseudo-class` > element / `::pseudo-element`. Universal `*` adds nothing.
<!--ID: 1780758285147-->
END

START
Basic
Compute the specificity of the selector `#nav .item a`.
Back: `(0,1,1,1)` → 1 id, 1 class, 1 element. It beats `.item a` `(0,0,1,1)` because the id column outranks the class column.
<!--ID: 1780758285154-->
END

START
Basic
Two rules target the same element with identical specificity. Which one applies?
Back: The one that appears **later** in the source order (the cascade's last tiebreaker).
<!--ID: 1780758285158-->
END

START
Basic
What's the difference between `.menu a` and `.menu > a`?
Back: `.menu a` (descendant) matches an `<a>` nested at *any* depth inside `.menu`. `.menu > a` (child) matches only an `<a>` that is a *direct* child of `.menu`.
<!--ID: 1780758285164-->
END

START
Basic
What distinguishes a pseudo-class like `:hover` from a pseudo-element like `::before`?
Back: A pseudo-class targets an element in a particular *state* (hovered, checked, first-child). A pseudo-element creates or targets a *sub-part* of the element (generated content, first line/letter).
<!--ID: 1780758285169-->
END

START
Basic
Write the selector that styles every other table row (the even ones).
Back: `tr:nth-child(even)` (equivalently `tr:nth-child(2n)`).
<!--ID: 1780758285176-->
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
