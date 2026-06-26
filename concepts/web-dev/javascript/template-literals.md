---
tags: [javascript, web-dev, strings, syntax]
category: web-dev
related: [destructuring-spread-rest, functions-and-arrows, json-and-fetch]
---

## Description
Template literals are strings delimited by **backticks** `` ` `` instead of quotes. They support `${expression}` interpolation (any JS expression, not just variables) and **literal multiline** strings — the newlines you type are part of the string, so no `\n` concatenation. This replaces Java's `String.format` / `+` concatenation / text blocks all at once. A more advanced form, **tagged templates**, lets a function intercept the string parts and interpolated values before they're joined — used by libraries like styled-components and SQL/GraphQL helpers. Gotcha: interpolation calls `String()` on the value, so an object becomes `"[object Object]"` — interpolate a property, not the whole object.

## Examples
### Interpolation & multiline
```js
const name = "Ada", count = 3;
const msg = `Hi ${name}, you have ${count} item${count === 1 ? "" : "s"}.`;

// Multiline: newlines are literal, no \n needed
const html = `
  <li>${name}</li>
  <li>${count}</li>
`;

// Any expression works:
`Total: ${items.reduce((a, b) => a + b.price, 0)}`;
```

### Tagged templates (brief)
```js
// A tag fn receives (stringsArray, ...interpolatedValues)
function safe(strings, ...values) {
  return strings.reduce((out, s, i) =>
    out + s + (values[i] !== undefined ? encodeURIComponent(values[i]) : ""), "");
}
const url = safe`/search?q=${"a b&c"}`; // "/search?q=a%20b%26c"
// You'll mostly *consume* these (css`...`, gql`...`), rarely write them.
```

## Related Topics
- [[json-and-fetch|JSON & Fetch]]
- [[functions-and-arrows|Functions & Arrow Functions]]
- [[destructuring-spread-rest|Destructuring, Spread & Rest]]

## Cards

```anki
START
Basic
What character delimits a template literal, and what two things does it give you over a normal `"string"`?
Back: Backticks `` ` ``. You get `${...}` expression interpolation and literal multiline strings (typed newlines are part of the string).
<!--ID: 1782407009256-->
END

START
Basic
Can you put arbitrary expressions inside `${}`, or only variable names?
Back: Any JS expression — `${a + b}`, `${items.map(...).join(",")}`, ternaries, function calls. It's evaluated and `String()`-coerced.
<!--ID: 1782407009260-->
END

START
Basic
Gotcha: what does `` `Value: ${obj}` `` produce when `obj` is a plain object?
Back: `"Value: [object Object]"`. Interpolation coerces with `String()`. Interpolate a specific property or `JSON.stringify(obj)` instead.
<!--ID: 1782407009264-->
END

START
Basic
You see `` css`color: ${c}` `` — a function name immediately before a backtick string. What is this?
Back: A tagged template. The function receives the literal string segments and the interpolated values separately, letting it process them before joining.
<!--ID: 1782407009268-->
END

START
Basic
Write a template literal greeting `name` and pluralizing based on `count`.
Back: `` `Hi ${name}, ${count} item${count === 1 ? "" : "s"}` `` — ternary expressions are allowed inside `${}`.
<!--ID: 1782407009272-->
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
