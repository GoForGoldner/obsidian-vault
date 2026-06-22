---
tags: [java, modules, jpms]
category: java
related: []
---

## Description
The Java Platform Module System (JPMS, introduced in Java 9 and unchanged in essence through Java 26) adds a unit of organization above the package: the **module**, declared in a `module-info.java` at the source root. A module explicitly states what it `requires` (depends on), what packages it `exports` (makes its public API), and what it `opens` (allows deep reflective access). The headline benefit is **strong encapsulation**: a package that is not exported is genuinely inaccessible to other modules at compile time and run time, even if its types are `public`.

The exam tests three layers: the directives themselves (`requires` / `exports` / `opens` / `uses` / `provides...with`), the three module flavors (named, automatic, unnamed), and the difference between the **module path** (modular world) and the **classpath** (legacy world). Two distinctions matter most: `requires transitive` (implied readability — your consumers also read the dependency) versus `requires static` (compile-time-only dependency, optional at run time); and how an **automatic module** derives its name.

## Examples
### A `module-info.java`
```java
module com.acme.orders {
    requires com.acme.core;                 // I read this module
    requires transitive java.sql;           // my consumers also read java.sql
    requires static org.example.annotations;// needed to compile, optional at runtime

    exports com.acme.orders.api;            // public API for everyone
    exports com.acme.orders.spi to com.acme.web; // qualified export: only that module

    opens com.acme.orders.model;            // deep reflection (e.g. for frameworks)

    uses com.acme.orders.spi.PricingService;            // service consumer
    provides com.acme.orders.spi.PricingService
        with com.acme.orders.internal.DefaultPricing;   // service provider
}
```

### Directive cheat sheet
| Directive | Purpose | Note |
| --- | --- | --- |
| `requires M` | depend on module `M` | gives readability to `M` |
| `requires transitive M` | dependency + implied readability | consumers of you also read `M` |
| `requires static M` | compile-time-only dependency | optional at runtime, no error if absent |
| `exports P` | make package `P`'s public API readable | reflection on private members still blocked |
| `exports P to M1, M2` | qualified export | only listed modules may read `P` |
| `opens P` | allow deep reflection into `P` at runtime | does NOT export the API for normal compile use |
| `opens P to M` | qualified open | reflection only for `M` |
| `uses S` | declare you consume service type `S` | load via `ServiceLoader` |
| `provides S with Impl` | declare an implementation of `S` | wires `ServiceLoader` |

### Three kinds of module
```text
NAMED      : a jar/dir WITH module-info.java on the module path. Name from the descriptor.
AUTOMATIC  : a plain jar (no module-info) placed ON THE MODULE PATH. It can read every
             other module and exports all its packages. Name from Automatic-Module-Name
             in the manifest, else derived from the FILENAME.
UNNAMED    : everything loaded from the CLASSPATH. Reads all modules; cannot be required
             by a named module by name.
```

### Automatic module naming (a favorite gotcha)
```text
Automatic-Module-Name in MANIFEST.MF, if present  -> that exact name (stable, preferred).
Otherwise, derived from the jar filename:
  guava-32.1.0.jar  -> strip ".jar", drop the trailing version "-32.1.0" -> "guava"
  foo-bar.jar       -> non-alphanumerics become "." -> "foo.bar"
So a version bump that renames the jar can silently change the module name -> brittle.
```

### Tooling (briefly)
```bash
jdeps --module-path libs app.jar     # analyze dependencies, suggest module-info
jlink --add-modules com.acme.orders --output runtime  # build a minimal custom JRE
```

## Related Topics
- [[encapsulation]] (modules are encapsulation above the package level)
- [[classpath]] vs module path
- `ServiceLoader` and the service-provider pattern

## Cards

```anki
START
Basic
What does `requires transitive M` give you that plain `requires M` does not?
Back: It grants **implied readability**: any module that reads YOU automatically also reads `M`.<br>Use it when `M`'s types appear in your exported API (e.g. you return a `java.sql` type).<br>Plain `requires M` keeps the dependency private to your module's implementation.
<!--ID: 1781902681177-->
END

START
Basic
When do you use `requires static M`?
Back: For a **compile-time-only** dependency that is optional at run time (e.g. annotations, an optional integration).<br>The module need not be present on the runtime module path, and its absence is not an error.<br>Plain `requires` would fail at startup if the module were missing.
<!--ID: 1781902681183-->
END

START
Basic
What's the difference between `exports P` and `opens P`?
Back: `exports P` makes package `P`'s **public API** accessible for normal compile/run use, but blocks reflection on private members.<br>`opens P` grants **deep reflective** access at runtime (for frameworks like Jackson/Spring) WITHOUT exporting the API for ordinary code.<br>Both have qualified forms (`... to M`).
<!--ID: 1781902681190-->
END

START
Basic
Name the three kinds of module and where each comes from.
Back: **Named** — has `module-info.java`, on the module path; name from the descriptor.<br>**Automatic** — a plain jar (no descriptor) placed on the module path.<br>**Unnamed** — anything loaded from the classpath; reads everything but can't be `requires`d by name.
<!--ID: 1781902681195-->
END

START
Basic
How is an automatic module's name determined?
Back: If the jar's manifest has `Automatic-Module-Name`, that value is used (stable, preferred).<br>Otherwise it is derived from the FILENAME: strip `.jar`, drop a trailing `-version`, and replace non-alphanumerics with `.` (e.g. `guava-32.1.0.jar` -> `guava`).<br>Gotcha: a version-driven filename change can silently change the module name.
<!--ID: 1781902681201-->
END

START
Basic
What is "strong encapsulation" in JPMS?
Back: A package that is NOT exported is inaccessible to other modules at compile AND run time, even if its types are declared `public`.<br>This is stronger than the old classpath world, where any public type was reachable.<br>So `public` no longer means "public to everyone" — only within the module unless exported.
<!--ID: 1781902681207-->
END

START
Basic
Why are split packages not allowed in JPMS, and what's the rule?
Back: The same package may not be supplied by more than one module that a given module reads — each package must belong to exactly ONE module.<br>Split packages cause the module system to reject the configuration at startup.<br>This forces a clean, non-overlapping package ownership across modules.
<!--ID: 1781902681214-->
END

START
Basic
What do `jdeps` and `jlink` do?
Back: `jdeps` analyzes a jar/class's dependencies and can suggest a `module-info` (useful for migration).<br>`jlink` assembles a minimal custom runtime image containing only the modules your app needs.<br>Together they help move from the classpath to modules and ship a smaller JRE.
<!--ID: 1781902681227-->
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
