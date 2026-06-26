---
tags: [javascript, web-dev, scope]
category: web-dev
related: [types-and-coercion, functions-and-arrows, closures]
---

## Description
JS has three declaration keywords: `let` and `const` are **block-scoped** (like Java locals), while `var` is **function-scoped** and leaks out of `if`/`for` blocks. All three are *hoisted* (their declarations are moved to the top of their scope at parse time), but `let`/`const` sit in the **Temporal Dead Zone** until their line runs, so touching them early throws a `ReferenceError`, whereas `var` reads as `undefined`. `const` only blocks **reassignment of the binding** — it is not Java's `final` for object contents: a `const` object's properties can still mutate. Default to `const`, use `let` when you must reassign, and never use `var` in new code.

## Examples
### Block scope vs function scope
```js
function demo() {
  if (true) {
    var a = 1;   // function-scoped: escapes the if-block
    let b = 2;   // block-scoped: dies at the closing brace
  }
  console.log(a); // 1
  console.log(b); // ReferenceError: b is not defined
}
```

### Temporal Dead Zone
```js
console.log(x); // undefined  -- var is hoisted AND initialized to undefined
var x = 5;

console.log(y); // ReferenceError -- in the TDZ until the let line executes
let y = 5;
```

### const blocks the binding, not the value
```js
const user = { name: "Ada" };
user.name = "Grace"; // OK -- mutating the object is allowed
user = {};           // TypeError -- cannot reassign a const binding

const nums = [1, 2];
nums.push(3);        // OK -- [1, 2, 3]
```

## Related Topics
- [[types-and-coercion|Types & Coercion]]
- [[closures|Closures]]
- [[functions-and-arrows|Functions & Arrows]]

## Cards

```anki
START
Basic
In JS, which declaration keyword is function-scoped (not block-scoped), and what's the consequence inside an `if` block?
Back: `var`. A `var` declared inside an `if`/`for` block leaks out and is visible in the whole enclosing function; `let`/`const` would be confined to the block.
<!--ID: 1782407009305-->
END

START
Basic
You read a `let` variable on a line *before* its declaration runs. What happens, and what is this zone called?
Back: A `ReferenceError` is thrown. The variable is in the Temporal Dead Zone (TDZ) from the start of the scope until its declaration line executes.
<!--ID: 1782407009310-->
END

START
Basic
A `var` is read before its declaration line executes. What value comes back and why?
Back: `undefined`. `var` declarations are hoisted and auto-initialized to `undefined`, so the read succeeds (unlike `let`/`const`, which throw).
<!--ID: 1782407009315-->
END

START
Basic
A Java dev assumes `const` means deeply immutable like `final`. What does `const` actually guarantee?
Back: Only that the *binding* can't be reassigned. The referenced object/array can still be mutated (`obj.x = 1`, `arr.push(...)` are fine).
<!--ID: 1782407009319-->
END

START
Basic
What's the default choice between `let`, `const`, and `var` in modern JS, and when do you switch?
Back: Default to `const`. Use `let` only when you must reassign. Never use `var` in new code.
<!--ID: 1782407009323-->
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
