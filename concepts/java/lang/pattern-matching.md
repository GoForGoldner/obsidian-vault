---
tags: [java, pattern-matching, instanceof, switch, records, sealed]
category: java
related: [switch-expressions, arrays, exceptions]
---

## Description
Pattern matching tests a value's shape and, on success, binds it to a typed variable in one step. The pieces relevant to 1Z0-830 (Java SE 21) and current Java 26:

- **`instanceof` type pattern** — `o instanceof String s` — *finalized in Java 16* (JEP 394).
- **Record patterns / deconstruction** — `p instanceof Point(int x, int y)`, nestable — *finalized in Java 21* (JEP 440).
- **Pattern matching for `switch`** — type patterns, guards with `when`, `case null` — *finalized in Java 21* (JEP 441).

**Preview status (Java 26):** *Primitive types in patterns, `instanceof`, and `switch`* (matching/testing primitives like `instanceof int`, or `switch` on `long`/`double`/`float`/`boolean`) is **still a preview feature** in Java 26 — its 4th preview (JEP 530). It is NOT finalized and requires `--enable-preview`. Everything else below is finalized standard language. The hot exam topics are **flow scoping** (where a binding is in scope, including after a negated `instanceof`), **dominance ordering** (more specific cases must come first), and **exhaustiveness** with `sealed` types.

## Examples

```java
// instanceof type pattern + binding variable (finalized, Java 16)
Object o = "hello";
if (o instanceof String s) {
    System.out.println(s.length());   // 's' bound and in scope here
}

// Flow scoping with negation: 's' is in scope AFTER the guard because
// the 'return' means we only continue when the match succeeded.
void use(Object o) {
    if (!(o instanceof String s)) return;
    System.out.println(s.toUpperCase());  // legal: reachable only when o IS a String
}

// Short-circuit && also narrows scope
if (o instanceof String s && s.length() > 3) { /* s usable here */ }
```

```java
// Record patterns / deconstruction, including NESTED patterns (finalized, Java 21)
record Point(int x, int y) {}
record Line(Point from, Point to) {}

Object obj = new Line(new Point(0, 0), new Point(3, 4));

if (obj instanceof Line(Point(var x1, var y1), Point(var x2, var y2))) {
    // all four components bound by deconstruction
    System.out.println((x2 - x1) + "," + (y2 - y1));  // 3,4
}
```

```java
// Pattern matching for switch: type patterns, guarded patterns, null handling
sealed interface Shape permits Circle, Square, Rectangle {}
record Circle(double r) implements Shape {}
record Square(double side) implements Shape {}
record Rectangle(double w, double h) implements Shape {}

String describe(Shape s) {
    return switch (s) {
        case Circle c when c.r() > 10 -> "big circle";   // guarded: 'when' clause
        case Circle c                 -> "circle";       // unguarded fallback AFTER the guard
        case Square sq                -> "square side " + sq.side();
        case Rectangle(double w, double h) -> "rect " + (w * h);  // record pattern in switch
        // No default needed: Shape is sealed and every permitted type is covered (exhaustive).
    };
}

// null handling: a normal switch throws NPE on null; 'case null' opts in
String label(Object o) {
    return switch (o) {
        case null      -> "was null";       // without this, null would throw NPE
        case Integer i -> "int " + i;
        case String st -> "str " + st;
        default        -> "other";
    };
}
```

```java
// Dominance ordering: a more general pattern must NOT precede a more specific one
Object x = 42;
String bad = switch (x) {
    // case Object obj -> "any";   // would DOMINATE everything below -> compile error
    case Integer i -> "int";
    case Object obj -> "any";      // catch-all must come last
};
// 'case Circle c' before 'case Circle c when ...' is also an error:
// the unguarded case dominates the guarded one.
```

| Pattern feature | Example | Status (Java 26) |
| --- | --- | --- |
| `instanceof` type pattern | `o instanceof String s` | Final (Java 16) |
| Record pattern / nested | `Line(Point(var a, var b), ...)` | Final (Java 21) |
| Switch type patterns | `case String s ->` | Final (Java 21) |
| Guarded pattern (`when`) | `case Circle c when c.r() > 10 ->` | Final (Java 21) |
| `case null` | `case null ->` | Final (Java 21) |
| Sealed-type exhaustiveness | no `default` if all permitted covered | Final (Java 21) |
| Primitive patterns | `o instanceof int`, `switch` on `long` | **Preview** (JEP 530, 4th preview) |

## Related Topics
- [[switch-expressions]]
- [[arrays]]
- [[exceptions]]
- [[collections-framework]]

## Cards

```anki
START
Basic
What does `if (o instanceof String s)` give you over plain `instanceof`?
Back: It tests the type AND binds `s` to `o` cast to `String` in one step (finalized Java 16).<br>`s` is in scope only where the match is guaranteed to have succeeded — this is flow scoping.<br>Removes the manual cast and its `ClassCastException` risk.
<!--ID: 1781902680905-->
END

START
Basic
Why does `s` compile after this line?<br>`if (!(o instanceof String s)) return; s.length();`
Back: Flow scoping: the `return` means execution past the `if` is reachable only when `o` IS a `String`.<br>So `s` is definitely assigned and in scope after the guard.<br>The binding "leaks" forward exactly when it's provably safe.
<!--ID: 1781902680912-->
END

START
Basic
How do you deconstruct a record in a pattern, and can patterns nest?
Back: Record pattern: `obj instanceof Point(int x, int y)` binds components directly.<br>They nest: `Line(Point(var x1, var y1), Point(var x2, var y2))`.<br>Finalized in Java 21 (JEP 440); `var` infers each component's type.
<!--ID: 1781902680919-->
END

START
Basic
In a pattern switch, how do you add a condition to a case, and what's the ordering rule?
Back: Use a **guarded pattern**: `case Circle c when c.r() > 10 ->`.<br>The guarded case must come BEFORE the unguarded `case Circle c`, or the unguarded one dominates it (compile error).<br>`when` is a contextual keyword, only valid here.
<!--ID: 1781902680926-->
END

START
Basic
What is "dominance" in a pattern switch and what breaks if you get it wrong?
Back: A more general pattern that precedes a more specific one **dominates** it, making the later case unreachable -> compile error.<br>Order specific-to-general: e.g. `case Integer i` before `case Object o`.<br>An unguarded case also dominates a guarded case of the same type.
<!--ID: 1781902680933-->
END

START
Basic
How does a pattern `switch` handle `null`, and how does that differ from a classic switch?
Back: A classic switch throws `NullPointerException` on a null selector.<br>A pattern switch also NPEs unless you add `case null ->` (optionally `case null, default ->`).<br>So you opt into null handling explicitly.
<!--ID: 1781902680940-->
END

START
Basic
When can a pattern switch over a `sealed` type omit `default`?
Back: When every permitted subtype/record is covered — the compiler proves exhaustiveness.<br>Omitting `default` then turns a later new subtype into a compile error (a feature).<br>Same idea as enum exhaustiveness.
<!--ID: 1781902680946-->
END

START
Basic
As of Java 26, are primitive type patterns (e.g. `o instanceof int`, `switch` on `double`) standard or preview?
Back: Still **preview** — JEP 530, the 4th preview; requires `--enable-preview`.<br>Reference-type patterns, record patterns, guards, `case null`, and sealed exhaustiveness ARE finalized (Java 16/21).<br>Don't assume primitive patterns are GA on the exam.
<!--ID: 1781902680952-->
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
