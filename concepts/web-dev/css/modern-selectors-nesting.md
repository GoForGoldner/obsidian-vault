---
tags: [css, web-dev, fundamentals]
category: web-dev
related: [css-selectors-specificity, pseudo-classes-elements, cascade-inheritance]
---

## Description
Modern CSS adds powerful selectors. **`:is()`** matches any selector in its list and takes the **highest** specificity among them. **`:where()`** is identical but always contributes **zero** specificity — great for low-priority resets. **`:has()`** is the long-awaited "parent selector": it matches an element that *contains* something (`.card:has(img)`). **Native nesting** lets you write child rules inside a parent rule using `&` for the parent reference — no preprocessor needed.

## Examples
```css
/* :is() — collapse repetition (specificity = the heaviest argument) */
:is(h1, h2, h3) a { color: inherit; }

/* :where() — zero specificity, easy to override later */
:where(ul, ol) { margin: 0; padding: 0; }

/* :has() — style a parent based on its children */
.card:has(img) { padding: 0; }          /* cards that contain an image */
label:has(+ input:required)::after { content: " *"; }

/* Native nesting with & */
.btn {
  background: blue;
  &:hover { background: navy; }
  & .icon { margin-right: 6px; }
}
```

## Related Topics
- [[css-selectors-specificity|Selectors & Specificity]]
- [[pseudo-classes-elements|Pseudo-classes & Elements]]
- [[cascade-inheritance|Specificity]]
- :is / :where / :has
- Native CSS nesting (&)

## Cards

```anki
START
Basic
`:is()` and `:where()` group selectors identically — so what's the one critical difference?
Back: Specificity. `:is()` takes the **highest** specificity of its arguments. `:where()` always contributes **zero** specificity — ideal for resets/defaults you want easy to override.
<!--ID: 1780758285694-->
END

START
Basic
What does `:has()` let you do that was impossible in CSS before it, and write a selector for "a card that contains an image."
Back: Select an element based on its descendants/contents — the long-missing "parent selector." `.card:has(img)`.
<!--ID: 1780758285700-->
END

START
Basic
Rewrite this with native nesting: `.btn { background: blue; } .btn:hover { background: navy; }`
Back: `.btn { background: blue; &:hover { background: navy; } }` — `&` refers to the parent selector.
<!--ID: 1780758285706-->
END

START
Basic
Write a single selector that applies `color: inherit` to links inside any of h1, h2, or h3, without repeating the rule three times.
Back: `:is(h1, h2, h3) a { color: inherit; }`
<!--ID: 1780758285711-->
END

START
Basic
Why is `:where()` the better choice for a CSS reset like removing default list margins?
Back: It adds zero specificity, so your later real styles override it effortlessly without needing to match or exceed the reset's specificity — no escalation.
<!--ID: 1780758285718-->
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
