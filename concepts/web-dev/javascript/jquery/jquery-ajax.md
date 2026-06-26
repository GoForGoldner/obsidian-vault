---
tags: [jquery, web-dev, ajax, http]
category: web-dev
related: [jquery-overview-and-selectors, jquery-events, jquery-dom-manipulation, json-and-fetch, http-requests]
---

## Description
Before `fetch` existed, jQuery's `$.ajax` was *the* way to make HTTP requests from the browser without a page reload (AJAX = Asynchronous JavaScript And XML, though it's almost always JSON now). `$.ajax(options)` is the full-control form; `$.get`, `$.post`, and `$.getJSON` are convenience shorthands. They return a **jqXHR** object (a Promise-like "thenable"), so you attach `.done(successFn)` / `.fail(errorFn)` / `.always(fn)` callbacks. A key contrast with `fetch`: jQuery **rejects on HTTP error statuses** (404/500 trigger `.fail`) and **auto-parses JSON** when the response looks like JSON — whereas `fetch` only rejects on network failure and makes you call `.json()` yourself. In modern code you should reach for `fetch` (or `axios`); `$.ajax` only shows up in legacy jQuery codebases. The `done`/`fail` callbacks predate native Promises but interop with `await`.

## Examples
### `$.ajax` — the full form
```js
$.ajax({
  url: '/api/users',
  method: 'POST',
  contentType: 'application/json',
  data: JSON.stringify({ name: 'Ada' }),
})
  .done((data, status, jqXHR) => console.log('ok', data))  // 2xx
  .fail((jqXHR, status, err) => console.error('failed', status))  // network OR 4xx/5xx
  .always(() => console.log('settled either way'));
```

### Shorthands
```js
$.get('/api/users', (data) => console.log(data));         // GET
$.post('/api/users', { name: 'Ada' }, (data) => {});      // POST form-encoded
$.getJSON('/api/users.json', (data) => console.log(data)); // GET + auto JSON.parse
// All return a jqXHR you can also .done()/.fail() on.
```

### The modern replacement — `fetch`
```js
// What you'd write today instead of $.getJSON:
const res = await fetch('/api/users');
if (!res.ok) throw new Error(res.status);   // fetch does NOT reject on 404/500
const data = await res.json();              // and you must parse JSON yourself
```

## Related Topics
- [[json-and-fetch|JSON & fetch (modern)]]
- [[http-requests|HTTP Requests]]
- [[jquery-overview-and-selectors|jQuery Overview & Selectors]]
- [[jquery-events|jQuery Events]]

## Cards

```anki
START
Basic
Distinction: how does `$.ajax`'s `.fail()` differ from `fetch`'s rejection behavior on a 404?
Back: jQuery **rejects (.fail fires)** on HTTP error statuses like 404/500. `fetch` only rejects on **network failure** — a 404 still resolves, so you must check `res.ok` yourself.
<!--ID: 1782407010052-->
END

START
Basic
What does `.done()` / `.fail()` / `.always()` attach to, and what object provides them?
Back: They attach success / error / settled callbacks to the **jqXHR** object returned by `$.ajax` and friends — a Promise-like thenable.
<!--ID: 1782407010057-->
END

START
Basic
What's the difference between `$.getJSON(url, cb)` and `$.get(url, cb)` for a JSON endpoint?
Back: `$.getJSON` forces the response to be parsed as JSON (`JSON.parse`). `$.get` auto-detects type and may or may not parse depending on the response content-type.
<!--ID: 1782407010060-->
END

START
Basic
You're in a modern codebase. Should you write `$.ajax` for a new HTTP call? What instead?
Back: No — use native `fetch` (or `axios`). `$.ajax` is legacy-only; you'd keep it for consistency in an existing jQuery codebase, not for new code.
<!--ID: 1782407010064-->
END

START
Basic
Why must `fetch` callers write `await res.json()` while `$.getJSON` doesn't?
Back: jQuery auto-parses the body into a JS object for you. `fetch` returns a Response whose body is read separately and asynchronously via `res.json()` (or `.text()`).
<!--ID: 1782407010067-->
END

START
Basic
Write a `$.post` that sends `{ name: 'Ada' }` to `/api/users` and logs the response.
Back: `$.post('/api/users', { name: 'Ada' }, (data) => console.log(data));` (sends form-encoded by default; use `$.ajax` with `contentType: 'application/json'` for a JSON body).
<!--ID: 1782407010070-->
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
