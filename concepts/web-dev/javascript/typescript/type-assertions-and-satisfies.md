---
tags: [typescript, web-dev, types, assertions]
category: web-dev
related: [basic-types-annotations, enums-literals-as-const, typing-the-dom, union-intersection-narrowing, interfaces-vs-type-aliases]
---

## Description
A type **assertion** `x as T` tells the compiler "trust me, this is `T`" — it does **no runtime check or conversion** (unlike a Java cast, which throws `ClassCastException`). TS only allows assertions between types that overlap; to force unrelated types you go through `as unknown as T` (a loud code smell). The **non-null assertion** `x!` strips `null`/`undefined` from a type, again with no runtime guard. The newer **`satisfies`** operator validates that an expression *conforms* to a type **without widening or changing** its inferred type — so you keep the precise literal types while still being checked. Reach for `satisfies` over `as` whenever you're describing a value you control; assertions are a smell when you're really just bypassing the checker.

## Examples
### `as` does nothing at runtime
```ts
const el = document.getElementById("x") as HTMLInputElement;
el.value;   // compiles; if the element isn't actually an input, fails at RUNTIME
```

### Forced/illegal cast needs `as unknown as`
```ts
const n = "5" as unknown as number; // double assertion — smell, avoid
```

### Non-null assertion `!`
```ts
function f(name?: string) {
  return name!.toUpperCase(); // assert not null/undefined — no runtime check
}
```

### `satisfies` vs `as`
```ts
type Config = Record<string, string | number>;

const cfg = { port: 8080, host: "local" } satisfies Config;
cfg.port.toFixed(0); // OK: port keeps its literal-narrowed `number` type

const bad = { port: 8080 } as Config;
// bad.port is now `string | number` — info lost; `as` also won't error on missing keys
```

## Related Topics
- [[enums-literals-as-const|as const & Literals]]
- [[typing-the-dom|Typing the DOM]]
- [[basic-types-annotations|unknown & any]]

## Cards

```anki
START
Basic
What does `x as T` actually do at runtime in TypeScript?
Back: Nothing — assertions are compile-time only. No check, no conversion. If `x` isn't really a `T`, you get no error until something breaks at runtime (unlike a Java cast that throws).
<!--ID: 1782407009628-->
END

START
Basic
When and why would you write `value as unknown as T`?
Back: To force an assertion between two types TS considers non-overlapping (it refuses a direct `as`). Going through `unknown` defeats the check — it's a code smell signaling you're lying to the compiler.
<!--ID: 1782407009631-->
END

START
Basic
What does the non-null assertion `x!` mean?
Back: "Trust me, `x` is not null/undefined" — it removes `null | undefined` from the type with no runtime guard. Crashes if it actually is null.
<!--ID: 1782407009634-->
END

START
Basic
How does `satisfies T` differ from `as T`?
Back: `satisfies` checks the value conforms to `T` but keeps its precise inferred (narrow/literal) type. `as` overrides the type to `T`, widening and losing info — and won't catch a missing required property the way `satisfies` does.
<!--ID: 1782407009638-->
END

START
Basic
You have `const cfg = {...} satisfies Config` vs `const cfg = {...} as Config`. Why prefer satisfies?
Back: `satisfies` validates against `Config` AND preserves the literal/narrow property types (so `.toFixed()` etc. still work). `as` widens to `Config`'s types and skips some checks.
<!--ID: 1782407009641-->
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
