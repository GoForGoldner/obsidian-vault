---
tags: [java, streams, lambdas, method-references]
category: java
related: [functional-interfaces, stream-api, collectors, optional]
---

## Description
A lambda is an anonymous implementation of a functional interface. It has no type of its own; the compiler infers its type from the *target type* — the functional interface expected at that position (assignment, method argument, return). The same lambda `x -> x.length()` can implement different interfaces depending on context. A lambda may capture local variables, but only ones that are *effectively final* (assigned once and never reassigned). This restriction exists because the captured value is copied at capture time; allowing reassignment would create a confusing mismatch between the lambda's snapshot and the live variable, and the JVM cannot safely share a mutable local across the lambda's lifetime.

A critical, frequently tested point: inside a lambda, `this` refers to the *enclosing instance*, not to the lambda object. This differs from an anonymous inner class, where `this` is the inner class instance. Method references are shorthand for lambdas that just call one method. The four forms — static, bound instance, unbound instance, and constructor — look similar but bind the receiver differently, and choosing the wrong form is a common exam trap.

## Examples
### Lambda syntax and target typing
```java
Runnable r = () -> System.out.println("hi");          // () -> void
Comparator<String> byLen = (a, b) -> a.length() - b.length();
Function<String, Integer> len = s -> s.length();      // expression body
Function<String, Integer> len2 = s -> { return s.length(); }; // block body needs return
// (String s) -> ... // explicit type also legal; var-typed params allowed too: (var s) -> ...
```

### Effectively-final capture
```java
int base = 10;            // never reassigned => effectively final
Function<Integer, Integer> add = x -> x + base; // OK
// base = 20;             // would make capture ILLEGAL: "variable used in lambda
                          // should be final or effectively final"
```

### `this` inside a lambda vs anonymous class
```java
class Widget {
    String name = "widget";
    Runnable lambda    = () -> System.out.println(this.name); // this == the Widget
    Runnable anonClass = new Runnable() {
        public void run() { System.out.println(this); }       // this == the Runnable
    };
}
```

### The four method-reference forms
| Form | Syntax | Equivalent lambda |
| --- | --- | --- |
| Static | `Integer::parseInt` | `s -> Integer.parseInt(s)` |
| Bound instance | `str::indexOf` | `c -> str.indexOf(c)` (receiver fixed) |
| Unbound instance | `String::toUpperCase` | `s -> s.toUpperCase()` (first arg is receiver) |
| Constructor | `ArrayList::new` | `() -> new ArrayList<>()` |

```java
List<String> names = new ArrayList<>(List.of("bo", "al", "cy"));
names.sort(String::compareTo);          // unbound: (a,b) -> a.compareTo(b)
names.forEach(System.out::println);      // bound: receiver is System.out
Supplier<List<String>> maker = ArrayList::new; // constructor ref
Function<String, Integer> p = Integer::parseInt; // static ref
```

## Related Topics
- [[functional-interfaces]]
- [[stream-api]]
- [[collectors]]
- [[optional]]

## Cards

```anki
START
Basic
What determines the type of a lambda expression?
Back: The **target type** — the functional interface expected at that position.<br>A lambda has no standalone type; `s -> s.length()` could be a `Function<String,Integer>` or a `ToIntFunction<String>` depending on context.<br>If the target type is ambiguous, the code won't compile.
<!--ID: 1781902681329-->
END

START
Basic
Why can a lambda only capture *effectively final* local variables?
Back: The local's value is **copied** when the lambda is created, so the language forbids reassigning it to avoid a confusing snapshot-vs-live mismatch.<br>"Effectively final" = assigned once, never reassigned (no `final` keyword required).<br>Instance/static fields are not captured this way and *can* be mutated.
<!--ID: 1781902681335-->
END

START
Basic
Gotcha: what does `this` refer to inside a lambda?
Back: The **enclosing instance**, not the lambda itself.<br>This differs from an anonymous inner class, where `this` is the inner class object.<br>So a lambda can read/write the enclosing object's fields via `this.field`.
<!--ID: 1781902681339-->
END

START
Basic
Distinguish unbound (`String::toUpperCase`) from bound (`str::toUpperCase`) instance method refs.
Back: **Unbound** `String::toUpperCase`: receiver is supplied as the **first argument** — `s -> s.toUpperCase()`.<br>**Bound** `str::toUpperCase`: receiver is the already-known object `str` — `() -> str.toUpperCase()`.<br>Unbound = type name before `::`; bound = a specific instance before `::`.
<!--ID: 1781902681343-->
END

START
Basic
You see `ArrayList::new`. What kind of method reference is it and what does it mean?
Back: A **constructor reference**.<br>`ArrayList::new` is `() -> new ArrayList<>()` (matches a `Supplier`).<br>With args it matches a `Function`/`BiFunction`, e.g. `String[]::new` is `IntFunction<String[]>` for array creation in `toArray`.
<!--ID: 1781902681348-->
END

START
Basic
When can you NOT use a method reference and must use a lambda instead?
Back: When the body does more than a single direct call — e.g. you transform an argument, chain calls, or pass a literal.<br>`s -> s.trim().toUpperCase()` and `x -> x + 1` cannot be method references.<br>A method ref must map the lambda's parameters one-to-one onto one method's arguments/receiver.
<!--ID: 1781902681352-->
END

START
Basic
Why does `(a, b) -> a.compareTo(b)` shorten to `String::compareTo` but not `a::compareTo`?
Back: Because both `a` and `b` are lambda parameters: `a` becomes the **receiver** (unbound) and `b` the argument.<br>That's the unbound form `String::compareTo`.<br>`a::compareTo` would bind to one specific instance and only take `b`.
<!--ID: 1781902681357-->
END

START
Basic
Lambda gotcha: which block-body lambdas need an explicit `return`?
Back: Any lambda using `{ }` braces.<br>`x -> x + 1` returns implicitly; `x -> { return x + 1; }` must use `return`.<br>A block-body lambda for a non-void interface that falls off the end without returning won't compile.
<!--ID: 1781902681362-->
END

START
Basic
Why pass `this::search` (not `search(key)`) to `map.computeIfAbsent(key, fn)`?
Back: The 2nd arg is a `Function` — a value the method calls **later, only on a miss**.<br>`this::search` is that function (≡ `k -> this.search(k)`); `search(key)` **invokes it now** and yields the result, not a function — won't type-check and defeats the lazy point.<br>Method ref = "*how* to compute it"; a call = "the *already-computed* answer".
<!--ID: 1781990693220-->
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
