---
tags: [javascript, web-dev, functions]
category: web-dev
related: [this-call-apply-bind, closures, destructuring-spread-rest, arrays-higher-order]
---

## Description
Functions in JS are **first-class values**: you assign them to variables, pass them as arguments, and return them. A **function declaration** (`function foo(){}`) is hoisted whole, so you can call it before its line; a **function expression** (`const foo = function(){}`) is not. **Arrow functions** (`x => x + 1`) are a terse expression form with implicit return for single expressions — but they differ semantically from regular functions: they don't bind their own `this`, `arguments`, or `super` (covered in the `this` note). Parameters support **defaults** (`function f(x = 1)`) and a **rest parameter** (`...args`) that collects remaining arguments into a real array — unlike Java varargs, it's an actual `Array`. An **IIFE** (Immediately Invoked Function Expression) runs a function the moment it's defined, historically used to create a private scope.

## Examples
### Declaration vs expression (hoisting differs)
```js
sayHi();              // works -- declarations are fully hoisted
function sayHi() {}

sayBye();             // TypeError: sayBye is not a function
var sayBye = function () {};  // only the var is hoisted, not the assignment
```

### Arrow function forms
```js
const square = x => x * x;            // implicit return, single param needs no parens
const add = (a, b) => a + b;          // multiple params need parens
const make = () => ({ ok: true });    // return an object literal -> wrap in parens
const log = msg => { console.log(msg); }; // block body -> explicit return needed
```

### Default params, rest params, first-class
```js
function greet(name = "world") {      // default applies only when arg is undefined
  return `Hello, ${name}`;
}
function sum(...nums) {               // rest: collects into a real Array
  return nums.reduce((a, n) => a + n, 0);
}
sum(1, 2, 3); // 6

const ops = [square, add];            // functions stored in an array (first-class)
```

### IIFE
```js
(function () {
  const secret = 42;   // not visible outside
  console.log(secret);
})(); // runs immediately
```

## Related Topics
- [[this-call-apply-bind|`this`, call, apply, bind]]
- [[closures|Closures]]
- [[destructuring-spread-rest|Destructuring, Spread & Rest]]
- [[arrays-higher-order|Arrays & Higher-Order Functions]]

## Cards

```anki
START
Basic
Why can you call a `function foo(){}` declaration before its line, but not a `const foo = function(){}` expression?
Back: Function declarations are fully hoisted (name + body). For an expression only the variable binding is hoisted; the assignment happens on its own line, so calling earlier fails.
<!--ID: 1782407009278-->
END

START
Basic
Write an arrow function `make` that returns the object literal `{ ok: true }`. What's the syntax gotcha?
Back: `const make = () => ({ ok: true });` — you must wrap the object in parentheses, otherwise `{}` is parsed as a function body.
<!--ID: 1782407009282-->
END

START
Basic
When does a default parameter value like `function f(x = 1)` actually get used?
Back: Only when the argument is `undefined` (omitted or explicitly `undefined`). Passing `null`, `0`, or `""` does NOT trigger the default.
<!--ID: 1782407009286-->
END

START
Basic
What does `...nums` as a function parameter do, and how does the result differ from Java varargs?
Back: It's a rest parameter that collects all remaining arguments into a real `Array` (so `.map`/`.reduce` work directly), unlike Java's array-typed varargs which feel separate.
<!--ID: 1782407009291-->
END

START
Basic
What is an IIFE and what was its classic purpose?
Back: An Immediately Invoked Function Expression — `(function(){ ... })()` — runs the moment it's defined. Classic use: create a private scope to avoid leaking variables into the global scope (largely replaced by modules/`let`).
<!--ID: 1782407009295-->
END

START
Basic
What does "functions are first-class" mean in JS, in concrete terms?
Back: Functions are values: you can assign them to variables, store them in arrays/objects, pass them as arguments, and return them from other functions.
<!--ID: 1782407009300-->
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
