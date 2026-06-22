---
tags: [java, oop, interfaces, default-methods]
category: java
related: [nested-classes, sealed-classes, records, enums, equals-hashcode-tostring]
---

## Description
Since Java 8, interfaces are far more than abstract method lists. A **`default` method** has a body and is inherited by implementors, letting an interface evolve without breaking existing classes. A **`static` method** belongs to the interface itself — call it as `MyInterface.helper()`; it is **not inherited** by implementing classes or sub-interfaces. Since Java 9, an interface may also have **`private` (and `private static`) methods**, used purely to share code among default/static methods without exposing it. Remember that interface fields are always **`public static final`** constants implicitly, and methods without a body are implicitly `public abstract`.

When a class inherits two conflicting `default` methods with the same signature from different interfaces — the **diamond problem** — the code does not compile until the class **overrides** the method. Inside that override you may delegate with the explicit syntax `InterfaceName.super.method()`. The exam also tests interface-vs-abstract-class: a class can implement many interfaces but extend only one (abstract) class; abstract classes can hold instance state and any-visibility constructors/fields, while interfaces hold only constants and behavior. Reach for an interface to define a capability/role; reach for an abstract class to share state plus a partial implementation.

## Examples
### default, static, private interface methods
```java
interface Greeter {
    String name();                          // implicitly public abstract

    default String greet() {                // has body; inherited by impls
        return prefix() + name();           // calls a private helper
    }
    static Greeter of(String n) {           // called as Greeter.of(...), NOT inherited
        return () -> n;
    }
    private String prefix() { return "Hello, "; }   // Java 9+: shared, hidden helper

    String CONST = "x";                     // implicitly public static final
}
```

### Diamond problem — must override, may delegate with `super`
```java
interface A { default String id() { return "A"; } }
interface B { default String id() { return "B"; } }

class C implements A, B {
    @Override public String id() {
        return A.super.id() + B.super.id();   // explicit disambiguation -> "AB"
    }
    // Omitting this override is a COMPILE ERROR: inherits unrelated defaults for id()
}
```

### Interface vs abstract class
| Aspect | Interface | Abstract class |
| --- | --- | --- |
| Multiple inheritance | Yes (implement many) | No (extend one) |
| Instance fields / state | No (only `public static final` constants) | Yes |
| Constructors | No | Yes |
| Method bodies | `default` / `static` / `private` | any |
| Member visibility | `public` (private only for helpers) | any |
| Use when | defining a capability/role | sharing state + partial impl |

## Related Topics
- [[functional-interface]] — exactly one abstract method; target of a lambda
- [[lambda]]
- [[nested-classes]] — anonymous classes commonly implement interfaces
- [[sealed-classes]] — interfaces can be `sealed`
- [[abstract-class]]

## Cards

```anki
START
Basic
Is an interface `static` method inherited by implementing classes?
Back: **No.** A `static` interface method is called on the interface itself — `MyInterface.helper()`.<br>It is not visible on implementors or sub-interfaces.<br>Contrast `default` methods, which *are* inherited.
<!--ID: 1781902681609-->
END

START
Basic
A class implements two interfaces with the same-signature `default` method. What happens?
Back: **Compile error** until the class **overrides** the method.<br>Inside the override, delegate explicitly with `A.super.id()` / `B.super.id()`.<br>This is the diamond problem's resolution rule.
<!--ID: 1781902681616-->
END

START
Basic
What modifiers does `int CONST = 5;` declared in an interface implicitly have?
Back: `public static final`.<br>All interface fields are constants — you cannot declare interface instance state.
<!--ID: 1781902681623-->
END

START
Basic
What were `private` interface methods (Java 9+) added for?
Back: To **share code among `default`/`static` methods** without exposing it as part of the API.<br>`private static` helpers serve the static methods; instance `private` helpers serve the defaults.
<!--ID: 1781902681630-->
END

START
Basic
When choose an abstract class over an interface?
Back: When you need **instance state, constructors, or non-public members** shared across subtypes.<br>Interface = capability/role and multiple inheritance; abstract class = shared state + partial implementation, single inheritance.
<!--ID: 1781902681637-->
END

START
Basic
What is the implicit signature of `String name();` inside an interface?
Back: `public abstract String name();`.<br>A bodyless interface method is always public and abstract — implementors must provide it (or inherit a default).
<!--ID: 1781902681643-->
END

START
Basic
Syntax to call a specific super-interface's default from an overriding method?
Back: `InterfaceName.super.method()` — e.g. `A.super.id()`.<br>Note it's `Interface.super`, not plain `super`, which refers to the class hierarchy.
<!--ID: 1781902681650-->
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
