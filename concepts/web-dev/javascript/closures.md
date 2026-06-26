---
tags: [javascript, web-dev, closures]
category: web-dev
related: [functions-and-arrows, this-call-apply-bind, variables-scope-hoisting]
---

## Description
A **closure** is a function bundled together with references to the variables from the scope where it was *defined* — so an inner function keeps access to its outer function's locals even after the outer function has returned. Crucially it captures the **variable**, not a snapshot of its value, so later mutations are visible. Closures power **data privacy** (variables only the returned function can touch — JS's classic alternative to private fields), **stateful callbacks**, and partial application. The infamous gotcha: a `var` in a `for` loop is shared by all iterations because it's function-scoped, so closures created in the loop all see the final value; `let` creates a **fresh binding per iteration** and fixes it.

## Examples
### Counter with private state
```js
function makeCounter() {
  let count = 0;                 // private: no outside access
  return () => ++count;          // closure captures `count`
}
const next = makeCounter();
next(); // 1
next(); // 2  -- state persists between calls
```

### The classic loop gotcha: var vs let
```js
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);             // all closures share the SAME `i`
}
fns.map(f => f()); // [3, 3, 3]  -- i is 3 after the loop

for (let j = 0; j < 3; j++) {
  fns.push(() => j);             // `let` gives each iteration its own `j`
}
// those closures return 0, 1, 2
```

### Captures the variable, not a copy
```js
let msg = "hi";
const read = () => msg;          // captures the binding, not the value
msg = "bye";
read(); // "bye"  -- sees the updated value
```

## Related Topics
- [[functions-and-arrows|Functions & Arrows]]
- [[variables-scope-hoisting|Variables, Scope & Hoisting]]
- [[this-call-apply-bind|`this`, call, apply, bind]]

## Cards

```anki
START
Basic
Define a closure in one sentence.
Back: A function together with references to the variables from the scope where it was defined, keeping access to them even after that outer scope has returned.
<!--ID: 1782407009078-->
END

START
Basic
A loop builds 3 functions with `for (var i...) fns.push(() => i)`. What does calling them return, and why?
Back: `[3, 3, 3]`. `var i` is function-scoped, so all three closures capture the *same* `i`, which is `3` after the loop ends.
<!--ID: 1782407009082-->
END

START
Basic
How does switching that loop to `let i` change the closure behavior?
Back: `let` creates a fresh binding per iteration, so each closure captures its own copy — they return `0, 1, 2`.
<!--ID: 1782407009086-->
END

START
Basic
Do closures capture a snapshot of a variable's value or the variable itself? Prove it.
Back: The variable (binding) itself. `let m = "hi"; const r = () => m; m = "bye"; r()` returns `"bye"` — the later mutation is visible.
<!--ID: 1782407009090-->
END

START
Basic
How do you implement private/encapsulated state with a closure (vs Java private fields)?
Back: Declare a variable in an outer function and return an inner function that closes over it; nothing outside can read or reassign that variable — only the returned function can.
<!--ID: 1782407009093-->
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
