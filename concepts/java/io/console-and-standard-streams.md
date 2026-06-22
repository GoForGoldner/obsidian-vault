---
tags: [java, io, console, standard-streams, system]
category: java
related: [files-and-paths, byte-streams, character-streams, try-with-resources, serialization]
---

## Description
Every JVM starts with three standard streams on `System`: `System.in` (an
`InputStream`), `System.out` and `System.err` (both `PrintStream`). `out` and `err`
are byte-oriented `PrintStream`s with convenient `print`/`println`/`printf` methods
that never throw `IOException` (they set an internal error flag instead).

`System.console()` returns a `Console` for interactive terminal I/O, including
`readPassword()` (which doesn't echo). The exam's favorite trap: **`System.console()`
returns `null`** when there's no attached terminal — i.e. in most IDEs, or when input/
output is redirected/piped — so you must null-check it. For portable line input,
wrapping `System.in` in a `BufferedReader(new InputStreamReader(...))` or using a
`Scanner` works everywhere. You can also redirect the streams with
`System.setOut/setErr/setIn`.

## Examples

```java
// The three standard streams
System.out.println("normal output");        // PrintStream (stdout)
System.err.println("error output");         // PrintStream (stderr)
int b = System.in.read();                    // InputStream (stdin), returns int / -1

// PrintStream never throws IOException — it sets an error flag:
System.out.println("...");
if (System.out.checkError()) { /* something went wrong */ }
```

```java
// System.console() — MUST null-check (null in IDEs and when piped/redirected)
Console c = System.console();
if (c != null) {
    String name = c.readLine("Name: ");
    char[] pw = c.readPassword("Password: ");   // not echoed; char[] so it can be wiped
    java.util.Arrays.fill(pw, ' ');             // clear the secret when done
} else {
    System.out.println("No console available (IDE or redirected input)");
}
```

```java
// Portable line input that works even when System.console() is null:
import java.io.*;
var br = new BufferedReader(new InputStreamReader(System.in));
String line = br.readLine();      // null at end of input
// (don't close System.in unless you really mean to)

// Or a Scanner — token/line oriented, parses primitives:
var sc = new java.util.Scanner(System.in);
int n = sc.nextInt();
```

```java
// Redirecting standard output (e.g. capture in a test)
PrintStream original = System.out;
var capture = new ByteArrayOutputStream();
System.setOut(new PrintStream(capture));
System.out.println("captured");
System.setOut(original);                       // restore
String got = capture.toString();               // "captured\n"
```

### Standard streams at a glance
| Stream | Type | Notes |
| --- | --- | --- |
| `System.in` | `InputStream` | raw bytes from stdin; wrap for text |
| `System.out` | `PrintStream` | stdout; `print`/`printf`; no `IOException` |
| `System.err` | `PrintStream` | stderr; for diagnostics |
| `System.console()` | `Console` or **`null`** | interactive terminal only |

## Related Topics
- [[byte-streams]]
- [[character-streams]]
- [[files-and-paths]]
- `Scanner`, `PrintStream`, stream redirection

## Cards

```anki
START
Basic
What are the types of `System.in`, `System.out`, and `System.err`?
Back: `System.in` is an `InputStream`; `System.out` and `System.err` are both `PrintStream`.<br>`in` gives raw bytes; `out`/`err` give text via `print`/`println`/`printf`.
<!--ID: 1781902680435-->
END

START
Basic
Exam trap: when does `System.console()` return `null`?
Back: When there's no attached interactive terminal — typically inside IDEs, or when stdin/stdout is redirected or piped.<br>Always null-check before calling methods on it, or you'll get a `NullPointerException`.
<!--ID: 1781902680443-->
END

START
Basic
You need to read a password without echoing it. Which API, and what does it return?
Back: `System.console().readPassword(...)` — input is not echoed.<br>Returns a `char[]` (not `String`) so you can zero it out after use, avoiding a lingering secret in the string pool.<br>But `console()` may be `null` outside a terminal.
<!--ID: 1781902680450-->
END

START
Basic
How do you read a line of text from stdin in a way that works even in an IDE?
Back: `new BufferedReader(new InputStreamReader(System.in)).readLine()`, or a `Scanner(System.in)`.<br>Unlike `System.console()`, these don't return `null` just because there's no terminal.
<!--ID: 1781902680457-->
END

START
Basic
`Scanner(System.in)` vs `BufferedReader(InputStreamReader(System.in))` — when pick which?
Back: `Scanner`: token/line parsing with `nextInt`/`next`/`nextLine`, convenient for typed input.<br>`BufferedReader.readLine()`: faster, line-at-a-time, returns raw `String` (you parse yourself).<br>Both avoid the `Console` null trap.
<!--ID: 1781902680464-->
END

START
Basic
How do you redirect `System.out` (e.g. to capture output in a test)?
Back: `System.setOut(new PrintStream(new ByteArrayOutputStream()))`; save the original first and restore it after.<br>Likewise `System.setErr` / `System.setIn`.<br>Capture with the `ByteArrayOutputStream`'s `toString()`.
<!--ID: 1781902680471-->
END

START
Basic
Why does `System.out.println(...)` never seem to throw an `IOException`?
Back: `PrintStream` swallows I/O errors and sets an internal flag instead.<br>Check it with `System.out.checkError()`.<br>Convenient, but it can silently lose output.
<!--ID: 1781902680478-->
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
