---
tags: [java, oop, enums, singleton]
category: java
related: [sealed-classes, records, interfaces-and-default-methods, nested-classes, equals-hashcode-tostring]
---

## Description
An `enum` defines a fixed set of named constants, each a **singleton** instance created once by the JVM. Because the instances are unique and final, `==` and `equals()` behave identically for enum constants, and an enum is the cleanest way to write a thread-safe singleton. Every enum implicitly extends `java.lang.Enum`, which is why an enum **cannot extend any class** — but it *can* implement interfaces. The exam leans on the implicit API: `values()`, `valueOf(String)`, `ordinal()`, and `name()`.

Enums are full classes: they may declare fields, methods, and constructors (constructors are **implicitly `private`** and run once per constant). Each constant may also supply a **constant-specific body**, which is how you give each constant its own behavior — including implementing an `abstract` method declared on the enum. For collections keyed by enums, prefer `EnumSet` and `EnumMap`, which are backed by bit-vectors/arrays and far more efficient than hash-based collections.

## Examples
### Fields, private constructor, constant-specific abstract method
```java
enum Planet {
    EARTH(5.97e24, 6.37e6) { @Override double surfaceGravity() { return 9.81; } },
    MARS (6.42e23, 3.39e6) { @Override double surfaceGravity() { return 3.71; } };

    private final double mass, radius;
    Planet(double mass, double radius) {   // implicitly private; runs once per constant
        this.mass = mass; this.radius = radius;
    }
    abstract double surfaceGravity();        // each constant must provide a body
}
```

### Implicit API
| Member | Returns | Notes |
| --- | --- | --- |
| `values()` | `E[]` | static; fresh array of constants in declaration order |
| `valueOf(String)` | `E` | static; **throws `IllegalArgumentException`** if no match (and `NullPointerException` on `null`) |
| `name()` | `String` | the exact identifier, `final` — don't override |
| `ordinal()` | `int` | zero-based position; avoid persisting it (reorders break) |

### switch on an enum — labels are unqualified
```java
String describe(Planet p) {
    return switch (p) {
        case EARTH -> "home";   // NOT Planet.EARTH — labels are bare constant names
        case MARS  -> "red";
    };  // exhaustive over all constants: no default needed
}
```

### Enum singleton + EnumSet/EnumMap
```java
enum Registry { INSTANCE; private final Map<String,Object> store = new HashMap<>(); }
Registry r = Registry.INSTANCE;   // serialization-safe, thread-safe singleton

EnumSet<Planet> rocky = EnumSet.of(Planet.EARTH, Planet.MARS);   // bit-vector backed
EnumMap<Planet,String> notes = new EnumMap<>(Planet.class);      // array backed
```

## Related Topics
- [[singleton]] — enum is the recommended singleton implementation
- [[sealed-classes]] — the other way to model a closed set of types
- [[switch]] — enum switch labels are unqualified; can be exhaustive
- [[interfaces-and-default-methods]] — enums can implement interfaces
- [[java-set-and-map]] — `EnumSet` / `EnumMap` specializations

## Cards

```anki
START
Basic
What does `Enum.valueOf("NOPE")` throw when no constant matches? And on `null`?
Back: `IllegalArgumentException` for a non-matching name.<br>`NullPointerException` if the name is `null`.<br>Contrast `ordinal()`/`name()`, which never throw.
<!--ID: 1781902681491-->
END

START
Basic
Why is an enum the preferred way to write a singleton?
Back: Each constant is a single JVM-created instance — inherently thread-safe and serialization-safe (no reflection/clone/deserialize attacks).<br>`enum Registry { INSTANCE; }` is the whole pattern.
<!--ID: 1781902681498-->
END

START
Basic
Can an enum extend a class? Implement an interface?
Back: Extend a class: **no** — it implicitly extends `java.lang.Enum`.<br>Implement interfaces: **yes**.<br>This is the same "already has a superclass" reason records can't extend either.
<!--ID: 1781902681505-->
END

START
Basic
You want each enum constant to behave differently for one method. How?
Back: Declare the method `abstract` on the enum and give each constant a **constant-specific body**:<br>`EARTH { double g() { return 9.81; } }`<br>The compiler forces every constant to supply an implementation.
<!--ID: 1781902681511-->
END

START
Basic
What visibility does an enum constructor have, and how often does it run?
Back: Implicitly (and only) **`private`**.<br>It runs **once per constant**, when that constant is created during class initialization.
<!--ID: 1781902681519-->
END

START
Basic
In a `switch (planet)`, how do you write the case labels?
Back: Unqualified constant names: `case EARTH ->`, **not** `case Planet.EARTH`.<br>Qualifying them is a compile error in a traditional enum switch.
<!--ID: 1781902681527-->
END

START
Basic
You're mapping/setting keyed by enum values — which collections, and why?
Back: `EnumMap` and `EnumSet`.<br>They're backed by an array / bit-vector indexed by `ordinal()`, so they're faster and lower-overhead than `HashMap`/`HashSet`.
<!--ID: 1781902681534-->
END

START
Basic
Why avoid persisting `ordinal()` to a database?
Back: `ordinal()` is the constant's position in declaration order.<br>Reordering or inserting constants silently shifts every value — store `name()` instead.
<!--ID: 1781902681541-->
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
