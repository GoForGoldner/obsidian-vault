---
tags: [java, io, nio, files, path]
category: java
related: [byte-streams, character-streams, try-with-resources, serialization, console-and-standard-streams]
---

## Description
NIO.2 (`java.nio.file`) is the modern file API. A `Path` is an immutable, abstract
representation of a location in a file system; the `Files` utility class holds the
static verbs that actually touch the disk (read, write, copy, walk, etc.). On the
1Z0-830 exam you must distinguish *path manipulation* (pure in-memory string logic,
no I/O, never throws `IOException`) from `Files` *operations* (real I/O, almost all
throw the checked `IOException`).

The legacy `java.io.File` API still exists and is testable, but NIO.2 is preferred.
Bridge between them with `File.toPath()` and `Path.toFile()`.

## Examples

```java
import java.nio.file.*;
import java.io.IOException;

// Two equivalent ways to build a Path (both pure, no I/O):
Path a = Path.of("/etc", "hosts");   // preferred since Java 11
Path b = Paths.get("/etc", "hosts"); // older; Paths.get just delegates to Path.of

// Path is IMMUTABLE — these return NEW Paths:
Path base = Path.of("/home/tyler");
base.resolve("notes/x.md");          // /home/tyler/notes/x.md  (joins)
base.resolve("/abs");                // /abs  (absolute arg replaces base!)
base.resolveSibling("backup");       // /home/backup  (replaces last element)
Path.of("/a/b/c").relativize(Path.of("/a/x/y")); // ../../x/y
Path.of("/a/./b/../c").normalize();  // /a/c  (removes . and ..)

Path p = Path.of("/home/tyler/notes/x.md");
p.getParent();    // /home/tyler/notes
p.getFileName();  // x.md  -- BUT this is a Path, NOT a String!
p.getName(0);     // home   (0-based, relative to root)
p.getNameCount(); // 3
p.isAbsolute();   // true
Path.of("x.md").toAbsolutePath(); // resolves against CWD (no I/O guarantee file exists)

// getFileName() returns a Path -> comparing it to a String always fails:
p.getFileName().equals("x.md");            // false! Path != String
p.getFileName().toString().equals("x.md"); // true  -- call toString() first
String name = p.getFileName().toString();  // "x.md"
```

```java
// java.io.File holds two DIFFERENT separator constants (fields, not methods):
File.separator;      // "/" on Unix, "\\" on Windows -- between NAME elements of one path
File.pathSeparator;  // ":" on Unix, ";" on Windows -- between ENTRIES in PATH/CLASSPATH
File.separatorChar;  // char versions of each
File.pathSeparatorChar;
// Splitting an env var like PATH uses pathSeparator (the entry separator):
System.getenv("PATH").split(File.pathSeparator); // NOT File.separator, and no () -- it's a field
```

```java
// Files: the I/O verbs (most throw checked IOException)
try {
    Files.writeString(p, "hello");                 // since Java 11, UTF-8
    String s = Files.readString(p);                // whole file -> String
    var lines = Files.readAllLines(p);             // List<String>, fully loaded
    Files.exists(p);                               // boolean, no exception
    Files.createDirectories(Path.of("/a/b/c"));    // makes parents too; ok if exists
    Files.copy(src, dst, StandardCopyOption.REPLACE_EXISTING);
    Files.move(src, dst, StandardCopyOption.ATOMIC_MOVE);
    Files.delete(p);                               // throws if missing
    Files.deleteIfExists(p);                       // returns boolean, no throw if absent
} catch (IOException e) { /* must handle or declare */ }

// Files.lines is LAZY and returns a Stream backed by an open file — MUST close it:
try (var stream = Files.lines(p)) {                // try-with-resources required
    stream.filter(l -> l.contains("TODO")).forEach(System.out::println);
}
```

```java
// Walking a tree
try (var s = Files.walk(Path.of("/project"))) {    // recursive Stream<Path>, lazy -> close
    s.filter(Files::isRegularFile).forEach(System.out::println);
}
// Single directory, not recursive — DirectoryStream is also a resource:
try (DirectoryStream<Path> ds = Files.newDirectoryStream(Path.of("/project"))) {
    for (Path child : ds) System.out.println(child);
}
```

