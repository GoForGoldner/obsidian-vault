---
tags: [java, io, streams, bytes]
category: java
related: [files-and-paths, character-streams, try-with-resources, serialization, console-and-standard-streams]
---

## Description
Byte streams move raw 8-bit data and are rooted at the abstract classes `InputStream`
and `OutputStream`. Use them for binary, byte-exact data: images, audio, serialized
objects, copying files verbatim. For human-readable text use character streams instead,
because byte streams have no concept of charset/encoding.

The exam loves the *decorator* pattern here: you wrap a low-level stream
(`FileInputStream`) in a `BufferedInputStream` to add buffering, and the key gotchas
are that `read()` returns an `int` (0–255, or `-1` at EOF — never a `byte`) and that
buffered output must be `flush`ed (or closed) for data to actually be written.

## Examples

```java
import java.io.*;

// Decorator: buffer wraps the raw file stream (one constructor arg = the wrapped stream)
try (InputStream in = new BufferedInputStream(new FileInputStream("a.bin"));
     OutputStream out = new BufferedOutputStream(new FileOutputStream("b.bin"))) {

    int b;                            // NOTE: int, not byte
    while ((b = in.read()) != -1) {   // -1 signals EOF
        out.write(b);                 // writes the low 8 bits
    }
    // out.flush();                    // implied by close() at end of try
}
```

```java
// read(byte[]) — bulk read; returns count read, or -1 at EOF
try (InputStream in = new FileInputStream("a.bin")) {
    byte[] buf = new byte[8192];
    int n;
    while ((n = in.read(buf)) != -1) {
        // process buf[0..n)   — n may be < buf.length
    }
}
```

```java
// In-memory byte streams (no file, no close needed, never throw IOException in practice)
var bout = new ByteArrayOutputStream();
bout.write(new byte[]{1, 2, 3});
byte[] data = bout.toByteArray();          // grab accumulated bytes

var bin = new ByteArrayInputStream(data);  // read back from a byte[]
int first = bin.read();                    // 1
```

### Core hierarchy
| Class | Role |
| --- | --- |
| `InputStream` / `OutputStream` | abstract roots of all byte streams |
| `FileInputStream` / `FileOutputStream` | read/write raw bytes to a file |
| `BufferedInputStream` / `BufferedOutputStream` | decorator: adds an in-memory buffer |
| `ByteArrayInputStream` / `ByteArrayOutputStream` | stream backed by a `byte[]` in memory |

### Byte vs character streams
| Use byte streams when... | Use character streams when... |
| --- | --- |
| binary data (images, audio, `.class`, serialized objects) | text you want decoded to `char`/`String` |
| copying files byte-exact | line-based reading/writing |
| no charset involved | charset/encoding matters |

## Related Topics
- [[character-streams]]
- [[files-and-paths]]
- [[try-with-resources]]
- [[serialization]]
- Decorator pattern, EOF semantics

## Cards

```anki
START
Basic
What does `InputStream.read()` return, and how does it signal end-of-stream?
Back: It returns an `int` in 0–255 (one unsigned byte), NOT a `byte`.<br>At EOF it returns `-1`.<br>It's an `int` so that the 256 valid byte values stay distinct from the `-1` sentinel.
<!--ID: 1781902680323-->
END

START
Basic
Why does the read loop use `int b` instead of `byte b`?
Back: `read()` returns `int`; a `byte` can't represent the `-1` EOF sentinel distinctly (byte `-1` == `0xFF`, a valid value).<br>`while ((b = in.read()) != -1)` only works with `int`.
<!--ID: 1781902680331-->
END

START
Basic
You write to a `BufferedOutputStream` but the file ends up empty/short. What's missing?
Back: Buffered data sits in memory until you `flush()` (or `close()`, which flushes).<br>Either call `out.flush()` or let try-with-resources close it.<br>Buffering trades immediacy for fewer syscalls.
<!--ID: 1781902680339-->
END

START
Basic
You see `new BufferedInputStream(new FileInputStream("f"))` — what pattern is this and why?
Back: The decorator pattern: `BufferedInputStream` wraps the raw stream to add buffering.<br>Closing the outer stream closes the wrapped one too.<br>Buffering reduces the number of underlying read syscalls.
<!--ID: 1781902680346-->
END

START
Basic
When do you reach for byte streams over character streams?
Back: For binary, byte-exact data: images, audio, `.class` files, serialized objects, verbatim file copies.<br>Byte streams have no charset concept; character streams decode bytes to `char` using an encoding.
<!--ID: 1781902680353-->
END

START
Basic
What does `read(byte[] buf)` return, and what's the trap with the count?
Back: It returns the number of bytes actually read, or `-1` at EOF.<br>The count may be LESS than `buf.length` — always process only `buf[0..n)`, not the whole array.
<!--ID: 1781902680361-->
END

START
Basic
What is `ByteArrayOutputStream` for, and how do you get the bytes back out?
Back: An in-memory `OutputStream` that accumulates bytes in a growable `byte[]`.<br>Retrieve with `toByteArray()`.<br>Pair with `ByteArrayInputStream` to read from a `byte[]`; no file/close needed.
<!--ID: 1781902680368-->
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
