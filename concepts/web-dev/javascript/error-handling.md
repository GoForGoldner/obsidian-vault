---
tags: [javascript, web-dev, errors, exceptions]
category: web-dev
related: [async-await, async-promises, json-and-fetch, functions-and-arrows]
---

## Description
JS error handling looks like Java's — `try`/`catch`/`finally` and `throw` — but with key differences. There are **no checked exceptions** and **no `catch (TypeError e)` typed clauses**: `catch` takes a single binding and you discriminate inside with `instanceof` (or omit the binding entirely: `catch { }`). You can `throw` *any value* (a string, a number), but you should throw an `Error` (or subclass) so you get a `message` and a `stack`. Define custom errors by extending `Error`. Crucially, `throw` is **expression-level** in the language grammar's sense — but note it's a statement, not an expression you can assign; what's idiomatic is throwing inside expressions via helpers, and using `??`/`||` guards. In **async** code, a rejected promise *is* a thrown error: it's caught by `try/catch` around `await`, or by `.catch()` on the chain — but a `throw` inside a bare callback (e.g. `setTimeout`) escapes your `try` because it runs later on a fresh stack.

## Examples
### try / catch / finally + instanceof
```js
try {
  const data = JSON.parse(input);   // throws SyntaxError on bad JSON
  use(data);
} catch (err) {
  if (err instanceof SyntaxError) console.warn("bad json");
  else throw err;                   // re-throw what you can't handle
} finally {
  cleanup();                        // always runs (even on return/throw)
}
```

### Custom Error subclass
```js
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";  // set name so logs/stack read correctly
    this.status = status;     // attach structured data
  }
}
throw new HttpError(404, "Not found");
```

### Async errors
```js
async function load() {
  try {
    const res = await fetch("/x");
    if (!res.ok) throw new HttpError(res.status, "failed");
    return await res.json();
  } catch (err) {            // catches both fetch rejections and our throw
    console.error(err);
  }
}
// Gotcha: a throw inside setTimeout's callback runs later and is NOT caught here.
```

## Related Topics
- [[async-await|Async / Await]]
- [[async-promises|Promises & the Event Loop]]
- [[json-and-fetch|JSON & Fetch]]

## Cards

```anki
START
Basic
JS has no typed catch clauses like Java's `catch (IOException e)`. How do you handle different error types?
Back: One `catch (err)` binding, then discriminate inside with `if (err instanceof SyntaxError)` etc., re-throwing what you can't handle.
<!--ID: 1782407009146-->
END

START
Basic
Why throw a `new Error("msg")` instead of `throw "msg"` even though both are legal?
Back: An `Error` object carries a `message`, a `name`, and a captured `stack` trace. A bare string has none of that, making debugging far harder.
<!--ID: 1782407009151-->
END

START
Basic
Write a custom error class `HttpError` carrying a `status`.
Back: `class HttpError extends Error { constructor(status, msg) { super(msg); this.name = "HttpError"; this.status = status; } }`
<!--ID: 1782407009155-->
END

START
Basic
When does the `finally` block run relative to a `return` or `throw` in the `try`?
Back: Always — after the try/catch completes, even when the try `return`s or throws. Used for cleanup that must happen regardless.
<!--ID: 1782407009160-->
END

START
Basic
Gotcha: a `throw` inside a `setTimeout(() => {...})` callback — is it caught by a surrounding `try/catch`?
Back: No. The callback runs later on a fresh stack, after the `try` has exited, so the error escapes. Handle it inside the callback (or use promises).
<!--ID: 1782407009164-->
END

START
Basic
In async code, how is a rejected promise related to a thrown error?
Back: They're the same mechanism — `await`ing a rejected promise throws, caught by `try/catch`; on a chain it's caught by `.catch()`.
<!--ID: 1782407009169-->
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
