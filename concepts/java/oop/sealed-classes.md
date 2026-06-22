---
tags: [java, oop, sealed, type-hierarchy]
category: java
related: [records, enums, interfaces-and-default-methods, nested-classes, equals-hashcode-tostring]
---

## Description
A `sealed` class or interface (finalized in Java 17) restricts *which* types may extend or implement it, listed in a `permits` clause. The point is to lock down a type hierarchy so the compiler — and the reader — knows the complete set of subtypes. This is the foundation for **exhaustive `switch`**: when the compiler can see every permitted subtype, a `switch` over them needs **no `default`** branch, and adding a new subtype later turns formerly-complete switches into compile errors until you handle the new case.

The hard rule the exam tests: every permitted subclass must itself declare its openness — it must be `final`, `sealed`, or `non-sealed`. A permitted type must also live in the **same module** as the sealed parent (or, in the unnamed module, the **same package**). The `permits` clause may be omitted only when all subclasses are in the same source file. Sealing composes well with **records**, which are implicitly `final` and so are valid permitted subtypes with no extra keyword.

## Examples
### Sealed hierarchy with all three subtype kinds
```java
public sealed interface Shape permits Circle, Square, Polygon { }

public final class Circle implements Shape { double r; }          // closed
public sealed class Polygon implements Shape permits Triangle { } // sealed further
public final class Triangle extends Polygon { }
public non-sealed class Square implements Shape { }               // re-opened: anyone may extend Square
```

### Permitted-subtype modifier rules
| Subtype declares | Meaning |
| --- | --- |
| `final` | no further subclassing (records qualify automatically) |
| `sealed ... permits` | further restricted to a new explicit list |
| `non-sealed` | hierarchy re-opened below this point — anyone may extend |
| *(none of the above)* | **compile error** |

### Exhaustive switch — no default needed
```java
static double area(Shape s) {
    return switch (s) {              // compiler knows the permitted set is complete
        case Circle c   -> Math.PI * c.r * c.r;
        case Square sq  -> 1.0;
        case Polygon p  -> 2.0;
        // no `default` required; adding a 4th permitted Shape breaks this until handled
    };
}
```

### Implicit `permits` (same file)
```java
// permits clause may be omitted when subclasses share the source file
sealed interface Expr {
    record Lit(int v) implements Expr { }
    record Add(Expr l, Expr r) implements Expr { }
}
```

## Related Topics
- [[records]] — implicitly `final`, ideal permitted subtypes
- [[enums]] — another closed set of types/values
- [[pattern-matching]] — sealed + record patterns = exhaustive deconstruction
- [[interfaces-and-default-methods]]
- [[modules]]

## Cards

```anki
START
Basic
A class is `sealed ... permits A, B`. What must `A` and `B` each declare?
Back: Each permitted subtype must be exactly one of: `final`, `sealed` (with its own `permits`), or `non-sealed`.<br>Anything else is a **compile error** — sealing must be propagated explicitly.
<!--ID: 1781902681755-->
END

START
Basic
Why use `sealed` instead of just leaving a class open?
Back: To **control the type hierarchy** — fix the complete set of subtypes.<br>Enables **exhaustive `switch`** with no `default`, and makes adding a subtype a compile-time prompt to update all switches.
<!--ID: 1781902681763-->
END

START
Basic
What does `non-sealed` do to a permitted subtype?
Back: It **re-opens** the hierarchy below that type — any class may now extend it.<br>It is the escape hatch that lets a sealed family have an open branch.
<!--ID: 1781902681770-->
END

START
Basic
Where must permitted subclasses live relative to the sealed type?
Back: In the **same module**.<br>In the unnamed module (no `module-info`), they must be in the **same package**.<br>If all subtypes share the source file, the `permits` clause may be omitted entirely.
<!--ID: 1781902681777-->
END

START
Basic
You `switch` over a sealed type and the compiler complains a case is missing — but you have a `default`. Why prefer removing default?
Back: With no `default`, the compiler enforces **exhaustiveness**: a new permitted subtype later becomes a compile error here.<br>A `default` silently swallows the new case at runtime instead.
<!--ID: 1781902681784-->
END

START
Basic
Can a record be a permitted subtype of a sealed interface without extra keywords?
Back: Yes — records are **implicitly `final`**, which satisfies the "final / sealed / non-sealed" requirement automatically.<br>This is why sealed-interface + record families are idiomatic.
<!--ID: 1781902681791-->
END

START
Basic
Can interfaces be sealed?
Back: Yes — `sealed interface Shape permits ...`.<br>Permitted implementors/sub-interfaces follow the same final/sealed/non-sealed rule as classes.
<!--ID: 1781902681798-->
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
