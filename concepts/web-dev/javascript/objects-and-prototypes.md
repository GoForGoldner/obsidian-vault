---
tags: [javascript, web-dev, objects, prototypes]
category: web-dev
related: [this-call-apply-bind, types-and-coercion, destructuring-spread-rest, equality-and-nullish]
---

## Description
JS objects are dynamic key/value maps with literal syntax `{ key: value }`. Modern shorthand: **property shorthand** (`{ name }` when a variable named `name` exists), **computed keys** (`{ [expr]: value }` to use a runtime value as the key), and **method shorthand** (`{ greet() {} }`). Inheritance is **prototypal, not classical**: every object has an internal link to a **prototype** object, and property lookups walk this **prototype chain** until found or it hits `null`. The `class` keyword is **syntactic sugar** over this — `extends` just sets up the prototype chain; there are no real classes underneath, just functions and prototype links. Iterate object data with `Object.keys()` (array of keys), `Object.values()`, and `Object.entries()` (array of `[key, value]` pairs), which pairs perfectly with `for...of` and destructuring.

## Examples
### Literals, shorthand, computed keys
```js
const name = "Ada", age = 36;
const field = "role";
const user = {
  name,                    // shorthand for name: name
  age,
  [field]: "engineer",     // computed key -> { role: "engineer" }
  greet() {                // method shorthand
    return `Hi, ${this.name}`;
  },
};
```

### Prototype chain
```js
const animal = { speak() { return "..."; } };
const dog = Object.create(animal); // dog's prototype is animal
dog.speak();                       // "..." -- found by walking up the chain
dog.hasOwnProperty("speak");       // false -- it lives on the prototype, not on dog
Object.getPrototypeOf(dog) === animal; // true
```

### class is sugar over prototypes
```js
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}
class Dog extends Animal {           // extends wires up the prototype chain
  speak() { return `${this.name} barks`; } // override
}
new Dog("Rex").speak(); // "Rex barks"
// Animal.prototype.speak still exists; Dog.prototype links to Animal.prototype.
```

### Iterating object data
```js
const scores = { math: 90, cs: 95 };
Object.keys(scores);    // ["math", "cs"]
Object.values(scores);  // [90, 95]
for (const [subject, score] of Object.entries(scores)) {
  console.log(subject, score); // destructure each [key, value] pair
}
```

## Related Topics
- [[this-call-apply-bind|`this`, call, apply, bind]]
- [[types-and-coercion|Types & Coercion]]
- [[destructuring-spread-rest|Destructuring, Spread & Rest]]
- [[equality-and-nullish|Equality & Nullish]]

## Cards

```anki
START
Basic
Write an object literal using property shorthand for existing variables `name` and `age`.
Back: `const u = { name, age };` — shorthand for `{ name: name, age: age }`.
<!--ID: 1782407009230-->
END

START
Basic
You need an object whose key comes from a variable `field` at runtime. Write it.
Back: `{ [field]: value }` — square brackets make it a computed key, evaluating `field` to produce the property name.
<!--ID: 1782407009234-->
END

START
Basic
How does JS resolve `dog.speak()` when `dog` has no own `speak` property?
Back: It walks the prototype chain — checks `dog`, then its prototype, then that prototype's prototype, etc., until it finds `speak` or reaches `null` (then `undefined`).
<!--ID: 1782407009238-->
END

START
Basic
A Java dev sees `class`/`extends` in JS. What's actually happening under the hood?
Back: `class` is syntactic sugar over prototypes. There are no real classes — `extends` just links one prototype object to another. Inheritance is prototypal, not classical.
<!--ID: 1782407009242-->
END

START
Basic
What do `Object.keys(obj)`, `Object.values(obj)`, and `Object.entries(obj)` each return?
Back: `keys` → array of the object's own enumerable keys; `values` → array of their values; `entries` → array of `[key, value]` pairs (great with `for...of` + destructuring).
<!--ID: 1782407009247-->
END

START
Basic
How do you check whether a property lives directly on an object vs. inherited from its prototype?
Back: `obj.hasOwnProperty("prop")` (or `Object.hasOwn(obj, "prop")`) — returns `true` only for own properties, `false` if it's found further up the prototype chain.
<!--ID: 1782407009250-->
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
