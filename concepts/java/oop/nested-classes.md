---
tags: [java, oop, nested-classes, closures]
category: java
related: [interfaces-and-default-methods, records, enums, sealed-classes, equals-hashcode-tostring]
---

## Description
Java has four kinds of nested classes, and the exam tests the difference between them. A **static nested class** is just a class scoped inside another — it has no link to any enclosing instance and can access only the outer class's static members directly. A (non-static) **inner class** is bound to an *instance* of the enclosing class: it holds an implicit reference to that outer instance, can read the outer instance's fields, and can only be created from one (`outer.new Inner()`). Because of that implicit reference, an inner class cannot declare static members other than constants and cannot exist without its enclosing object.

**Local classes** (declared inside a method) and **anonymous classes** (declared and instantiated in one expression) are the two "scoped" forms. Both **capture local variables**, but only ones that are **effectively final** — the variable is never reassigned after initialization. Capturing a mutable local is a compile error; this is why people stash state in a one-element array or a field. Rule of thumb: static nested when there's no need for the outer instance, inner when you genuinely need the enclosing object's state, anonymous/local for short one-off implementations (often superseded by lambdas for functional interfaces).

## Examples
### Static nested vs inner
```java
class Outer {
    private int instanceVal = 1;
    private static int staticVal = 2;

    static class Nested {                 // no enclosing instance
        int read() { return staticVal; }  // OK: static member
        // int bad() { return instanceVal; } // COMPILE ERROR: no outer instance
    }

    class Inner {                         // bound to an Outer instance
        int read() { return instanceVal; }    // OK: implicit Outer.this reference
    }
}

Outer.Nested n = new Outer.Nested();      // no Outer needed
Outer o = new Outer();
Outer.Inner i = o.new Inner();            // requires an Outer instance
```

### Local and anonymous classes capture effectively-final locals
```java
Runnable make() {
    int count = 41;          // effectively final (never reassigned) -> capturable
    // count = 42;           // adding this makes the captures below a COMPILE ERROR

    class Local implements Runnable {            // local class
        public void run() { System.out.println(count); }
    }
    return new Runnable() {                       // anonymous class
        public void run() { System.out.println(count + 1); }
    };
}
```

### When to use which
| Kind | Holds outer instance? | Static members? | Typical use |
| --- | --- | --- | --- |
| Static nested | No | Yes | Helper/grouping tied to the type, not an instance (e.g. `Map.Entry`) |
| Inner (non-static) | Yes (`Outer.this`) | Only constants | Needs the enclosing object's state (iterators, builders) |
| Local | Yes (in instance ctx) | Constants only | Reused short class needed in one method |
| Anonymous | Yes (in instance ctx) | Constants only | One-off interface/abstract impl; else use a lambda |

## Related Topics
- [[interfaces-and-default-methods]] — anonymous classes often implement interfaces
- [[lambda]] / [[functional-interface]] — lambdas replace many anonymous classes
- [[java-iterators]] — iterators are a classic inner-class use
- [[closures]]

## Cards

```anki
START
Basic
Static nested class vs inner class — the one defining difference?
Back: An **inner (non-static) class** holds an implicit reference to an enclosing instance (`Outer.this`) and needs one to exist.<br>A **static nested class** has no such link and can only directly access the outer class's *static* members.
<!--ID: 1781902681657-->
END

START
Basic
How do you instantiate a non-static inner class from outside?
Back: `outer.new Inner()` — you need an existing enclosing instance.<br>`Outer.Nested n = new Outer.Nested();` (no instance) works only for a **static** nested class.
<!--ID: 1781902681664-->
END

START
Basic
A local/anonymous class uses a local variable. What requirement must that variable meet?
Back: It must be **effectively final** — assigned once and never reassigned.<br>Reassigning it later turns every capture into a compile error.
<!--ID: 1781902681670-->
END

START
Basic
Why can't a static nested class read `instanceVal` (a non-static field of the outer class)?
Back: It has **no enclosing instance** to read it from.<br>Without an `Outer.this`, only the outer class's *static* members are directly reachable.
<!--ID: 1781902681677-->
END

START
Basic
You need a one-off implementation of an interface inline. Anonymous class or lambda?
Back: Use a **lambda** if the target is a *functional* interface (one abstract method).<br>Use an **anonymous class** when you need multiple methods, fields, or to extend a class.
<!--ID: 1781902681684-->
END

START
Basic
Can an inner (non-static) class declare static fields/methods?
Back: No — only `static final` *constants*.<br>Because each inner instance is tied to an outer instance, general static members aren't allowed.
<!--ID: 1781902681691-->
END

START
Basic
The workaround when a lambda/anonymous class "needs" to mutate a captured local?
Back: Capture is by value and requires effectively-final, so mutate through a *reference*: a one-element array (`int[] c = {0}; c[0]++;`) or a field/`AtomicInteger`.<br>The reference stays final; its contents change.
<!--ID: 1781902681697-->
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
