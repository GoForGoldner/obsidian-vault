---
tags: [java, lang, primitives, wrappers, autoboxing]
category: java
related: [var-type-inference, strings-and-stringbuilder, generics, stream-api]
---

## Description
Java has 8 primitive types (value types stored directly) and a matching wrapper class for each (objects on the heap). **Autoboxing** converts a primitive to its wrapper automatically; **unboxing** does the reverse. The exam loves the consequences: the `Integer` cache making `==` lie, `NullPointerException` from unboxing a `null` wrapper, overload-resolution order, and integer overflow.

Wrappers are needed because generics and collections only hold reference types (`List<Integer>`, never `List<int>`). This is unchanged through Java 26 (Project Valhalla value classes are not yet final).

## Examples
### Primitives & wrappers
| Primitive | Bits | Wrapper | Notes |
| --- | --- | --- | --- |
| `boolean` | (JVM-defined) | `Boolean` | true/false |
| `byte` | 8 | `Byte` | -128..127 |
| `short` | 16 | `Short` | |
| `char` | 16 | `Character` | unsigned UTF-16 unit |
| `int` | 32 | `Integer` | |
| `long` | 64 | `Long` | |
| `float` | 32 | `Float` | IEEE 754 |
| `double` | 64 | `Double` | IEEE 754 |

### The Integer cache trap
```java
Integer a = 127, b = 127;
System.out.println(a == b);   // true  — cached (-128..127, same object)
Integer c = 128, d = 128;
System.out.println(c == d);   // false — outside cache, new objects
System.out.println(c.equals(d)); // true — always compare wrappers with equals()
```
Autoboxing calls `Integer.valueOf(int)`, which returns a shared cached object for `-128..127` (upper bound tunable via `-XX:AutoBoxCacheMax`). The cache exists for `Byte`, `Short`, `Long`, `Character` (0..127) and `Boolean` too.

### NPE on unboxing & overflow
```java
Integer i = null;
int x = i;                    // NullPointerException — unboxing null
int max = Integer.MAX_VALUE;  // 2147483647
System.out.println(max + 1);  // -2147483648  (silent wraparound)
```

### parseInt vs valueOf
```java
int p     = Integer.parseInt("42");  // returns primitive int
Integer w = Integer.valueOf("42");   // returns Integer (cached if in range)
```

## Related Topics
- [[var-type-inference]]
- [[generics]]
- [[strings-and-stringbuilder]]
- Collections framework (wrappers required as type arguments)

## Cards

```anki
START
Basic
`Integer a = 127, b = 127; a == b` vs `Integer c = 128, d = 128; c == d` — results?
Back: `a == b` is **true**; `c == d` is **false**.<br>Autoboxing caches `Integer` objects for `-128..127`, so equal small values share one object.<br>Always use `.equals()` to compare wrapper values.
<!--ID: 1781902680849-->
END

START
Basic
Why does `int x = someInteger;` sometimes throw `NullPointerException`?
Back: If the `Integer` is `null`, unboxing calls `.intValue()` on `null`.<br>Auto-unboxing a `null` wrapper always NPEs.
<!--ID: 1781902680856-->
END

START
Basic
Overload resolution: order the compiler prefers among widening, boxing, and varargs.
Back: Widening > boxing > varargs.<br>`f(1)` picks `f(long)` over `f(Integer)` over `f(int...)`.<br>The compiler avoids autoboxing and varargs until no primitive-widening match exists.
<!--ID: 1781902680863-->
END

START
Basic
`Integer.parseInt("42")` vs `Integer.valueOf("42")` — what does each return?
Back: `parseInt` returns a primitive `int`.<br>`valueOf` returns an `Integer` (and may return a cached object for `-128..127`).
<!--ID: 1781902680870-->
END

START
Basic
What does autoboxing `Integer x = 5;` actually compile to?
Back: `Integer x = Integer.valueOf(5);`<br>That call consults the Integer cache, which is why `==` on small values can be true.
<!--ID: 1781902680877-->
END

START
Basic
`Integer.MAX_VALUE + 1` evaluates to what?
Back: `Integer.MIN_VALUE` (-2147483648).<br>`int` arithmetic wraps around silently on overflow — no exception. Use `Math.addExact` to detect it.
<!--ID: 1781902680884-->
END

START
Basic
How many primitive types does Java have, and why do collections use wrappers?
Back: 8: `boolean char byte short int long float double`.<br>Generics/collections hold only reference types, so `List<Integer>` (not `List<int>`).
<!--ID: 1781902680891-->
END

START
Basic
You compare two `Long` or `Integer` values with `==` and get inconsistent results across runs/inputs. Cause and fix?
Back: The wrapper cache makes `==` true only for small cached values; larger values are distinct objects.<br>Fix: compare with `.equals()` or unbox to primitives first.
<!--ID: 1781902680898-->
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
