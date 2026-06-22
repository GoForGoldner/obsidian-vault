---
tags: [java, io, exceptions, try-with-resources, autocloseable]
category: java
related: [files-and-paths, byte-streams, character-streams, serialization, console-and-standard-streams]
---

## Description
Try-with-resources (TWR) automatically closes anything that implements `AutoCloseable`
when the `try` block exits — normally or by exception. This is the idiomatic way to
manage streams, readers, and connections, and it eliminates the messy finally-block
close dance. The exam tests three precise rules: resources close in **reverse** order
of declaration, they close **before** any `catch`/`finally` runs, and an exception
from `close()` becomes a **suppressed** exception if the body already threw.

`AutoCloseable.close()` throws `Exception`; `Closeable` (in `java.io`) extends it and
narrows `close()` to throw `IOException`. Since Java 9 you may also list an
already-declared *effectively final* variable in the resource header, not just a fresh
declaration.

## Examples

```java
// Reverse-order close: prints "close B" then "close A"
try (var a = new Res("A"); var b = new Res("B")) {
    // ... use a and b
}   // b.close() runs first, then a.close()

static class Res implements AutoCloseable {
    final String name;
    Res(String name) { this.name = name; }
    public void close() { System.out.println("close " + name); }
}
```

```java
// Java 9+: list an effectively-final EXISTING variable (no re-declaration)
var reader = new BufferedReader(new FileReader("a.txt"));
try (reader) {            // legal since Java 9; 'reader' must be (effectively) final
    reader.readLine();
}                          // reader.close() called here
// reader = null;          // <-- would break it: not effectively final, won't compile
```

```java
// Ordering: resources close BEFORE catch/finally execute
try (var r = new Res("R")) {
    throw new RuntimeException("boom");
} catch (RuntimeException e) {
    // by the time we get here, R.close() has ALREADY run
    System.out.println("caught: " + e.getMessage());
}
// Output order: "close R"  then  "caught: boom"
```

```java
// Suppressed exceptions: body throws AND close() throws -> body wins, close is suppressed
try (AutoCloseable c = () -> { throw new IOException("from close"); }) {
    throw new RuntimeException("from body");
} catch (Exception e) {
    System.out.println(e.getMessage());          // "from body"  (primary)
    for (Throwable s : e.getSuppressed())
        System.out.println("suppressed: " + s.getMessage());  // "from close"
}
```

### AutoCloseable vs Closeable
| | `AutoCloseable` (`java.lang`) | `Closeable` (`java.io`) |
| --- | --- | --- |
| `close()` throws | `Exception` | `IOException` (narrower) |
| Idempotent? | not required | should be (closing twice = no-op) |
| Usable in TWR? | yes | yes (it extends `AutoCloseable`) |

## Related Topics
- [[byte-streams]]
- [[character-streams]]
- [[files-and-paths]]
- [[serialization]]
- Checked vs unchecked exceptions, `Throwable`

## Cards

```anki
START
Basic
In what ORDER are try-with-resources closed?
Back: Reverse order of declaration — last declared closes first (LIFO).<br>`try (var a=...; var b=...)` closes `b` then `a`.<br>Mirrors construction dependencies (b may depend on a).
<!--ID: 1781902680543-->
END

START
Basic
Timing gotcha: when do try-with-resources close relative to `catch`/`finally`?
Back: Resources close BEFORE any `catch` or `finally` block runs.<br>So inside `catch`, the resource is already closed.<br>Different from manual try/finally where you control the order.
<!--ID: 1781902680550-->
END

START
Basic
Body throws `RuntimeException`, and `close()` also throws. Which propagates? Where's the other?
Back: The body's exception propagates as the primary.<br>The `close()` exception is attached as a SUPPRESSED exception.<br>Retrieve via `primary.getSuppressed()`.
<!--ID: 1781902680557-->
END

START
Basic
What's the difference between `AutoCloseable` and `Closeable`?
Back: `AutoCloseable` (`java.lang`): `close()` throws `Exception`.<br>`Closeable` (`java.io`) extends it and narrows `close()` to `IOException`; should be idempotent.<br>Both work in try-with-resources.
<!--ID: 1781902680565-->
END

START
Basic
Java 9+ syntax: can you put an existing variable in the resource header?
Back: Yes, if it's final or effectively final: `try (existingResource) { ... }`.<br>Before Java 9 you had to declare a fresh variable inside the parens.<br>Reassigning the variable breaks "effectively final" and won't compile.
<!--ID: 1781902680572-->
END

START
Basic
Write the try-with-resources skeleton that copies a reader to a writer.
Back: `try (var r = new BufferedReader(...);`<br>`     var w = new BufferedWriter(...)) {`<br>`    // use r and w`<br>`} catch (IOException e) { ... }`<br>Both auto-close in reverse order, even on exception.
<!--ID: 1781902680579-->
END

START
Basic
Which interface must a class implement to be usable in try-with-resources?
Back: `AutoCloseable` (or `Closeable`, which extends it).<br>The single method `close()` is invoked automatically on block exit.
<!--ID: 1781902680586-->
END

START
Basic
How do you read the exception that `close()` threw when the body also failed?
Back: `Throwable.getSuppressed()` returns the array of suppressed throwables.<br>The primary (body) exception is what `catch` catches; the close failure rides along suppressed.
<!--ID: 1781902680593-->
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
