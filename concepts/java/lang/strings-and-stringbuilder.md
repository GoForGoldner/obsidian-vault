---
tags: [java, lang, string, stringbuilder]
category: java
related: [text-blocks, primitives-wrappers-autoboxing, var-type-inference, generics]
---

## Description
`String` is **immutable**: every "modifying" method returns a new object, so the original is never changed. String *literals* are interned in the string pool, which is why `==` (identity) sometimes appears to work but is a trap — use `equals()` for value comparison. When you need to build a string in a loop, use the **mutable** `StringBuilder` to avoid creating throwaway `String` objects.

On the exam, expect questions on literal pooling vs `new String(...)`, `==` vs `equals`, the index-based methods, and the newer `strip`/`isBlank`/`repeat` API. Text blocks have their own note — see [[text-blocks]].

## Examples
### Immutability, pool, and `==` vs `equals`
```java
String a = "hi";
String b = "hi";
System.out.println(a == b);          // true  — both reference the pooled literal
String c = new String("hi");
System.out.println(a == c);          // false — new object, not pooled
System.out.println(a.equals(c));     // true  — value comparison
System.out.println(a == c.intern()); // true  — intern() returns the pooled instance

String s = "ab";
s.concat("cd");                       // returns "abcd" but s is unchanged
System.out.println(s);                // ab  — String is immutable
```

### Key `String` methods
| Signature | Returns | What it does |
| --- | --- | --- |
| `int length()` | `int` | Number of UTF-16 code units |
| `char charAt(int)` | `char` | Char at index |
| `String substring(int, int)` | `String` | Range `[from, to)` |
| `int indexOf(String)` | `int` | First index, or `-1` |
| `String replace(CharSequence, CharSequence)` | `String` | Replaces all occurrences |
| `String trim()` | `String` | Strips ASCII `<= U+0020` only |
| `String strip()` | `String` | Strips Unicode whitespace (Java 11+) |
| `boolean isBlank()` | `boolean` | True if empty or all whitespace (Java 11+) |
| `String repeat(int)` | `String` | Repeats the string n times (Java 11+) |
| `IntStream chars()` | `IntStream` | Stream of UTF-16 code units |
| `String formatted(Object...)` | `String` | Instance form of `String.format` (Java 15+) |

### StringBuilder — mutable and chainable
```java
StringBuilder sb = new StringBuilder("abc");
sb.append("de")          // abcde
  .insert(0, ">>")       // >>abcde
  .reverse()             // edcba>>
  .delete(0, 2);         // cba>>
System.out.println(sb);                 // cba>>
System.out.println(String.format("%05.2f", 3.1)); // 03.10
System.out.println("x".repeat(3));      // xxx
System.out.println("  hi ".strip());    // "hi"
```

## Related Topics
- [[text-blocks]]
- [[primitives-wrappers-autoboxing]]
- [[var-type-inference]]
- `String.format` / `Formatter` formatting syntax

## Cards

```anki
START
Basic
`String s = "ab"; s.concat("cd"); print(s)` — output, and the principle?
Back: Prints `ab`.<br>`String` is immutable — `concat` returns a new `"abcd"` you discarded; `s` never changes.
<!--ID: 1781902680960-->
END

START
Basic
`"hi" == "hi"` is true but `"hi" == new String("hi")` is false. Why?
Back: Both literals reference the same pooled (interned) instance, so `==` (identity) is true.<br>`new String(...)` forces a fresh heap object, so identity differs even though `.equals` is true.
<!--ID: 1781902680966-->
END

START
Basic
What does `intern()` do?
Back: Returns the canonical pooled `String` for that value, adding it to the pool if absent.<br>`a == c.intern()` becomes true when `a` is the pooled literal. Use for memory dedup, not for correctness.
<!--ID: 1781902680972-->
END

START
Basic
`strip()` vs `trim()` — when does the difference matter?
Back: `trim()` removes only characters `<= U+0020` (ASCII).<br>`strip()` (Java 11+) removes all Unicode whitespace, e.g. non-breaking/full-width spaces. Prefer `strip()`.
<!--ID: 1781902680979-->
END

START
Basic
You see `if (s.isBlank())` — what is it checking, and how does it differ from `isEmpty()`?
Back: `isBlank()` is true if the string is empty **or only whitespace**.<br>`isEmpty()` is true only when `length() == 0`. `isBlank` came in Java 11.
<!--ID: 1781902680986-->
END

START
Basic
When do you reach for `StringBuilder` over `String` concatenation?
Back: When building incrementally, especially in loops.<br>`String` is immutable so `s += ...` creates a new object each time; `StringBuilder` mutates one buffer. Its methods return `this`, enabling chaining.
<!--ID: 1781902680993-->
END

START
Basic
Name the four mutating `StringBuilder` methods for building/editing in place.
Back: `append`, `insert(index, ...)`, `delete(start, end)` / `deleteCharAt`, and `reverse`.<br>All mutate the buffer and return `this` for chaining.
<!--ID: 1781902681001-->
END

START
Basic
`"x".repeat(3)` and `"%05.2f".formatted(3.1)` — what do these produce?
Back: `repeat(3)` → `"xxx"` (Java 11+).<br>`"%05.2f".formatted(3.1)` → `"03.10"` — `formatted` is the instance version of `String.format` (Java 15+).
<!--ID: 1781902681008-->
END

START
Basic
`s.substring(1, 4)` — which characters are included?
Back: Indices `[1, 4)` — start inclusive, end exclusive (length = end - start).<br>An end index past `length()` throws `StringIndexOutOfBoundsException`.
<!--ID: 1781902681013-->
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
