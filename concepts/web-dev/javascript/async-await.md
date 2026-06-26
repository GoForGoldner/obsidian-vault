---
tags: [javascript, web-dev, async, promises]
category: web-dev
related: [async-promises, json-and-fetch, error-handling, functions-and-arrows]
---

## Description
`async`/`await` is **syntactic sugar over promises** — it doesn't add new capability, it makes promise-based code read top-to-bottom like synchronous code. An `async` function **always returns a promise**, regardless of what you `return` inside it. `await` pauses that function until the awaited promise settles, yielding its resolved value (or throwing its rejection). Because rejections surface as thrown errors, you handle them with ordinary `try/catch` instead of `.catch()`. The classic gotcha for Java devs: `await` inside a `for` loop runs requests **serially** (each waits for the previous) — if they're independent, kick them off together and `await Promise.all(...)` for concurrency. **Top-level await** is allowed in ES modules (no wrapping `async` function needed). (For how the event loop / microtasks actually schedule this, see async-promises.)

## Examples
### Sequential reads with try/catch
```js
async function loadProfile(id) {
  try {
    const user = await fetchUser(id);      // pauses here until settled
    const orders = await fetchOrders(user.id);
    return { user, orders };               // wrapped in a Promise automatically
  } catch (err) {                          // catches any awaited rejection
    console.error("load failed", err);
    throw err;                             // re-throw to signal the caller
  }
}
```

### Serial vs concurrent (the key gotcha)
```js
// SLOW: each await blocks the next — total time = sum of all
for (const id of ids) {
  results.push(await fetchUser(id));
}

// FAST: start them all, then await together — total time = the slowest one
const results = await Promise.all(ids.map(id => fetchUser(id)));
```

### Top-level await (ES modules only)
```js
// At module top level, no enclosing async function:
const config = await fetch("/config.json").then(r => r.json());
```

## Related Topics
- [[async-promises|Promises & the Event Loop]]
- [[json-and-fetch|JSON & Fetch]]
- [[error-handling|Error Handling]]

## Cards

```anki
START
Basic
What does an `async` function return, even if its body does `return 42`?
Back: A Promise — here a promise that fulfills with `42`. `async` always wraps the return value (and a thrown error becomes a rejection).
<!--ID: 1782407009020-->
END

START
Basic
How do you handle a rejected promise when using `await` instead of `.catch()`?
Back: A regular `try/catch` — a rejected awaited promise throws, so `catch (err)` receives the rejection reason.
<!--ID: 1782407009023-->
END

START
Basic
Gotcha: you `await fetchUser(id)` inside a `for` loop over many ids. What's the performance problem and the fix?
Back: Requests run serially (each waits for the prior), so time = sum of all. If independent, use `await Promise.all(ids.map(fetchUser))` to run them concurrently.
<!--ID: 1782407009027-->
END

START
Basic
Does `async`/`await` give you any capability that plain promises lack?
Back: No — it's pure syntax sugar over promises. It only makes the same promise code read sequentially and lets you use `try/catch`.
<!--ID: 1782407009030-->
END

START
Basic
Where can you use `await` without wrapping it in an `async` function?
Back: At the top level of an ES module (top-level await). Not in CommonJS or inside a non-async function.
<!--ID: 1782407009034-->
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
