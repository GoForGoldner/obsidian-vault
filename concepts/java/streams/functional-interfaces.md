---
tags: [java, streams, functional-interfaces, lambdas]
category: java
related: [lambdas-and-method-references, stream-api, collectors, optional]
---

## Description
A *functional interface* is an interface with exactly one abstract method (the SAM — Single Abstract Method). That single method is what a lambda or method reference targets. The optional `@FunctionalInterface` annotation does not create the property; it just makes the compiler reject the interface if it does not have exactly one abstract method. On the exam, the key trap is counting abstract methods correctly: `default` and `static` methods do not count, and crucially, abstract redeclarations of `public` methods of `java.lang.Object` (`equals`, `hashCode`, `toString`) do **not** count against the SAM rule.

The `java.util.function` package supplies the standard shapes you will see all over the Stream and Collector APIs: `Supplier`, `Consumer`, `Function`, `Predicate`, plus arity/operator variants and primitive specializations that avoid autoboxing. Many of them ship `default` combinator methods (`andThen`, `compose`, `and`, `or`, `negate`) so you can build pipelines without writing new lambdas. Knowing which interface has which abstract method name (`get`, `accept`, `apply`, `test`) is a frequent recognition question.

## Examples
### Core functional interfaces
| Interface | Abstract method | Shape |
| --- | --- | --- |
| `Supplier<T>` | `T get()` | `() -> T` |
| `Consumer<T>` | `void accept(T)` | `T -> void` |
| `Function<T,R>` | `R apply(T)` | `T -> R` |
| `Predicate<T>` | `boolean test(T)` | `T -> boolean` |
| `UnaryOperator<T>` | `T apply(T)` | `T -> T` (extends `Function<T,T>`) |
| `BinaryOperator<T>` | `T apply(T,T)` | `(T,T) -> T` (extends `BiFunction<T,T,T>`) |
| `BiFunction<T,U,R>` | `R apply(T,U)` | `(T,U) -> R` |
| `BiConsumer<T,U>` | `void accept(T,U)` | `(T,U) -> void` |
| `BiPredicate<T,U>` | `boolean test(T,U)` | `(T,U) -> boolean` |

### Primitive specializations (avoid boxing)
| Interface | Abstract method | Shape |
| --- | --- | --- |
| `IntSupplier` | `int getAsInt()` | `() -> int` |
| `IntPredicate` | `boolean test(int)` | `int -> boolean` |
| `IntFunction<R>` | `R apply(int)` | `int -> R` |
| `ToIntFunction<T>` | `int applyAsInt(T)` | `T -> int` |
| `IntUnaryOperator` | `int applyAsInt(int)` | `int -> int` |

### Combinator default methods
```java
Function<Integer, Integer> times2 = x -> x * 2;
Function<Integer, Integer> plus3  = x -> x + 3;

times2.andThen(plus3).apply(5); // 5*2=10, then +3 => 13
times2.compose(plus3).apply(5); // 5+3=8,  then *2 => 16

Predicate<String> nonEmpty = s -> !s.isEmpty();
Predicate<String> shortStr = s -> s.length() < 5;
nonEmpty.and(shortStr).test("hi");   // true
nonEmpty.negate().test("");          // true

Consumer<String> log   = System.out::println;
Consumer<String> store = list::add;
log.andThen(store).accept("x");      // prints, then stores
```

### A custom functional interface may declare Object methods
```java
@FunctionalInterface
interface MyTransform {
    String apply(String in);          // the single abstract method
    boolean equals(Object o);         // OK: Object method, does NOT count
    String toString();                // OK: Object method, does NOT count
    default MyTransform trimmed() {   // default: does NOT count
        return in -> apply(in).trim();
    }
}
```

## Related Topics
- [[lambdas-and-method-references]]
- [[stream-api]]
- [[collectors]]
- [[optional]]
- [[java-list]]

## Cards

```anki
START
Basic
What exactly makes an interface a *functional interface*?
Back: It has exactly **one abstract method** (the SAM).<br>`default` and `static` methods don't count, and `@FunctionalInterface` is optional — it only makes the compiler enforce the rule.<br>The annotation documents intent and catches accidental extra abstract methods.
<!--ID: 1781902681277-->
END

START
Basic
Gotcha: does declaring `equals`/`toString` abstractly break a `@FunctionalInterface`?
Back: No.<br>Abstract redeclarations of public `java.lang.Object` methods (`equals`, `hashCode`, `toString`) are **excluded** from the SAM count.<br>So an interface can declare one "real" abstract method plus these and still be functional — because every implementing class already inherits `Object`'s versions.
<!--ID: 1781902681281-->
END

START
Basic
Match the abstract method name: `Supplier`, `Consumer`, `Function`, `Predicate`.
Back: `Supplier.get()`<br>`Consumer.accept(t)`<br>`Function.apply(t)`<br>`Predicate.test(t)`<br>Memorize these — recognition questions hinge on the method name.
<!--ID: 1781902681286-->
END

START
Basic
What's the difference between `Function.andThen(g)` and `Function.compose(g)`?
Back: `f.andThen(g)` runs **f first, then g**: `g(f(x))`.<br>`f.compose(g)` runs **g first, then f**: `f(g(x))`.<br>`andThen` reads left-to-right; `compose` reads right-to-left.
<!--ID: 1781902681293-->
END

START
Basic
You need `int -> boolean` without boxing. Which functional interface?
Back: `IntPredicate` (method `boolean test(int)`).<br>Use primitive specializations (`IntPredicate`, `IntFunction`, `ToIntFunction`, `IntUnaryOperator`) to avoid autoboxing in hot loops and primitive streams.<br>`Predicate<Integer>` would box every value.
<!--ID: 1781902681300-->
END

START
Basic
How do `UnaryOperator<T>` and `BinaryOperator<T>` relate to `Function`/`BiFunction`?
Back: `UnaryOperator<T> extends Function<T,T>` — same input and output type.<br>`BinaryOperator<T> extends BiFunction<T,T,T>` — both args and result are `T`.<br>They're just convenience names used by APIs like `List.replaceAll` and `reduce`.
<!--ID: 1781902681307-->
END

START
Basic
Which combinator methods do `Predicate` and `Consumer` provide?
Back: `Predicate`: `and`, `or`, `negate` (and static `isEqual`, `not`).<br>`Consumer`: `andThen` (runs both consumers on the same input, in order).<br>These are `default` methods, so they return composed instances without a new lambda.
<!--ID: 1781902681314-->
END

START
Basic
What's the abstract method of `ToIntFunction<T>` vs `IntFunction<R>`?
Back: `ToIntFunction<T>`: `int applyAsInt(T t)` — object in, primitive `int` out.<br>`IntFunction<R>`: `R apply(int value)` — primitive `int` in, object out.<br>"To" means the result is the primitive; the plain name means the input is the primitive.
<!--ID: 1781902681321-->
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
