---
epoch: 1780955492690
modelKey: "deepseek-v4-flash|deepseek"
topic: "Double Dispatch vs Dynamic Dispatch"



tags:
  - copilot-conversation
---

**user**: are double dispatch and dynamic dispatch the same thing
[Timestamp: 2026/06/08 17:51:32]

**ai**: Great question! **They are related but not the same thing.** Let me break it down.

- **Dynamic dispatch** (or late binding) is the mechanism by which a call to an overridden method is resolved at runtime based on the **actual type of the receiver** (the object on which the method is called). In most single-dispatch languages (Java, C++, C#), this is how polymorphism works for instance methods.  
  Example: `animal.sound()` calls `Dog.sound()` if `animal` actually refers to a `Dog`.

- **Double dispatch** is a technique to achieve **dynamic dispatch on two arguments** (the receiver and one parameter). It's needed because most OOP languages only dispatch dynamically on the receiver, not on parameters. Double dispatch is typically implemented using the **Visitor pattern**: the first dispatch calls an `accept` method on the receiver, which then calls back a specific `visit` method on the visitor, effectively dispatching on both objects.  
  Example: A collision detection system where `Asteroid.collideWith(SpaceShip)` needs to know both the actual type of the asteroid and the spaceship.

### Key differences

| Dynamic Dispatch | Double Dispatch |
|-----------------|-----------------|
| Built into the language (virtual methods) | A pattern you must implement manually |
| Dispatches on **one** object (the receiver) | Dispatches on **two** objects (receiver + argument) |
| Single lookup at runtime | Two virtual calls (first `accept`, then `visit`) |
| Used for everyday polymorphism | Used when behavior depends on the concrete types of two interacting objects |

### In short
- Dynamic dispatch is the *language feature*.
- Double dispatch is a *design technique* that *uses* dynamic dispatch twice to overcome the limitation of single dispatch.

---

I’ve captured this as a note for you: [[double-dispatch-vs-dynamic-dispatch]].
[Timestamp: 2026/06/08 17:51:46]

**user**: Why does the visitor pattern have it both ways? Why isn’t it just the accept methof?
[Timestamp: 2026/06/08 17:54:05]

**ai**: Excellent question — it gets at the heart of how the Visitor pattern *actually* achieves double dispatch in a single-dispatch language like Java.

**Short answer:** `accept` alone cannot work because it never changes *which* visitor method is called based on the *visitor’s* concrete type. You need both methods to get two separate runtime dispatches: one on the element (via `accept`) and one on the visitor (via the overloaded `visit`).

---

### Why `accept` alone is not enough

Imagine you only have an `accept(Visitor v)` on each element, and the Visitor has only **one** method `visit(Element e)`:

```java
interface Visitor {
    void visit(Element e);
}

abstract class Element {
    abstract void accept(Visitor v);
}

class ConcreteElementA extends Element {
    void accept(Visitor v) {
        v.visit(this);   // 'this' is statically ConcreteElementA
    }
}
```

When `v.visit(this)` is called inside `accept`, the compiler already knows the **static type** of `this` is `ConcreteElementA`. So even if `Visitor` had overloaded:
```java
void visit(ConcreteElementA a) { … }
void visit(ConcreteElementB b) { … }
```
the call `v.visit(this)` would correctly resolve to `visit(ConcreteElementA)` **only because `this`’s static type is `ConcreteElementA`**. That’s a compile-time overload resolution, not a second dispatch.

But the real problem is: what about dispatching on the **visitor’s** type? The `accept` method does nothing to select a different behavior depending on which concrete Visitor subclass is calling. To get that, you need `visit` to be a polymorphic method **on the Visitor**, which is impossible with only one method — you need separate `visit` methods for each element type so that the Visitor itself can choose what to do for each concrete element.

In other words:
- First dispatch (runtime): `accept` is called on the element → the JVM picks `ConcreteElementA.accept` or `ConcreteElementB.accept`.
- Second dispatch (also runtime): inside `accept`, `v.visit(this)` is called. Because `this` has a concrete type, the overload is selected at **compile time** — but if `visit` is **not overloaded**, you only get one behavior for all elements.

Wait — that sounds like `accept` does the job already? Let me clarify the nuance.

---

### The real two dispatches

Double dispatch requires **both** the element type **and** the visitor type to be determined at runtime.

1. **First dispatch:** `element.accept(visitor)` — the runtime type of `element` decides which `accept` runs.
2. **Inside `accept`:** `visitor.visit(this)` — this call must dispatch to the correct `visit` method **based on the runtime type of `visitor`**.  

If `visit` is a **regular virtual method** (non‑overloaded, e.g., `visit(Element e)`), then inside `ConcreteElementA.accept`, `visitor.visit(this)` would call the same `visit(Element e)` regardless of whether `visitor` is `ConcreteVisitor1` or `ConcreteVisitor2`. The **only polymorphism** here is on `visitor` — but the method signature is the same for all visitors, so you can’t differentiate element handling inside the visitor.

That’s why we overload `visit`:
```java
void visit(ConcreteElementA a);
void visit(ConcreteElementB b);
```
Now, inside `ConcreteElementA.accept`, `this` has static type `ConcreteElementA`, so the call `visitor.visit(this)` compiles to `visit(ConcreteElementA)`. At runtime, because `visit` is **virtual**, the JVM dispatches to the correct override in the concrete Visitor subclass. That gives you the **second dispatch** (on the visitor’s runtime type).

---

### If you removed `visit` and tried to do everything in `accept`…

You would need `accept` to know about all possible visitor behaviors, which defeats the purpose of separating algorithms from data structures. The whole point of Visitor is that you can add new operations (new Visitor subclasses) without modifying the element classes.

---

### Summary: both methods are required

| Method | Role |
|--------|------|
| `accept(Visitor v)` | First dispatch: chooses the element’s concrete type at runtime, then calls `v.visit(this)` — **passing the concrete type as a compile-time literal** |
| `visit` overloads | Second dispatch: each overload is a virtual method on the Visitor hierarchy; the correct one is called based on the Visitor’s runtime type |

Without `visit`, the Visitor can’t differentiate element types (you’d fall back to `instanceof`). Without `accept`, you can’t pass the concrete element type to the correct `visit` overload (the call would use the static type of the parameter, which would be the base `Element`).

---

I’ve captured this breakdown as a new note: [[visitor-pattern-why-two-methods]] (with 3 cards to help lock it in).
[Timestamp: 2026/06/08 17:55:30]