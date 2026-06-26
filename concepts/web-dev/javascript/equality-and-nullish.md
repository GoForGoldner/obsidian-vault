---
tags: [javascript, web-dev, equality]
category: web-dev
related: [types-and-coercion, objects-and-prototypes, variables-scope-hoisting]
---

## Description
JS has two equality operators: `===` (strict) compares without coercion, while `==` (loose) coerces operands to a common type first, producing surprises like `0 == ""` and `null == undefined` being `true`. **Always use `===` / `!==`**; the one accepted use of `==` is `x == null`, which checks for both `null` and `undefined` at once. JS distinguishes `null` (an intentional "no value", set by you) from `undefined` (the default for unassigned variables, missing properties, and missing arguments). Modern null-handling syntax: optional chaining `?.` short-circuits to `undefined` instead of throwing when the left side is `null`/`undefined`; the nullish coalescing operator `??` supplies a fallback **only** for `null`/`undefined` (unlike `||`, which also falls back on any falsy value like `0` or `""`); and `??=` assigns only when the target is currently nullish.

## Examples
### == vs === (the coercion trap)
```js
0 == "";          // true  -- both coerce toward 0
0 == "0";         // true
"" == "0";        // false -- no coercion between two strings
null == undefined;// true  -- the one useful loose check
null === undefined;// false
0 === "";         // false -- strict: different types, no coercion
```

### Optional chaining `?.`
```js
const city = user?.address?.city;   // undefined if user or address is null/undefined
user.profile?.getName?.();          // safely call only if it exists
arr?.[0];                           // optional indexing
// Short-circuits: if user is null, the whole chain returns undefined, no throw.
```

### `??` vs `||` and `??=`
```js
const port = config.port ?? 3000;   // 3000 only if port is null/undefined
const bad  = config.port || 3000;   // BUG: also 3000 when port is 0!

const count = 0;
count ?? 5;   // 0   -- 0 is not nullish, kept
count || 5;   // 5   -- 0 is falsy, replaced

settings.theme ??= "dark";          // assign "dark" only if theme is null/undefined
```

## Related Topics
- [[types-and-coercion|Types & Coercion]]
- [[objects-and-prototypes|Objects & Prototypes]]
- [[variables-scope-hoisting|Variables, Scope & Hoisting]]

## Cards

```anki
START
Basic
What's the practical rule for choosing `==` vs `===`, and the one accepted exception?
Back: Always use `===`/`!==` (no coercion). The one accepted `==` use is `x == null`, which matches both `null` and `undefined`.
<!--ID: 1782407009119-->
END

START
Basic
Conceptually, how does `null` differ from `undefined` in JS?
Back: `undefined` = a value was never assigned (unassigned var, missing property/argument). `null` = an intentional "no value" that you explicitly set.
<!--ID: 1782407009123-->
END

START
Basic
You see `?.` chained on a value: `user?.address?.city`. What does it do and what does it return if `user` is null?
Back: It short-circuits — if any link is `null`/`undefined`, the whole expression evaluates to `undefined` instead of throwing a TypeError. So it returns `undefined`.
<!--ID: 1782407009127-->
END

START
Basic
Why does `count ?? 5` differ from `count || 5` when `count` is `0`?
Back: `??` only falls back on `null`/`undefined`, so `0 ?? 5` is `0`. `||` falls back on any falsy value, so `0 || 5` is `5`. Use `??` for numeric/boolean defaults.
<!--ID: 1782407009132-->
END

START
Basic
Write the syntax to set `settings.theme` to `"dark"` only if it's currently null or undefined.
Back: `settings.theme ??= "dark";` (nullish assignment — leaves existing falsy-but-defined values like `""` untouched).
<!--ID: 1782407009137-->
END

START
Basic
Why is `loose == ` dangerous for defaulting config like `if (config.port == 0)` vs strict checks? (give a concrete == surprise)
Back: `==` coerces, so e.g. `0 == ""` is `true` and `0 == "0"` is `true`. These accidental matches make defaulting/branching unpredictable; `===` avoids them.
<!--ID: 1782407009141-->
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
