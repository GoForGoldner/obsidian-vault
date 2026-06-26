---
tags: [javascript, web-dev, this]
category: web-dev
related: [functions-and-arrows, closures, objects-and-prototypes]
---

## Description
The #1 trap for Java devs: in JS, `this` is **not** the enclosing class instance — it's determined **at call time** by *how* the function is invoked, not where it's defined. Four binding rules, in priority order: **(1) `new`** — `this` is the freshly created object; **(2) explicit** — `call`/`apply`/`bind` set `this` to their first argument; **(3) implicit** — `obj.method()` sets `this` to `obj` (the thing left of the dot); **(4) default** — a plain `fn()` call gets `undefined` in strict mode (or `globalThis` in sloppy mode). The killer consequence: extracting a method (`const f = obj.method; f()`) **loses** the `this` binding. **Arrow functions** ignore all four rules — they capture `this` lexically from the surrounding scope at definition time, which is exactly why they're the fix for callbacks. `call(thisArg, ...args)` and `apply(thisArg, argsArray)` invoke immediately; `bind(thisArg)` returns a new permanently-bound function.

## Examples
### The four binding rules
```js
function show() { return this; }

const o = { name: "o", show };
o.show();              // implicit: this === o
const f = o.show; f(); // default: this === undefined (strict mode) -- binding lost!
new show();            // new: this === a brand-new object
show.call({ name: "x" }); // explicit: this === { name: "x" }
```

### The Java-dev gotcha: lost `this` in a callback
```js
class Timer {
  constructor() { this.secs = 0; }
  startBroken() {
    setInterval(function () { this.secs++; }, 1000); // this is NOT the Timer -> NaN
  }
  startFixed() {
    setInterval(() => { this.secs++; }, 1000);       // arrow captures lexical this -> works
  }
}
```

### call vs apply vs bind
```js
function intro(greeting, punct) { return `${greeting}, ${this.name}${punct}`; }
const p = { name: "Ada" };

intro.call(p, "Hi", "!");        // "Hi, Ada!"  -- args listed individually
intro.apply(p, ["Hi", "!"]);     // "Hi, Ada!"  -- args as an array
const bound = intro.bind(p);     // returns a new function permanently bound to p
bound("Hey", ".");               // "Hey, Ada."
```

## Related Topics
- [[functions-and-arrows|Functions & Arrows]]
- [[closures|Closures]]
- [[objects-and-prototypes|Objects & Prototypes]]

## Cards

```anki
START
Basic
A Java dev assumes `this` refers to the class instance. In JS, what actually decides what `this` is?
Back: How the function is *called* (call site), not where it's defined. `this` is bound at call time, not lexically (except for arrow functions).
<!--ID: 1782407009329-->
END

START
Basic
Name the 4 `this` binding rules in priority order.
Back: 1) `new` (new object), 2) explicit `call`/`apply`/`bind` (the given arg), 3) implicit `obj.method()` (the object left of the dot), 4) default plain call (`undefined` in strict mode / global in sloppy).
<!--ID: 1782407009333-->
END

START
Basic
You write `const f = obj.method; f();`. Why does `this` break inside `f`?
Back: Detaching the method loses the implicit binding. A plain `f()` call uses the default rule, so `this` is `undefined` (strict) instead of `obj`.
<!--ID: 1782407009337-->
END

START
Basic
What's the one thing about arrow functions and `this` that fixes the Java-dev callback gotcha?
Back: Arrow functions don't get their own `this` — they capture it lexically from the enclosing scope at definition. So a callback arrow keeps the surrounding `this` (e.g. the instance) instead of being re-bound at call time.
<!--ID: 1782407009342-->
END

START
Basic
Difference between `fn.call(obj, a, b)` and `fn.apply(obj, [a, b])`?
Back: Both invoke immediately with `this = obj`; `call` takes arguments listed individually, `apply` takes them as a single array.
<!--ID: 1782407009346-->
END

START
Basic
What does `fn.bind(obj)` return, and how does it differ from `call`?
Back: It returns a *new* function permanently bound to `obj` (and optionally pre-set args) without invoking it. `call` invokes right away; `bind` defers invocation.
<!--ID: 1782407009350-->
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
