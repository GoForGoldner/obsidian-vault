---
tags: [java, switch, switch-expressions, language]
category: java
related: [pattern-matching, arrays, exceptions]
---

## Description
Modern `switch` (finalized in Java 14) has an arrow form `case L ->` and can be used as an **expression** that produces a value. Arrow cases do not fall through, may list several labels (`case A, B ->`), and use `yield` to return a value from a block body. When `switch` is used as an *expression* it must be **exhaustive**: either a `default` is present, or — for `enum` and `sealed` types — every case is covered.

On 1Z0-830 the traps are: forgetting that an expression switch needs to be exhaustive (compile error otherwise), mixing arrow and colon styles in one switch (illegal), needing `yield` rather than `return` inside a `{}` case body, and remembering that arrow cases never fall through so no `break` is needed. Switch also supports type/record patterns — but that lives in [[pattern-matching]].

## Examples

```java
// switch as an EXPRESSION returning a value, arrow form, multiple labels
int day = 3;
String kind = switch (day) {
    case 1, 2, 3, 4, 5 -> "weekday";   // multiple labels, no fall-through
    case 6, 7          -> "weekend";
    default            -> "invalid";   // needed: int is not exhaustively covered
};
System.out.println(kind);  // weekday
```

```java
// yield: returning a value from a block-bodied case
int code = 2;
String msg = switch (code) {
    case 1 -> "one";
    case 2 -> {
        String s = "tw" + "o";
        yield s;          // 'yield', NOT 'return', exits the switch with a value
    }
    default -> "many";
};
System.out.println(msg);  // two
```

```java
// Enum exhaustiveness: no default needed if ALL constants are covered
enum Size { S, M, L }

int width(Size sz) {
    return switch (sz) {     // exhaustive -> no default required
        case S -> 1;
        case M -> 2;
        case L -> 3;
    };
}
// Adding a 4th enum constant later makes this fail to compile -> a useful guard.
```

```java
// Statement vs expression form
Size sz = Size.M;

// Statement form (produces no value); arrow cases still don't fall through
switch (sz) {
    case S -> System.out.println("small");
    case M -> System.out.println("medium");
    case L -> System.out.println("large");
}

// Old colon/fall-through statement form (still legal, needs break)
switch (sz) {
    case S:
    case M:
        System.out.println("S or M");
        break;        // without break, control falls through to L
    case L:
        System.out.println("L");
}
// You may NOT mix '->' and ':' styles in the same switch.
```

| Feature | Arrow `case L ->` | Colon `case L:` |
| --- | --- | --- |
| Fall-through | No (one label group runs) | Yes (until `break`) |
| Block result | `yield value;` | `yield value;` (expression form) |
| Multiple labels | `case A, B ->` | stacked `case A: case B:` |
| Can be an expression | Yes | Yes |
| Mix the two styles | Not allowed in one switch | Not allowed |

## Related Topics
- [[pattern-matching]]
- [[arrays]]
- [[exceptions]]
- [[collections-framework]]

## Cards

```anki
START
Basic
What's the difference between a switch *statement* and a switch *expression*?
Back: A statement performs side effects and yields no value.<br>An **expression** evaluates to a value you can assign/return.<br>An expression switch must be **exhaustive** and ends with `;` after the closing `}`.
<!--ID: 1781902681021-->
END

START
Basic
Inside an arrow case with a `{ }` block, how do you produce the switch's value?
Back: Use `yield value;` — not `return`.<br>`return` would exit the enclosing method; `yield` exits the switch with that value.<br>Single-expression arrow cases (`case 1 -> expr;`) yield implicitly.
<!--ID: 1781902681028-->
END

START
Basic
Do arrow-style `case A ->` labels fall through? How do you group labels?
Back: No — arrow cases never fall through, so no `break` needed.<br>Group several values with commas: `case A, B, C -> ...`.<br>(Only the old colon form falls through.)
<!--ID: 1781902681035-->
END

START
Basic
When is `default` required in a switch *expression*, and when can you omit it?
Back: An expression switch must be exhaustive.<br>You may omit `default` only when all cases are covered — i.e. every `enum` constant or every permitted type of a `sealed` hierarchy.<br>Otherwise `default` is mandatory or it won't compile.
<!--ID: 1781902681042-->
END

START
Basic
You cover all current enum constants in an expression switch with no `default`. Why might that be intentional?
Back: It compiles now, but adding a new enum constant later breaks compilation.<br>That compile error flags every switch you forgot to update — a deliberate safety net.<br>A catch-all `default` would silently hide the new case.
<!--ID: 1781902681049-->
END

START
Basic
Can you mix `case L ->` and `case L:` styles in the same switch?
Back: No — a single switch must use one style throughout; mixing won't compile.<br>Arrow form: no fall-through, optional `yield` in blocks.<br>Colon form: fall-through, needs `break`.
<!--ID: 1781902681056-->
END

START
Basic
What's the gotcha when an expression switch on an `int` lists `case 1, 2, 3`?
Back: `int` has many other values, so the switch isn't exhaustive — you must add `default`.<br>Exhaustiveness-without-default only applies to `enum` and `sealed` types.<br>Missing `default` here is a compile error.
<!--ID: 1781902681063-->
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
