---
tags: [java, lang, var, type-inference]
category: java
related: [primitives-wrappers-autoboxing, strings-and-stringbuilder, generics, stream-api]
---

## Description
`var` (Java 10+, JEP 286) is local-variable type inference: the compiler infers the static type from the initializer. It is **not** dynamic typing — the variable still has one fixed compile-time type, you just don't write it. On the exam `var` shows up as "does this compile?" trap questions, because it is only legal in a narrow set of positions.

`var` is a *reserved type name*, not a keyword — you can still use `var` as a variable or method name (just not as a class name). Behavior is unchanged through Java 26.

## Examples
### Where `var` IS allowed
```java
var list = new ArrayList<String>();   // ArrayList<String>
for (var i = 0; i < 10; i++) { }       // i is int
for (var s : list) { }                  // s is String (for-each)
try (var in = Files.newInputStream(p)) { } // try-with-resources
```

### Where `var` is NOT allowed
| Position | Legal? | Why |
| --- | --- | --- |
| Local var with initializer | yes | type comes from initializer |
| for / for-each / try-with-resources var | yes | local, always initialized |
| Field (instance/static) | **no** | only *local* variables |
| Method parameter | **no** | no initializer to infer from |
| Method return type | **no** | not a local variable |
| `catch (var e)` | **no** | disallowed by JLS |
| Lambda param (all params `var`) | **yes** | JEP 323, Java 11+ |
| Lambda param (mix `var` + typed) | **no** | all-or-none |

### The gotchas
```java
var x = null;            // ERROR: cannot infer (no type for null)
var arr = {1, 2, 3};     // ERROR: array initializer needs a declared type
var arr2 = new int[]{1}; // OK
var n = 1;               // infers int (most specific), not long/Number
var f = (x, y) -> x + y; // ERROR: var on local needs an initializer with a type;
                         //        a bare lambda/method-ref has no target type
// lambda params:
BiFunction<Integer,Integer,Integer> g = (var a, var b) -> a + b; // OK
BiFunction<Integer,Integer,Integer> h = (var a, b) -> a + b;     // ERROR: all-or-none
```

## Related Topics
- [[primitives-wrappers-autoboxing]]
- [[generics]]
- [[strings-and-stringbuilder]]
- [[stream-api]]

## Cards

```anki
START
Basic
In which four local positions is `var` type inference legal?
Back: Local variable with an initializer.<br>`for` index and `for`-each loop variables.<br>`try`-with-resources resource variable.<br>Lambda parameters (only if **all** params use `var`).
<!--ID: 1781902681120-->
END

START
Basic
You write `var x = null;` — what happens and why?
Back: Compile error — `null` has no type, so nothing can be inferred.<br>`var` needs an initializer whose type the compiler can determine.
<!--ID: 1781902681127-->
END

START
Basic
Name positions where `var` is illegal even though they look like declarations.
Back: Fields, method parameters, method return types, and `catch` clauses.<br>`var` is for **local** variables only.
<!--ID: 1781902681134-->
END

START
Basic
`(var a, b) -> a + b` as a lambda — legal?
Back: No — lambda params are all-or-none on `var`.<br>Either every param uses `var` or none do; you cannot mix `var` with a bare/typed param.
<!--ID: 1781902681140-->
END

START
Basic
Is `var` a keyword? Can you name a variable `var`?
Back: It is a *reserved type name*, not a keyword.<br>`int var = 3;` is legal; only using `var` as a class/interface name is forbidden.
<!--ID: 1781902681147-->
END

START
Basic
`var n = 1;` — what type is `n`, and why does it matter?
Back: `int` — `var` infers the **most specific** type of the initializer, never a widened one.<br>It will not silently become `long`, `Number`, or `Object`.
<!--ID: 1781902681154-->
END

START
Basic
Why does `var arr = {1, 2, 3};` fail but `var arr = new int[]{1, 2, 3};` compile?
Back: A bare array initializer `{...}` only works when the array type is declared explicitly.<br>`var` has no declared type to anchor it, so you must write `new int[]{...}`.
<!--ID: 1781902681162-->
END

START
Basic
Does using `var` change runtime behavior or performance?
Back: No — it is pure compile-time inference.<br>The bytecode is identical to writing the explicit type; the variable is statically typed.
<!--ID: 1781902681169-->
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
