---
tags: [javascript, web-dev, modules, esm]
category: web-dev
related: [async-await, json-and-fetch, functions-and-arrows, objects-and-prototypes]
---

## Description
ES Modules (ESM) are the standard module system: each file is its own scope, and you explicitly `export` what's public and `import` what you need. There are two flavors of export: **named** (many per file, imported by exact name in `{ }`) and **default** (at most one per file, imported under any name without braces). `import` statements are **hoisted and static** — paths must be string literals so tooling can resolve the dependency graph ahead of time; for conditional/lazy loading use **dynamic `import()`**, which returns a promise. The older Node system, **CommonJS**, uses `require()` and `module.exports` and loads synchronously; modern code is ESM, but you'll still meet CommonJS in older Node packages. Gotcha for Java devs: imports are **live bindings** (you import the variable, not a snapshot of its value), and the default export is just a named export called `default` under the hood.

## Examples
### Named vs default
```js
// math.js
export const PI = 3.14159;          // named
export function add(a, b) { return a + b; }   // named
export default function square(x) { return x * x; } // default (one max)

// consumer.js
import square, { PI, add } from "./math.js";  // default first, then named in {}
import { add as plus } from "./math.js";      // rename a named import
import * as math from "./math.js";            // namespace: math.add, math.PI, math.default
```

### Dynamic import (lazy / conditional)
```js
async function loadChart() {
  const { renderChart } = await import("./chart.js"); // promise -> module namespace
  renderChart();
}
```

### ESM vs CommonJS (brief)
```js
// CommonJS (older Node): synchronous, dynamic
const fs = require("fs");
module.exports = { add };
// vs ESM: static, async-capable, the modern default
import fs from "node:fs";
export { add };
```

## Related Topics
- [[async-await|Async / Await]]
- [[functions-and-arrows|Functions & Arrow Functions]]
- [[json-and-fetch|JSON & Fetch]]

## Cards

```anki
START
Basic
How many default exports can a module have, and how does importing a default differ from a named export?
Back: At most one default. Import it with any name and no braces (`import x from "./m"`); named imports use the exact name in braces (`import { x } from "./m"`).
<!--ID: 1782407009174-->
END

START
Basic
Write an import that brings in the default export of `./math.js` as `sq` plus the named export `PI`.
Back: `import sq, { PI } from "./math.js";` — default name comes first, named exports in braces after.
<!--ID: 1782407009178-->
END

START
Basic
Why must a static `import` path be a string literal, and what do you use for a path computed at runtime?
Back: Static imports are resolved ahead of execution to build the dependency graph, so the path can't be dynamic. Use `await import(expr)` (dynamic import) for runtime paths.
<!--ID: 1782407009183-->
END

START
Basic
What does `import * as utils from "./utils.js"` give you?
Back: A namespace object — every named export becomes a property (`utils.foo`), and the default is `utils.default`.
<!--ID: 1782407009187-->
END

START
Basic
Distinction: how do CommonJS and ESM differ in syntax and loading?
Back: CommonJS uses `require()` / `module.exports` and loads synchronously (older Node). ESM uses `import` / `export`, is static and async-capable, and is the modern default.
<!--ID: 1782407009193-->
END

START
Basic
What does dynamic `import("./m.js")` return?
Back: A promise that resolves to the module namespace object — so you `await` it and destructure the exports you need.
<!--ID: 1782407009198-->
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
