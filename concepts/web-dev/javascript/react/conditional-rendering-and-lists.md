---
tags: [react, web-dev, jsx, lists]
category: web-dev
related: [jsx, components-and-props, usestate, arrays-higher-order]
---

## Description
Since JSX braces only hold expressions, you do conditionals with **expressions**, not statements: the `&&` short-circuit (`cond && <X/>`) renders `<X/>` only when `cond` is truthy, and a **ternary** (`cond ? <A/> : <B/>`) picks between two. Returning `null` from a component renders nothing. To render a collection you `.map` an array to an array of elements — React accepts arrays of elements as children. Each element in such a list **must** have a stable, unique `key` prop. The key is how React matches old elements to new ones across re-renders; without it (or with a bad key like the array index) React can reuse the wrong DOM node, corrupting input state and animations. **Gotcha:** `&&` with a number `0` renders the literal `0` (it's not removed), so guard with a real boolean.

## Examples

### Conditional rendering: && and ternary
```tsx
function Inbox({ count }: { count: number }) {
  return (
    <div>
      {count > 0 && <span>You have {count} messages</span>}{/* && short-circuit */}
      {count > 0 ? <Badge n={count} /> : <span>All clear</span>}
      {/* GOTCHA: {count && <X/>} renders "0" when count===0. Use count > 0 && ... */}
    </div>
  );
}
```

### Rendering a list with keys
```tsx
function TodoList({ todos }: { todos: { id: string; text: string }[] }) {
  return (
    <ul>
      {todos.map((t) => (
        <li key={t.id}>{t.text}</li> // key = stable unique id, NOT the array index
      ))}
    </ul>
  );
}
```

## Related Topics
- [[jsx|JSX]]
- [[components-and-props|Components & Props]]
- [[usestate|useState]]
- [[arrays-higher-order|Array Higher-Order Methods]]

## Cards

```anki
START
Basic
You write `{count && <Banner/>}` and when count is 0 the page shows a stray "0". Why, and what's the fix?
Back: `0 && x` evaluates to `0`, and React renders the number 0 as text. Use an explicit boolean: `{count > 0 && <Banner/>}`.
<!--ID: 1782407009768-->
END

START
Basic
How do you render "either A or B" inside JSX, given you can't use an `if` statement there?
Back: Use a ternary expression: `{cond ? <A/> : <B/>}`. For "render X or nothing" use `{cond && <X/>}`.
<!--ID: 1782407009771-->
END

START
Basic
You map an array to `<li>` elements. Why does React require a `key` on each, and what makes a good key?
Back: The key lets React match elements between renders so it reuses/reorders the right DOM nodes. Use a stable, unique id from the data — not the array index (which breaks on insert/reorder).
<!--ID: 1782407009774-->
END

START
Basic
What's the concrete bug from using the array index as a `key` in a reorderable/editable list?
Back: On insert/reorder/delete, indices shift, so React maps new data onto the wrong DOM nodes — input focus, text, and component state get attached to the wrong row.
<!--ID: 1782407009778-->
END

START
Basic
How do you make a component render nothing at all?
Back: Return `null` (or `false`/`undefined`). React renders nothing for those. Useful for "show this component only sometimes."
<!--ID: 1782407009781-->
END

START
Basic
How do you turn an array of data into a list of React elements?
Back: Use `.map`: `items.map(item => <Row key={item.id} ... />)`. JSX accepts an array of elements as children.
<!--ID: 1782407009784-->
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
