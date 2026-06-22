---
tags: [java, lang, generics, wildcards, type-erasure]
category: java
related: [primitives-wrappers-autoboxing, var-type-inference, strings-and-stringbuilder, collections-framework]
---

## Description
Generics give compile-time type safety to types and methods that are parameterized over a type variable `<T>`. They let collections and APIs be both reusable and statically checked, eliminating most casts. The exam focuses on **bounded** type parameters, **wildcards** (`?`, `? extends`, `? super`) and the PECS rule, and the consequences of **type erasure** — generics exist only at compile time and are erased to their bounds (or `Object`) in bytecode.

Because of erasure you cannot do `new T()`, `new T[]`, `instanceof T`, or use a primitive as a type argument. Behavior is unchanged through Java 26.

## Examples
### Type params, bounds, and generic methods
```java
// generic class
class Box<T> { private T v; T get() { return v; } void set(T v) { this.v = v; } }

// bounded type parameter: T must be Comparable to itself
static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}

// generic method syntax: <T> before the return type
static <T> T pick(T a, T b, boolean first) { return first ? a : b; }
String s = GenericsDemo.<String>pick("x", "y", true); // explicit witness (usually inferred)
```

### Wildcards and PECS
| Form | Name | Read? | Write? | Use for |
| --- | --- | --- | --- | --- |
| `List<?>` | unbounded | as `Object` | only `null` | don't care about the type |
| `List<? extends T>` | upper bound | yes (as `T`) | **no** | a **Producer** (you read T out) |
| `List<? super T>` | lower bound | as `Object` | yes (T or subtype) | a **Consumer** (you write T in) |

```java
// Producer Extends, Consumer Super
static double sum(List<? extends Number> src) {       // produces Numbers -> read
    double t = 0; for (Number n : src) t += n.doubleValue(); return t;
}
static void fill(List<? super Integer> dst) {         // consumes Integers -> write
    dst.add(1); dst.add(2);
}
```

### Type erasure limits
```java
// none of these compile:
// T t = new T();           // cannot instantiate a type variable
// T[] arr = new T[10];     // cannot create a generic array
// if (x instanceof T) {}   // cannot test an erased type
// List<int> li;            // no primitive type arguments — use List<Integer>

List<String> ls = new ArrayList<>();
List<Integer> li = new ArrayList<>();
System.out.println(ls.getClass() == li.getClass()); // true — both erase to ArrayList

@SafeVarargs                  // suppresses unchecked warning from generic varargs
static <T> List<T> of(T... xs) { return List.of(xs); }
```

## Related Topics
- [[collections-framework]]
- [[primitives-wrappers-autoboxing]]
- [[var-type-inference]]
- Bounded type parameters and `Comparable` / `Comparator`

## Cards

```anki
START
Basic
Write the syntax for a generic method that returns its type parameter.
Back: `static <T> T pick(T a, T b) { ... }`<br>The `<T>` goes **before** the return type; `T` is usually inferred from the arguments.
<!--ID: 1781902680784-->
END

START
Basic
What does `<T extends Comparable<T>>` express?
Back: A bounded type parameter — `T` must be a type comparable to itself.<br>It lets you call `a.compareTo(b)` inside the method while keeping callers type-safe.
<!--ID: 1781902680791-->
END

START
Basic
State the PECS rule and what it maps to.
Back: **Producer Extends, Consumer Super.**<br>`? extends T` when you only read T out (producer); `? super T` when you only write T in (consumer).
<!--ID: 1781902680797-->
END

START
Basic
From a `List<? extends Number>`, can you read? Can you add elements?
Back: Read yes — each element is a `Number`.<br>Add no (except `null`) — the exact element type is unknown, so the compiler rejects any insert.
<!--ID: 1781902680805-->
END

START
Basic
Into a `List<? super Integer>`, what can you add and what do reads give you?
Back: Add `Integer` (or any `Integer` subtype) safely.<br>Reads come back as `Object`, since the element type could be any supertype of `Integer`.
<!--ID: 1781902680812-->
END

START
Basic
What is type erasure, and what does `new ArrayList<String>().getClass() == new ArrayList<Integer>().getClass()` return?
Back: Generic type info is removed at compile time (erased to bounds/`Object`); the runtime has one raw class.<br>So the comparison is `true` — both are just `ArrayList`.
<!--ID: 1781902680819-->
END

START
Basic
Name three things erasure forbids inside a generic with type variable `T`.
Back: `new T()`, `new T[...]`, and `x instanceof T`.<br>At runtime `T` doesn't exist, so it can't be instantiated, arrayed, or type-checked. Also: no primitive type arguments.
<!--ID: 1781902680825-->
END

START
Basic
You get an "unchecked" warning from a generic varargs method. What is it warning about, and what annotation silences it?
Back: Heap pollution — a generic varargs param creates an array of an erased type that could hold a wrong type.<br>`@SafeVarargs` on a static/final/private method suppresses it once you've verified safety.
<!--ID: 1781902680833-->
END

START
Basic
Why use `List<Integer>` instead of `List<int>`?
Back: Type arguments must be reference types; primitives are not allowed.<br>You use the wrapper `Integer`, relying on autoboxing at the boundaries.
<!--ID: 1781902680840-->
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
