---
tags: [css, web-dev, layout, fundamentals]
category: web-dev
related: [box-model, flexbox, css-grid, css-positioning, display-none-vs-visibility-hidden]
---

## Description
`display` is the single most important layout property — it sets how a box behaves. It has an **outer** role (how the box participates in its parent: `block` stacks vertically and fills width; `inline` flows with text and ignores width/height) and an **inner** role (how its children lay out: `flow`, `flex`, `grid`). `inline-block` is the hybrid that flows inline yet respects width/height/margins. `none` removes the element entirely. `flow-root` makes a box contain its floats (modern clearfix).

## Examples
```css
.block  { display: block; }         /* full width, stacks, respects w/h */
.inline { display: inline; }        /* flows with text, IGNORES width/height */
.chip   { display: inline-block; }  /* flows inline BUT respects width/height */
.row    { display: flex; }          /* flex container */
.grid   { display: grid; }          /* grid container */
.gone   { display: none; }          /* removed from layout AND a11y tree */
.bfc    { display: flow-root; }     /* contains floats (clearfix) */
```

## Related Topics
- [[box-model|Box Model]]
- [[flexbox|Flexbox]]
- [[css-grid|CSS Grid]]
- [[display-none-vs-visibility-hidden|display:none vs visibility:hidden]]
- inline-block / flow-root / BFC

## Cards

```anki
START
Basic
You set `width` and `height` on an inline element (like a `<span>`) and nothing changes. Why, and what display value fixes it while keeping it in the text flow?
Back: `display: inline` ignores width/height (and top/bottom margins). Switch to `display: inline-block` — it still flows inline but now respects box dimensions.
<!--ID: 1780758285464-->
END

START
Basic
Explain the "outer" vs "inner" display roles with an example.
Back: Outer = how the box sits in its parent (`block` vs `inline`). Inner = how its children are laid out (`flow`/`flex`/`grid`). `display: flex` means block-level outer + flex inner; children become flex items.
<!--ID: 1780758285470-->
END

START
Basic
What's the difference between `display: block` and `display: inline` for flow and sizing?
Back: `block` starts on a new line, fills available width, and respects width/height/all margins. `inline` flows within a line alongside text, sizes to its content, and ignores width/height and vertical margins.
<!--ID: 1780758285476-->
END

START
Basic
What does `display: flow-root` do, and what classic hack does it replace?
Back: It establishes a new block formatting context so the element fully contains its floated children (the parent no longer collapses). It's the modern, one-line replacement for the `::after { clear: both }` clearfix.
<!--ID: 1780758285481-->
END

START
Basic
When you apply `display: flex` or `display: grid` to a parent, what happens to its direct children?
Back: They become flex items / grid items and are laid out by that container's rules. Their own `display` is partly overridden (e.g. inline children start behaving like blockified flex items).
<!--ID: 1780758285487-->
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
