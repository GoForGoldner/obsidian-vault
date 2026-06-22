---
tags: [java, io, serialization, serializable]
category: java
related: [files-and-paths, byte-streams, character-streams, try-with-resources, console-and-standard-streams]
---

## Description
Serialization converts an object graph into a byte stream (`ObjectOutputStream.writeObject`)
and back (`ObjectInputStream.readObject`). A class opts in by implementing the marker
interface `Serializable` (no methods). The exam focuses on *what is and isn't written*:
`transient` and `static` fields are skipped, every referenced field must itself be
serializable (or you get `NotSerializableException`), and deserialization does **not**
run any constructor — the JVM allocates the object and restores fields directly.

`serialVersionUID` is a version stamp; if the stream's UID doesn't match the loaded
class's, you get `InvalidClassException`. `Externalizable` is the manual alternative
(you write `writeExternal`/`readExternal` yourself, and — unlike `Serializable` — it
*does* invoke the public no-arg constructor on read). Records serialize specially: by
their components via the canonical constructor, ignoring any custom serialization
methods. Java serialization is also a notorious security risk — deserializing untrusted
bytes can instantiate arbitrary types and trigger gadget chains, so validate or avoid it.

## Examples

```java
import java.io.*;

class Account implements Serializable {
    private static final long serialVersionUID = 1L;  // pin the version explicitly
    String owner;                 // serialized
    transient String password;    // NOT serialized -> null after read
    static int count;             // NOT serialized (belongs to class, not instance)
    Account(String o) { owner = o; System.out.println("ctor ran"); }
}

// Write then read — note: NO constructor runs on read
try (var out = new ObjectOutputStream(new FileOutputStream("a.ser"))) {
    out.writeObject(new Account("tyler"));   // prints "ctor ran" (this is the write)
}
try (var in = new ObjectInputStream(new FileInputStream("a.ser"))) {
    Account a = (Account) in.readObject();   // NO "ctor ran" — fields restored directly
    // a.owner == "tyler", a.password == null (transient)
}
```

```java
// NotSerializableException: a non-serializable referenced field at WRITE time
class Bad implements Serializable {
    Object x = new Object();      // Object is not Serializable
}
// out.writeObject(new Bad());    // throws NotSerializableException: java.lang.Object
```

```java
// Custom hooks (Serializable): private methods with these EXACT signatures
class Secure implements Serializable {
    transient String secret;
    private void writeObject(ObjectOutputStream o) throws IOException {
        o.defaultWriteObject();           // write the non-transient fields
        o.writeObject(encrypt(secret));   // then handle transient manually
    }
    private void readObject(ObjectInputStream i) throws IOException, ClassNotFoundException {
        i.defaultReadObject();
        secret = decrypt((String) i.readObject());
    }
}
```

```java
// Externalizable: YOU control the bytes, and the public no-arg ctor IS called on read
class Point implements Externalizable {
    int x, y;
    public Point() { }                         // REQUIRED public no-arg ctor
    public void writeExternal(ObjectOutput o) throws IOException { o.writeInt(x); o.writeInt(y); }
    public void readExternal(ObjectInput i) throws IOException { x = i.readInt(); y = i.readInt(); }
}
```

### What gets serialized?
| Field kind | Serialized? |
| --- | --- |
| normal instance field (serializable type) | yes |
| `transient` field | no (restored as default: `null`/`0`/`false`) |
| `static` field | no (class-level, not part of instance state) |
| reference to non-`Serializable` object | no — throws `NotSerializableException` |

## Related Topics
- [[byte-streams]]
- [[try-with-resources]]
- [[files-and-paths]]
- Records, `InvalidClassException`, deserialization gadget attacks

## Cards

```anki
START
Basic
Which fields are NOT written during serialization?
Back: `transient` fields and `static` fields.<br>`transient` = explicitly excluded; comes back as the type default (`null`/`0`/`false`).<br>`static` = belongs to the class, not the instance, so it's never part of object state.
<!--ID: 1781902680602-->
END

START
Basic
Gotcha: does deserialization call the class's constructor?
Back: No. For `Serializable`, NO constructor runs — the JVM allocates the object and restores fields directly.<br>(Exception: `Externalizable` DOES invoke the public no-arg constructor.)<br>So constructor-based invariants/validation are bypassed.
<!--ID: 1781902680609-->
END

START
Basic
You call `writeObject(obj)` and get `NotSerializableException`. Why?
Back: `obj` (or one of its non-transient referenced fields) doesn't implement `Serializable`.<br>The whole reachable graph must be serializable.<br>Fix: mark the field `transient` or make the type `Serializable`.
<!--ID: 1781902680616-->
END

START
Basic
What is `serialVersionUID` and what breaks if it mismatches?
Back: A version stamp for a `Serializable` class.<br>If the stream's UID differs from the loaded class's, `readObject` throws `InvalidClassException`.<br>Declare it explicitly (`private static final long serialVersionUID`) so refactors don't silently break compatibility.
<!--ID: 1781902680622-->
END

START
Basic
`Serializable` vs `Externalizable` — key differences?
Back: `Serializable`: marker interface, JVM handles fields automatically, no ctor on read.<br>`Externalizable`: you implement `writeExternal`/`readExternal`, and the public no-arg ctor IS called on read.<br>Externalizable = full manual control.
<!--ID: 1781902680629-->
END

START
Basic
What are the exact methods to customize standard (Serializable) serialization?
Back: `private void writeObject(ObjectOutputStream)` and `private void readObject(ObjectInputStream)`.<br>Call `defaultWriteObject()`/`defaultReadObject()` inside to handle the normal fields, then your custom logic.<br>Often used to handle `transient` fields manually.
<!--ID: 1781902680637-->
END

START
Basic
How do records serialize, and what happens to custom serialization methods on a record?
Back: A record serializes by its component values and deserializes by invoking the CANONICAL constructor.<br>Any `writeObject`/`readObject`/`writeExternal`/`readExternal` on a record are IGNORED.<br>So canonical-constructor validation still runs on read (unlike normal classes).
<!--ID: 1781902680653-->
END

START
Basic
Why is deserializing untrusted data a security risk?
Back: `readObject` can instantiate arbitrary classes on the classpath and trigger "gadget chains" leading to RCE.<br>It bypasses constructors, so invariants aren't enforced.<br>Mitigate with serialization filters (`ObjectInputFilter`) or avoid Java serialization for untrusted input.
<!--ID: 1781902680663-->
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
