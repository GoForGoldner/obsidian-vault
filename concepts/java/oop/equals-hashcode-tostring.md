---
tags: [java, oop, equals, hashcode]
category: java
related: [records, enums, nested-classes, sealed-classes, interfaces-and-default-methods]
---

## Description
`equals`, `hashCode`, and `toString` all come from `Object`, and the exam loves the *contracts* that bind the first two. `equals` must be **reflexive** (`x.equals(x)`), **symmetric** (`x.equals(y) == y.equals(x)`), **transitive**, **consistent** (same result on repeated calls if nothing changes), and `x.equals(null)` must return `false` (never throw). `hashCode`'s contract is the linchpin for hash collections: **equal objects must have equal hash codes**, and the code must be self-consistent across calls. Unequal objects *may* share a hash code (a collision), so the implication is one-directional.

The practical rule: **override `equals` and `hashCode` together, or you break `HashMap`/`HashSet`**. If you override only `equals`, two "equal" objects can land in different buckets and a lookup misses. `Objects.equals(a, b)` (null-safe) and `Objects.hash(...)` (varargs) make correct implementations easy. A subtle design choice in `equals` is `instanceof` vs `getClass()`: `instanceof` permits a subclass to equal a superclass instance (good for Liskov substitutability, but can break **symmetry** if a subclass adds state to equality), while `getClass()` enforces exact-type matching (preserves symmetry, but a proxy/subclass is never equal). **Records auto-generate all three** correctly over their components, removing the boilerplate and the bugs.

## Examples
### Correct, paired implementation
```java
final class Money {
    private final long cents;
    private final String currency;

    @Override public boolean equals(Object o) {
        if (this == o) return true;                 // reflexive fast-path
        if (!(o instanceof Money m)) return false;  // also handles null -> false
        return cents == m.cents && Objects.equals(currency, m.currency);
    }
    @Override public int hashCode() {
        return Objects.hash(cents, currency);       // SAME fields as equals
    }
    @Override public String toString() {
        return "Money[" + cents + " " + currency + "]";
    }
}
```

### The contracts at a glance
| Contract | Rule |
| --- | --- |
| equals reflexive | `x.equals(x)` is `true` |
| equals symmetric | `x.equals(y)` ⇔ `y.equals(x)` |
| equals transitive | `x.equals(y)` & `y.equals(z)` ⇒ `x.equals(z)` |
| equals consistent | repeated calls agree if fields unchanged |
| equals vs null | `x.equals(null)` is `false`, never throws |
| hashCode ↔ equals | equal objects ⇒ equal hash codes (not vice-versa) |
| hashCode consistent | stable across calls when state unchanged |

### Gotcha — mutating a field used in hashCode
```java
Set<Money> set = new HashSet<>();
var m = /* mutable Money */ ...;
set.add(m);
// mutate a field that hashCode/equals depends on...
set.contains(m);   // may now return FALSE — object is in the wrong bucket
```
Never base `hashCode`/`equals` on mutable fields of objects placed in hash structures.

### instanceof vs getClass
```java
// instanceof: a subclass CAN equal a superclass instance -> risks broken symmetry
// getClass(): requires identical runtime classes -> symmetric, but rejects subclasses/proxies
if (!(o instanceof Money m)) return false;   // Liskov-friendly
if (o == null || getClass() != o.getClass()) return false;  // strict
```

## Related Topics
- [[records]] — generate `equals`/`hashCode`/`toString` over components
- [[enums]] — identity-based equality; never override these
- [[java-set-and-map]] — why the contract matters for `HashSet`/`HashMap`
- [[liskov-substitution-principle]]
- [[immutability]]

## Cards

```anki
START
Basic
You override `equals` but not `hashCode`. What breaks?
Back: `HashMap`/`HashSet` — two "equal" objects can hash to different buckets, so lookups/`contains` miss them.<br>Rule: **always override both together** (or neither).
<!--ID: 1781902681550-->
END

START
Basic
State the one-directional `hashCode` rule.
Back: Equal objects **must** have equal hash codes.<br>Unequal objects **may** share a hash code (a collision) — that's allowed.<br>So equal⇒equalHash, but equalHash does *not* imply equal.
<!--ID: 1781902681558-->
END

START
Basic
What must `x.equals(null)` do, and what must it never do?
Back: Return **`false`**.<br>It must **never throw** (e.g. no NPE).<br>The `instanceof` pattern handles this for free, since `null instanceof T` is `false`.
<!--ID: 1781902681565-->
END

START
Basic
List the five parts of the `equals` contract.
Back: Reflexive, symmetric, transitive, consistent, and `x.equals(null) == false`.<br>(Reflexive: x=x; symmetric: x=y ⇔ y=x; transitive: x=y,y=z ⇒ x=z; consistent: repeatable.)
<!--ID: 1781902681572-->
END

START
Basic
`instanceof` vs `getClass()` in `equals` — the tradeoff?
Back: `instanceof` lets a subclass equal a superclass instance (Liskov-friendly) but can break **symmetry** if subclasses add to equality.<br>`getClass()` enforces exact runtime type — symmetric, but rejects subclasses/proxies.
<!--ID: 1781902681580-->
END

START
Basic
Which helpers make correct `equals`/`hashCode` easy?
Back: `Objects.equals(a, b)` — null-safe field comparison.<br>`Objects.hash(f1, f2, ...)` — varargs combiner for `hashCode`.<br>(Don't use `Objects.hash` for a single field on a hot path — boxing/array overhead.)
<!--ID: 1781902681587-->
END

START
Basic
You put an object in a `HashSet`, then mutate a field used by its `hashCode`. What can go wrong?
Back: The object now lives in the wrong bucket — `contains`/removal can fail to find it.<br>Base `hashCode`/`equals` only on **immutable** fields for hashed objects.
<!--ID: 1781902681594-->
END

START
Basic
Do you write `equals`/`hashCode`/`toString` for a record?
Back: No — a **record auto-generates all three** over its components, contract-correct.<br>Override only if you need non-default semantics (rare).
<!--ID: 1781902681601-->
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
