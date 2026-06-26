---
tags: [javascript, web-dev, json, http, fetch]
category: web-dev
related: [async-await, async-promises, error-handling, template-literals]
---

## Description
`JSON.stringify(value)` serializes a JS value to a JSON string; `JSON.parse(text)` does the reverse. Both take extras: `stringify` accepts a **replacer** (filter/transform keys) and a **space** arg for pretty-printing; functions and `undefined` are silently dropped. `fetch(url)` is the modern browser/Node HTTP API and returns a **promise of a `Response`**. The big gotcha for everyone: `fetch` **only rejects on network failure** — a 404 or 500 still *resolves*, so you must check `res.ok` (true for 200–299) yourself. The body is read asynchronously with another promise: `await res.json()` parses JSON, `res.text()` for raw text. For writes, pass an options object with `method`, `headers` (set `Content-Type`), and a `body` (usually `JSON.stringify(...)`).

## Examples
### JSON serialize / parse
```js
const obj = { id: 1, name: "Ada", token: "secret" };

JSON.stringify(obj);                       // '{"id":1,"name":"Ada","token":"secret"}'
JSON.stringify(obj, ["id", "name"]);       // replacer array -> only those keys
JSON.stringify(obj, null, 2);              // pretty-print with 2-space indent

const back = JSON.parse('{"id":1,"name":"Ada"}'); // -> object
```

### GET with res.ok check
```js
async function getUser(id) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`); // 404/500 don't reject!
  return res.json();                                  // returns a promise
}
```

### POST with headers + body
```js
const res = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Bo" }),  // body must be a string (or FormData/Blob)
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const created = await res.json();
```

## Related Topics
- [[async-await|Async / Await]]
- [[async-promises|Promises & the Event Loop]]
- [[error-handling|Error Handling]]

## Cards

```anki
START
Basic
Gotcha: does `fetch` reject its promise on an HTTP 404 or 500?
Back: No. `fetch` only rejects on network failure. 4xx/5xx still resolve, so you must check `res.ok` (true for status 200–299) yourself.
<!--ID: 1782407009203-->
END

START
Basic
After `const res = await fetch(url)`, how do you get the parsed JSON body, and what does that call return?
Back: `await res.json()`. Reading the body is itself async — `res.json()` returns a promise of the parsed value.
<!--ID: 1782407009207-->
END

START
Basic
What do the 2nd and 3rd args of `JSON.stringify(value, replacer, space)` do?
Back: `replacer` filters/transforms keys (array of keys, or a function). `space` (e.g. `2`) pretty-prints with that indent. `JSON.stringify(obj, null, 2)` is the common pretty form.
<!--ID: 1782407009212-->
END

START
Basic
Write a fetch POST sending a JSON object `data`.
Back: `fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })` — body must be a string.
<!--ID: 1782407009217-->
END

START
Basic
Gotcha: what happens to functions or `undefined` values when you `JSON.stringify` an object?
Back: They're silently dropped (omitted from object output; become `null` inside arrays). JSON has no representation for them.
<!--ID: 1782407009221-->
END

START
Basic
What kind of object does `fetch(url)` resolve to, and is the body available immediately on it?
Back: A `Response` object. The body is not parsed yet — you must call an async reader like `.json()` or `.text()` (each returns a promise).
<!--ID: 1782407009225-->
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