### Path manipulation vs Files operations
| Call | Touches disk? | Throws `IOException`? |
| --- | --- | --- |
| `Path.of`, `resolve`, `normalize`, `getParent` | No | No |
| `path.toAbsolutePath()` | No (CWD-based) | No |
| `Files.exists` / `notExists` | Yes | No (returns boolean) |
| `Files.readString` / `walk` / `copy` / `delete` | Yes | Yes (checked) |

## Related Topics
- [[byte-streams]]
- [[character-streams]]
- [[try-with-resources]]
- [[serialization]]
- [[console-and-standard-streams]]
- Streams API, checked vs unchecked exceptions

## Cards

```anki
START
Basic
On the exam, which `Path` methods do real disk I/O (and can throw `IOException`) vs which are pure?
Back: Pure (no I/O, no `IOException`): `Path.of`, `resolve`, `relativize`, `normalize`, `getParent`, `toAbsolutePath`.<br>I/O (checked `IOException`): the `Files.*` verbs (`readString`, `copy`, `walk`, `delete`...).<br>`Path` is just an abstract location; `Files` is what touches the disk.
<!--ID: 1781902680487-->
END

START
Basic
`base.resolve(other)` — what happens when `other` is an absolute path?
Back: The absolute `other` is returned unchanged, ignoring `base`.<br>`Path.of("/home").resolve("/abs")` -> `/abs`.<br>Only relative arguments get appended.
<!--ID: 1781902680494-->
END

START
Basic
`resolve` vs `resolveSibling`?
Back: `resolve` appends to the path: `/a/b`.resolve(`c`) -> `/a/b/c`.<br>`resolveSibling` replaces the last element: `/a/b`.resolveSibling(`c`) -> `/a/c`.<br>Sibling = same parent, different name.
<!--ID: 1781902680501-->
END

START
Basic
You call `Files.lines(path)` or `Files.walk(path)` and just iterate — what's the bug?
Back: Both return a lazy `Stream` backed by an OPEN file handle; you must close it.<br>Wrap in try-with-resources: `try (var s = Files.lines(p)) { ... }`.<br>Forgetting it leaks a file descriptor.
<!--ID: 1781902680508-->
END

START
Basic
`Files.delete(p)` vs `Files.deleteIfExists(p)` when the file is missing?
Back: `delete` throws `NoSuchFileException` (an `IOException`).<br>`deleteIfExists` returns `false`, no exception.<br>Use the latter for idempotent cleanup.
<!--ID: 1781902680516-->
END

START
Basic
How do you convert between legacy `java.io.File` and NIO.2 `Path`?
Back: `file.toPath()` and `path.toFile()`.<br>Lets old `File`-based code interop with the modern `Files`/`Path` API.
<!--ID: 1781902680523-->
END

START
Basic
What's the difference between `Path.of(...)` and `Paths.get(...)`?
Back: None functionally — `Paths.get` just delegates to `Path.of`.<br>`Path.of` was added in Java 11 and is now preferred; `Paths.get` is the older form.
<!--ID: 1781902680529-->
END

START
Basic
Why can't `myPath.normalize()` mutate `myPath` in place?
Back: `Path` is immutable; every "operation" returns a NEW `Path`.<br>`p.normalize();` with no reassignment is a no-op bug — use `p = p.normalize();`.<br>Same trap as `String` methods.
<!--ID: 1781902680535-->
END

START
Basic
Gotcha: why does `path.getFileName().equals("x.md")` always return `false`?
Back: `getFileName()` returns a **`Path`**, not a `String` — and a `Path` is never `.equals()` to a `String`.<br>Call `.toString()` first: `path.getFileName().toString().equals("x.md")`.<br>Same trap when comparing any `Path` component (`getName(i)`, `getParent()`) against text.
<!--ID: 1781990693208-->
END

START
Basic
`File.separator` vs `File.pathSeparator` — what's the difference, and are they methods?
Back: Both are **fields** (no parentheses), `static final String`.<br>`File.separator` joins NAME elements within one path (`/` Unix, `\` Windows).<br>`File.pathSeparator` separates ENTRIES in a list like `PATH`/`CLASSPATH` (`:` Unix, `;` Windows) — this is what you `split` an env var on.
<!--ID: 1781990693213-->
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
