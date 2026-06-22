---
tags: [java, exceptions, error-handling, throwable, language]
category: java
related: [switch-expressions, pattern-matching, arrays]
---

## Description
Everything throwable in Java descends from `Throwable`, split into `Error` (serious JVM problems you don't catch) and `Exception`. Under `Exception`, the key fork is **checked** exceptions (everything except `RuntimeException` and its subclasses) versus **unchecked** exceptions (`RuntimeException` + subclasses, and `Error`). Checked exceptions must be either caught or declared with `throws` — the compiler enforces it; unchecked ones need not be.

For 1Z0-830 the dense traps cluster around `finally` (it overrides a `return`, and always runs except on `System.exit`/JVM death), multi-catch rules (the alternatives must not be subclass-related, and `e` is effectively final), and catch ordering (a subclass must be caught before its superclass or you get an unreachable-code compile error). Resource cleanup via try-with-resources lives in [[try-with-resources]] — see it for autoclose order and suppressed exceptions.

## Examples

```text
Throwable
├── Error            (unchecked: OutOfMemoryError, StackOverflowError) — don't catch
└── Exception
    ├── (checked)    IOException, SQLException, Exception itself, ...
    └── RuntimeException  (unchecked: NullPointerException,
                           IllegalArgumentException, ClassCastException, ...)
```

```java
// Checked must be caught OR declared; unchecked need neither.
void readChecked() throws IOException {     // declared -> OK
    throw new IOException("disk");
}
void runtimeOk() {
    throw new IllegalStateException("no throws needed");  // unchecked
}
```

```java
// finally always runs — and a return in finally OVERRIDES earlier returns/throws
int gotcha() {
    try {
        return 1;
    } finally {
        return 2;     // swallows the try's return AND any in-flight exception -> returns 2
    }
}
// gotcha() == 2.  A 'return' (or throw) in finally is a notorious bug; avoid it.

// finally runs after normal completion, after a caught/uncaught exception, and even
// after a return — EXCEPT if the JVM dies or System.exit(n) is called inside try/catch.
void noFinally() {
    try { System.exit(0); }
    finally { System.out.println("never prints"); }
}
```

```java
// Multi-catch: alternatives must NOT be in a subclass relationship; 'e' is effectively final
try {
    risky();
} catch (java.io.IOException | java.sql.SQLException e) {  // unrelated types -> legal
    // catch (IOException | FileNotFoundException e)  // ILLEGAL: subclass relationship
    log(e);            // e is effectively final — you may not reassign it
    // e = new RuntimeException();   // compile error
}

// Catch ORDER: subclass before superclass, else unreachable-code compile error
try {
    risky();
} catch (java.io.FileNotFoundException e) {  // subclass first
    handleMissing(e);
} catch (java.io.IOException e) {             // superclass after — OK
    handleIo(e);
}
// Reversing them (IOException first) makes the FileNotFoundException catch unreachable: won't compile.
```

```java
// Custom exception + chaining (preserve the cause) + rethrow
class ConfigException extends Exception {           // checked (extends Exception)
    public ConfigException(String msg, Throwable cause) {
        super(msg, cause);                          // chain the root cause
    }
}

void load() throws ConfigException {
    try {
        parse();
    } catch (java.io.IOException e) {
        throw new ConfigException("bad config", e); // wrap + chain; e.getCause() recoverable
    }
}

// Rethrow as-is to add context but keep the type:
void rethrow() throws java.io.IOException {
    try { parse(); }
    catch (java.io.IOException e) { log(e); throw e; }  // precise rethrow
}
```

| Type | Checked? | Must catch/declare? | Examples |
| --- | --- | --- | --- |
| `Error` | Unchecked | No | `OutOfMemoryError`, `StackOverflowError` |
| `RuntimeException` | Unchecked | No | `NullPointerException`, `IllegalArgumentException` |
| Other `Exception` | Checked | Yes | `IOException`, `SQLException` |

## Related Topics
- [[try-with-resources]]
- [[switch-expressions]]
- [[pattern-matching]]
- [[arrays]]

## Cards

```anki
START
Basic
What's the rule for checked vs unchecked exceptions, and which classes are unchecked?
Back: **Checked** exceptions must be caught or declared with `throws` (compiler-enforced).<br>**Unchecked** = `RuntimeException` (and subclasses) plus `Error` — no `throws` needed.<br>Everything else under `Exception` is checked.
<!--ID: 1781902680727-->
END

START
Basic
What does this return and why?<br>`try { return 1; } finally { return 2; }`
Back: Returns `2`.<br>A `return` in `finally` overrides the try block's return (and would swallow an in-flight exception too).<br>Returning/throwing from `finally` is an anti-pattern — avoid it.
<!--ID: 1781902680734-->
END

START
Basic
Does `finally` always run? Name the exceptions.
Back: It runs after normal completion, after a return, and after caught OR uncaught exceptions.<br>It does NOT run if `System.exit(...)` is called in the try/catch, or the JVM crashes/is killed (e.g. power loss, fatal error).<br>Infinite loops/blocking in try also prevent reaching it.
<!--ID: 1781902680740-->
END

START
Basic
What two rules govern multi-catch `catch (A | B e)`?
Back: 1) `A` and `B` must NOT be in a subclass relationship (else the wider one alone suffices -> compile error).<br>2) `e` is effectively final — you cannot reassign it.<br>Its static type is the common supertype of the alternatives.
<!--ID: 1781902680747-->
END

START
Basic
Why won't this compile?<br>`catch (IOException e) {...} catch (FileNotFoundException e) {...}`
Back: `FileNotFoundException` is a subclass of `IOException`, so the second catch is **unreachable** — a compile error.<br>Order catch blocks subclass-first, superclass-last.<br>(Independent/unrelated types may go in any order.)
<!--ID: 1781902680754-->
END

START
Basic
How do you preserve the original cause when wrapping an exception, and why bother?
Back: Pass the original as the cause: `throw new MyException("msg", e);` (or `initCause(e)`).<br>Retrievable via `getCause()`; the stack trace shows "Caused by:".<br>Without chaining you lose the root-cause diagnosis.
<!--ID: 1781902680761-->
END

START
Basic
What must a custom exception extend to be checked vs unchecked?
Back: Extend `Exception` (but not `RuntimeException`) -> **checked**: callers must catch/declare it.<br>Extend `RuntimeException` -> **unchecked**: no `throws` required.<br>Provide constructors that call `super(msg, cause)` to support chaining.
<!--ID: 1781902680768-->
END

START
Basic
Where does try-with-resources fit, and what does it handle that plain finally doesn't?
Back: See [[try-with-resources]] — it auto-closes `AutoCloseable` resources in reverse order of opening.<br>It also adds *suppressed* exceptions (close-time failures attached to the primary).<br>Prefer it over manual `finally { close(); }`.
<!--ID: 1781902680775-->
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
