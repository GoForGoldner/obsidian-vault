---
tags: [java, oop, records, immutability]
category: java
related: [sealed-classes, enums, equals-hashcode-tostring, nested-classes, interfaces-and-default-methods]
---

## Description
A `record` (finalized in Java 16) is a transparent carrier for immutable data. From the header — `record Point(int x, int y)` — the compiler generates a `private final` field per component, a public accessor named like the component (`x()`, **not** `getX()`), a canonical (all-args) constructor, plus `equals`, `hashCode`, and `toString` derived from the components. This makes records the go-to "data class" on the 1Z0-830 exam, where the trap is usually a generated member you forgot the compiler already wrote.

Records are *implicitly final* and *cannot extend any class* (they already extend `java.lang.Record`), but they *can implement interfaces* and declare static members and extra instance methods. They are **shallowly immutable**: the references are final, but a mutable component (e.g. an array or `List`) can still be mutated through that reference. Records pair naturally with **record patterns** for deconstruction in `switch` and `instanceof`.

## Examples
### Anatomy of a record
```java
record Point(int x, int y) implements Comparable<Point> {
    // Compiler generates: private final int x, y;
    //                     Point(int x, int y) { this.x = x; this.y = y; }
    //                     int x(); int y();          // accessors, no "get"
    //                     equals/hashCode/toString over (x, y)

    static Point origin() { return new Point(0, 0); }   // static members OK
    double dist()         { return Math.hypot(x, y); }   // extra methods OK

    @Override public int compareTo(Point o) { return Integer.compare(x, o.x); }
}

Point p = new Point(3, 4);
System.out.println(p.x());     // 3      (accessor, not getX())
System.out.println(p);         // Point[x=3, y=4]   (generated toString)
```

### Compact canonical constructor (validate / normalize)
```java
record Range(int lo, int hi) {
    Range {                                   // no parameter list, no body assignments
        if (lo > hi) throw new IllegalArgumentException("lo > hi");
        lo = Math.max(lo, 0);                 // normalize; assigned to fields automatically
    }
}
// The compact form runs BEFORE the implicit this.lo = lo; this.hi = hi;
```

### Generated members summary
| Member | Form | Note |
| --- | --- | --- |
| Field | `private final <T> name;` | one per component, not reassignable |
| Accessor | `<T> name()` | named after component — never `getName()` |
| Canonical ctor | `R(<all components>)` | can be replaced by compact or normal form |
| `equals` / `hashCode` | over all components | structural equality |
| `toString` | `R[a=.., b=..]` | components in declaration order |

### Shallow immutability gotcha
```java
record Tags(List<String> values) { }
var t = new Tags(new ArrayList<>(List.of("a")));
t.values().add("b");   // allowed! the List itself is mutable
// Defensive copy in a compact ctor to truly freeze:
record SafeTags(List<String> values) {
    SafeTags { values = List.copyOf(values); }   // now unmodifiable
}
```

## Related Topics
- [[sealed-classes]] — records are common permitted subtypes for exhaustive `switch`
- [[record-patterns]] — deconstruct a record in `switch`/`instanceof`
- [[pattern-matching]]
- [[equals-hashcode-tostring]] — records auto-generate all three
- [[enums]] — the other "restricted" class kind
- [[immutability]]

## Cards

```anki
START
Basic
In a record `Point(int x, int y)`, how do you read `x`, and what is the method called?
Back: Call the accessor `p.x()` — **not** `getX()`.<br>The compiler names each accessor after its component.<br>The field itself is `private final` and not directly readable from outside.
<!--ID: 1781902681705-->
END

START
Basic
Which of equals, hashCode, toString, and a constructor does a record generate for you?
Back: All of them: canonical (all-args) constructor, an accessor per component, and structural `equals`/`hashCode`/`toString`.<br>You only write members you want to *replace* or *add*.
<!--ID: 1781902681712-->
END

START
Basic
Can a record extend a class? Can it implement interfaces? Can it be subclassed?
Back: Extend a class: **no** (it already extends `java.lang.Record`).<br>Implement interfaces: **yes**.<br>Subclassed: **no** — records are implicitly `final`.
<!--ID: 1781902681718-->
END

START
Basic
You need to validate/normalize record components in one place. Which constructor form?
Back: The **compact canonical constructor**: `Range { if (lo>hi) throw ...; lo = Math.max(lo,0); }`<br>No parameter list, no explicit field assignment — the `this.x = x;` runs automatically after your code.
<!--ID: 1781902681725-->
END

START
Basic
Are records immutable? What is the exact nuance?
Back: They are **shallowly** immutable.<br>Component references are `final`, but a mutable component (`List`, array) can still be mutated through its reference.<br>Use `List.copyOf(...)` in a compact ctor to truly freeze.
<!--ID: 1781902681732-->
END

START
Basic
You see a `switch` deconstructing `case Point(int x, int y)`. What language feature is this?
Back: A **record pattern** — it destructures the record into its components.<br>Works in `switch` and `instanceof`; finalized in Java 21.<br>Relies on the record's component accessors.
<!--ID: 1781902681739-->
END

START
Basic
Can a record declare static fields/methods and extra instance methods?
Back: Yes — `static` members and additional instance methods are allowed.<br>What is **not** allowed: extra *instance* fields beyond the components (and non-static instance initializers).
<!--ID: 1781902681747-->
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
