---
tags: [css, web-dev, fundamentals]
category: web-dev
related: [css-selectors-specificity, modern-selectors-nesting, text-typography]
---

## Description
A **pseudo-class** (`:`) selects an element in a particular *state or position* — `:hover`, `:focus`, `:disabled`, `:checked`, `:first-child`, `:nth-child()`, `:not()`. A **pseudo-element** (`::`) styles or *generates* a sub-part of an element — `::before`/`::after` (insert generated content, requires `content`), `::first-line`, `::placeholder`, `::selection`. The two-colon `::` syntax distinguishes pseudo-elements from pseudo-classes. `:focus-visible` is the modern, keyboard-aware focus ring.

## Examples
```css
a:hover         { color: purple; }      /* state */
input:disabled  { opacity: 0.5; }       /* state */
li:nth-child(odd) { background: #f5f5f5; }   /* position formula */
.btn:not(.primary) { opacity: 0.8; }     /* negation */

/* Generated content — content property is mandatory */
.tooltip::after { content: "?"; }
.required::before { content: "* "; color: red; }

/* Keyboard-only focus ring (no ring on mouse click) */
button:focus-visible { outline: 2px solid blue; }
```

## Related Topics
- [[css-selectors-specificity|Selectors & Specificity]]
- [[modern-selectors-nesting|:is / :where / :has]]
- [[text-typography|Text Styling]]
- ::before / ::after / content
- :nth-child / :focus-visible

## Cards

```anki
START
Basic
What's the visual/syntax convention that distinguishes a pseudo-element from a pseudo-class, and what's the conceptual difference?
Back: Pseudo-elements use `::` (e.g. `::before`), pseudo-classes use `:` (e.g. `:hover`). A pseudo-class targets a *state/position* of a real element; a pseudo-element styles or *creates* a *sub-part* of it.
<!--ID: 1780758285606-->
END

START
Basic
Write the CSS to insert a red asterisk before every element with class `required`.
Back: `.required::before { content: "* "; color: red; }` — `::before`/`::after` render nothing without a `content` property.
<!--ID: 1780758285611-->
END

START
Basic
What does `:nth-child(2n)` select, and how would you target the FIRST item specifically?
Back: `:nth-child(2n)` selects every 2nd element (the even ones); `2n+1` or `odd` gets the odd ones. The first item is `:first-child` (or `:nth-child(1)`).
<!--ID: 1780758285623-->
END

START
Basic
What's the difference between `:focus` and `:focus-visible`, and why prefer the latter for outlines?
Back: `:focus` matches on *any* focus, including mouse clicks (often producing an unwanted ring). `:focus-visible` matches only when the browser heuristically decides a focus ring is warranted (typically keyboard navigation) — better UX.
<!--ID: 1780758285631-->
END

START
Basic
Write a selector that matches every button that does NOT have the class `primary`.
Back: `button:not(.primary)` — `:not()` is the negation pseudo-class.
<!--ID: 1780758285637-->
END

START
Basic
Which pseudo-element styles the greyed-out hint text inside an empty input?
Back: `::placeholder` — e.g. `input::placeholder { color: #999; }`.
<!--ID: 1780758285642-->
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
