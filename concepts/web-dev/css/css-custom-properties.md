---
tags: [css, web-dev, fundamentals]
category: web-dev
related: [cascade-inheritance, css-colors, css-functions]
---

## Description
Custom properties (a.k.a. **CSS variables**) let you store a value once and reuse it: declare `--name: value` and read it with `var(--name)`. Unlike Sass variables, they're **live at runtime** — they cascade, inherit, can be overridden per-selector, and can be read/changed with JavaScript. The conventional home for globals is the `:root` selector. `var()` accepts a fallback as a second argument. This is the backbone of theming (e.g. light/dark mode).

## Examples
```css
:root {
  --brand: #a78bfa;
  --space: 8px;
}

.btn {
  background: var(--brand);
  padding: var(--space) calc(var(--space) * 2);
}

/* Fallback if the variable is undefined */
.x { color: var(--accent, hotpink); }

/* Theming: override the same variable in a scope */
.card.dark { --brand: #1e1e1e; }   /* children's var(--brand) updates live */
```

## Related Topics
- [[cascade-inheritance|Cascade & Inheritance]]
- [[css-colors|Colors (theming)]]
- [[css-functions|calc() with variables]]
- :root
- var() fallback / JS interop

## Cards

```anki
START
Basic
Write the CSS to define a global color variable and use it as a button's background.
Back: `:root { --brand: #a78bfa; }` then `.btn { background: var(--brand); }`
<!--ID: 1780758285435-->
END

START
Basic
How do CSS custom properties fundamentally differ from Sass/preprocessor variables?
Back: CSS custom properties are **live at runtime** — they cascade, inherit, can be scoped/overridden per selector, and are readable/writable from JavaScript. Sass variables are compiled away to static values before the browser ever sees them.
<!--ID: 1780758285439-->
END

START
Basic
Write a `var()` call that falls back to `hotpink` if `--accent` isn't defined.
Back: `color: var(--accent, hotpink);` — the second argument is the fallback.
<!--ID: 1780758285444-->
END

START
Basic
Why is `:root` the conventional place to declare global custom properties?
Back: `:root` matches the `<html>` element (with slightly higher specificity than `html`), so variables declared there inherit down into every element — making them effectively global.
<!--ID: 1780758285450-->
END

START
Basic
How do you implement a dark theme by overriding a single variable, and why does it "just work" for descendants?
Back: Re-declare the variable in a scoped selector, e.g. `.dark { --brand: #1e1e1e; }`. Because custom properties inherit and resolve at use-time, every descendant's `var(--brand)` recomputes to the new value automatically.
<!--ID: 1780758285457-->
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
