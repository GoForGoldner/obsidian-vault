---
tags: [javascript, web-dev, async, promises]
category: web-dev
related: [async-await, json-and-fetch, error-handling, functions-and-arrows]
---

## Description
JS runs on a **single thread** with an **event loop**: there are no OS threads to block, so long work is done asynchronously and results arrive via callbacks. A `Promise` is an object representing a future value that is `pending`, then settles as `fulfilled` (with a value) or `rejected` (with an error) — exactly once. You consume it with `.then(onFulfilled)`, `.catch(onRejected)`, and `.finally(cleanup)`; each returns a new promise, so they chain. Unlike Java's `Future.get()`, you **never block** waiting — you register continuations. Combinators: `Promise.all` (all succeed, or reject on first failure), `Promise.allSettled` (wait for all, never rejects), `Promise.race` (first to settle wins). The key ordering rule: promise callbacks are **microtasks** that run after the current synchronous code finishes but **before** the next macrotask (like `setTimeout`).

## Examples
### Chaining, catch, finally
```js
fetchUser(id)
  .then(user => fetchOrders(user.id))   // return a promise -> flattened
  .then(orders => console.log(orders))
  .catch(err => console.error(err))     // catches any rejection above
  .finally(() => hideSpinner());        // always runs, no value passed
```

### Combinators
```js
// all: fail-fast, resolves to an array of results
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// allSettled: never rejects; each result is {status, value|reason}
const results = await Promise.allSettled([fetchA(), fetchB()]);
results.forEach(r => r.status === "fulfilled" ? use(r.value) : log(r.reason));

// race: settles with the first to settle (used for timeouts)
await Promise.race([work(), timeout(5000)]);
```

### Microtask vs macrotask ordering
```js
console.log("1");
setTimeout(() => console.log("4 (macrotask)"), 0);
Promise.resolve().then(() => console.log("3 (microtask)"));
console.log("2");
// Logs: 1, 2, 3, 4 — microtasks drain before the timer fires.
```

## Related Topics
- [[async-await|Async / Await]]
- [[json-and-fetch|JSON & Fetch]]
- [[error-handling|Error Handling]]

## Cards

```anki
START
Basic
JS is single-threaded, so how does it handle long-running work without freezing?
Back: An event loop runs async work; results arrive later via queued callbacks/promises. You never block the thread — you register continuations.
<!--ID: 1782407009038-->
END

START
Basic
What three states can a Promise be in, and how many times can it settle?
Back: `pending`, then either `fulfilled` (with a value) or `rejected` (with a reason). It settles exactly once and is then immutable.
<!--ID: 1782407009041-->
END

START
Basic
What's the difference between `Promise.all` and `Promise.allSettled` on failure?
Back: `all` rejects immediately on the first rejection (fail-fast). `allSettled` never rejects — it waits for all and gives `{status, value|reason}` per entry.
<!--ID: 1782407009044-->
END

START
Basic
When does `.finally()` run on a promise, and does it receive the resolved value?
Back: It runs after the promise settles regardless of success or failure (for cleanup). It receives no value and passes the original result through.
<!--ID: 1782407009048-->
END

START
Basic
A `setTimeout(fn, 0)` and a `Promise.resolve().then(fn2)` are both pending. Which callback runs first?
Back: `fn2`. Promise callbacks are microtasks, which fully drain before the next macrotask (the timer) runs.
<!--ID: 1782407009051-->
END

START
Basic
Why does returning a promise inside `.then(cb)` not nest into a promise-of-a-promise?
Back: `then` flattens (assimilates) a returned thenable, so the chain resolves to the inner value. This is what lets sequential `.then`s read like steps.
<!--ID: 1782407009054-->
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
