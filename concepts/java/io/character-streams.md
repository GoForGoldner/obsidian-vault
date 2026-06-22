---
tags: [java, io, streams, characters, charset]
category: java
related: [files-and-paths, byte-streams, try-with-resources, serialization, console-and-standard-streams]
---

## Description
Character streams are rooted at `Reader` and `Writer` and deal in `char`s, decoding
bytes through a `Charset`. Use them for text. The critical bridges are
`InputStreamReader` (bytes -> chars) and `OutputStreamWriter` (chars -> bytes), which
take an explicit `Charset` — the only clean way to control encoding.

The big exam topic is the charset default. Historically `FileReader`/`FileWriter`
used the *platform default* charset (e.g. `windows-1252` on Windows), making code
non-portable. Since Java 18 (JEP 400) the JDK-wide default charset is **UTF-8**, and
the `file.encoding` system property is `UTF-8` by default regardless of OS/locale.
So a no-charset `new FileReader(f)` now reads UTF-8 on every platform (Java 18+). On
the exam, watch the version: if it's old code or pre-18 semantics, the answer is
"platform default"; for current Java it's UTF-8. Still, prefer the explicit-`Charset`
constructors / bridges for clarity.

## Examples

```java
import java.io.*;
import java.nio.charset.StandardCharsets;

// Bridge: explicitly decode bytes -> chars (best practice)
try (var r = new BufferedReader(
        new InputStreamReader(new FileInputStream("a.txt"), StandardCharsets.UTF_8))) {
    String line;
    while ((line = r.readLine()) != null) {   // readLine() strips the line terminator
        System.out.println(line);
    }
}

// Bridge the other way: chars -> bytes
try (var w = new BufferedWriter(
        new OutputStreamWriter(new FileOutputStream("b.txt"), StandardCharsets.UTF_8))) {
    w.write("line 1");
    w.newLine();          // writes the platform line separator
    w.write("line 2");
}
```

```java
// FileReader / FileWriter convenience classes.
// Pre-Java 18: used the PLATFORM DEFAULT charset (non-portable!).
// Java 18+ (JEP 400): default is UTF-8 everywhere.
try (var r = new FileReader("a.txt")) { /* UTF-8 on Java 18+ */ }

// Charset-aware constructors exist since Java 11 — prefer these for clarity:
try (var r = new FileReader("a.txt", StandardCharsets.UTF_8)) { }
try (var w = new FileWriter("b.txt", StandardCharsets.UTF_8)) { }
```

```java
// BufferedReader.lines() — lazy Stream<String>; close the reader
try (var br = new BufferedReader(new FileReader("a.txt"))) {
    br.lines().filter(l -> !l.isBlank()).forEach(System.out::println);
}

// PrintWriter: convenient text output with print/println/printf (auto-flush optional)
try (var pw = new PrintWriter(new FileWriter("c.txt"))) {
    pw.printf("x = %d%n", 42);   // PrintWriter swallows IOException (check checkError())
}
```

### Bridge & buffer summary
| Class | Direction | Key methods |
| --- | --- | --- |
| `InputStreamReader` | bytes -> chars (takes `Charset`) | `read()` |
| `OutputStreamWriter` | chars -> bytes (takes `Charset`) | `write(...)` |
| `BufferedReader` | buffer + line reading | `readLine()`, `lines()` |
| `BufferedWriter` | buffer + line writing | `write`, `newLine()` |
| `PrintWriter` | formatted text out | `print`, `println`, `printf` |

## Related Topics
- [[byte-streams]]
- [[files-and-paths]]
- [[try-with-resources]]
- [[console-and-standard-streams]]
- Charset / encoding, JEP 400

## Cards

```anki
START
Basic
What was the historical charset gotcha with `new FileReader(file)` / `new FileWriter(file)`?
Back: They used the JVM's PLATFORM DEFAULT charset (e.g. `windows-1252`), so text broke when moved between platforms.<br>Fix: use the explicit-`Charset` constructors (Java 11+) or `InputStreamReader` with a `Charset`.
<!--ID: 1781902680377-->
END

START
Basic
On current Java (18+), what charset does a no-arg `new FileReader("f.txt")` use?
Back: UTF-8.<br>JEP 400 (Java 18) standardized the JDK default charset to UTF-8 on all platforms; `file.encoding` defaults to `UTF-8` regardless of OS/locale.<br>Pre-18 it was the platform default.
<!--ID: 1781902680384-->
END

START
Basic
You need to read a text file as a SPECIFIC charset, portably across Java versions. Which API?
Back: Bridge with `new InputStreamReader(byteStream, StandardCharsets.X)`, or the charset-taking `FileReader(file, charset)` (Java 11+).<br>Explicit charset removes any dependence on the default.
<!--ID: 1781902680391-->
END

START
Basic
What is `InputStreamReader` / `OutputStreamWriter` for?
Back: They are the bridges between byte streams and character streams.<br>`InputStreamReader`: bytes -> chars; `OutputStreamWriter`: chars -> bytes.<br>Each takes a `Charset` so you control the encoding explicitly.
<!--ID: 1781902680397-->
END

START
Basic
What does `BufferedReader.readLine()` return at end of input, and does it keep the newline?
Back: Returns `null` at end of stream (not `-1`).<br>Strips the line terminator (`\n`, `\r`, or `\r\n`).<br>Loop: `while ((line = br.readLine()) != null)`.
<!--ID: 1781902680404-->
END

START
Basic
`BufferedWriter.newLine()` vs writing `"\n"` — why prefer it?
Back: `newLine()` writes the platform's line separator (`System.lineSeparator()`), e.g. `\r\n` on Windows.<br>Hard-coding `\n` ignores the platform convention.
<!--ID: 1781902680411-->
END

START
Basic
Gotcha: why might a `PrintWriter` swallow your I/O error?
Back: `PrintWriter` (and `PrintStream`) never throw `IOException` from `print`/`println`/`printf`.<br>They set an internal flag instead — check `checkError()`.<br>Easy to silently lose writes.
<!--ID: 1781902680418-->
END

START
Basic
`BufferedReader.lines()` returns a `Stream<String>` — what must you remember?
Back: It reads lazily from the still-open reader, so keep the reader open while consuming and close it after.<br>Use try-with-resources around the `BufferedReader`.<br>Same lifecycle trap as `Files.lines`.
<!--ID: 1781902680426-->
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
