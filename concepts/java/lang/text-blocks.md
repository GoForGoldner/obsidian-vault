---
tags: [java, lang, string, text-blocks]
category: java
related: [strings-and-stringbuilder, var-type-inference, generics]
---

## Description
A text block (JEP 378, final in Java 15) is a multi-line string literal delimited by `"""`. It produces an ordinary `String` — there is no new type and no string interpolation in Java. Its value is the property exam questions probe: the **opening** `"""` must be followed by a line terminator, and the compiler strips *incidental* whitespace based on where the **closing** `"""` sits.

Use them for embedded JSON, SQL, HTML, or any multi-line literal where escaping `\n` and `\"` would be noisy. Behavior is unchanged through Java 26.

## Examples
### Opening delimiter rule
```java
String bad  = """hello""";   // ERROR: opening """ must be followed by a line break
String good = """
              hello""";       // OK — content starts on the next line
```

### Incidental vs essential whitespace
The least-indented content line (and the closing delimiter, if on its own line) sets the left margin; everything to the left of it is *incidental* and stripped.
```java
String json = """
        {
          "id": 1
        }
        """;     // closing """ here sets the margin -> all common 8-space indent stripped
// json == "{\n  \"id\": 1\n}\n"   (note trailing newline from delimiter on its own line)
```
Move the closing `"""` further left and *more* leading space becomes essential (preserved). Put it at the end of the last content line and there is **no** trailing newline.

### Escapes unique to text blocks
```java
String oneLine = """
        Hello \
        World""";        // \  = line continuation: no newline -> "Hello World"

String trailing = """
        col1\scol2\s
        """;             // \s = a literal space; protects trailing spaces from stripping
```

### No interpolation
```java
int n = 5;
String s = """
        count = {n}""";   // literally "count = {n}" — Java has NO string interpolation
String t = "count = %d".formatted(n);  // use formatted / String.format instead
```

## Related Topics
- [[strings-and-stringbuilder]]
- `String.format` / `formatted` for value substitution
- JSON / SQL / HTML embedded literals

## Cards

```anki
START
Basic
What must immediately follow the opening `"""` of a text block?
Back: A line terminator (newline).<br>`"""hello"""` is a compile error; the content must begin on the line after the opening delimiter.
<!--ID: 1781902681070-->
END

START
Basic
What determines how much leading whitespace is stripped from a text block?
Back: The position of the **closing** `"""` (plus the least-indented content line).<br>That leftmost column marks essential whitespace; everything to its left is incidental and removed.
<!--ID: 1781902681077-->
END

START
Basic
Closing `"""` on its own line vs at the end of the last content line — what changes?
Back: On its own line → the text block ends with a trailing newline.<br>At the end of the last content line → no trailing newline.
<!--ID: 1781902681084-->
END

START
Basic
In a text block, what does a `\` at the end of a line do?
Back: Line continuation — it suppresses the newline, joining the two lines.<br>`Hello \`(newline)`World` becomes `"Hello World"`.
<!--ID: 1781902681091-->
END

START
Basic
You need to keep trailing spaces on a line in a text block, but they keep disappearing. What do you use?
Back: `\s` — an escape for a single space that is added **after** incidental-whitespace stripping.<br>It anchors the line end so trailing spaces survive.
<!--ID: 1781902681098-->
END

START
Basic
Does `"""count = {n}"""` substitute the variable `n`?
Back: No — Java has no string interpolation.<br>The text is literal `count = {n}`; use `String.format` / `.formatted(n)` or concatenation instead.
<!--ID: 1781902681105-->
END

START
Basic
What type does a text block evaluate to, and when would you choose one?
Back: A plain `String` — no special type.<br>Choose them for multi-line JSON/SQL/HTML where escaping `\n` and `\"` would be noisy.
<!--ID: 1781902681112-->
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
