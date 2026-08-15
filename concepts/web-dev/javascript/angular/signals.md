---
tags: [angular, web-dev, signals, reactivity]
category: web-dev
related: [angular-overview, inputs-outputs-model, rxjs-interop, change-detection, usestate]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
**Signals** are Angular's reactivity primitive (stable since v20): a wrapped value that knows who reads it. You read a signal by **calling it** (`count()`), which both returns the value and registers a dependency in whatever reactive context is reading. There are three core kinds. `signal(initial)` is **writable** — update it with `.set(value)` or `.update(prev => next)`. `computed(() => ...)` is **read-only, lazy, and memoized** — it only recomputes when one of the signals it actually read last time changes, and only when something reads it (lazy). `effect(() => ...)` runs a **side effect** that re-runs whenever any signal it reads changes; effects run at least once and live in an injection context. The mental rule: **derived value → `computed`; value that's derived but also manually settable → `linkedSignal`; sync to a non-signal API (logging, localStorage, canvas) → `effect`** — effect is the last tool you reach for, not the first. `untracked(fn)` reads a signal *without* creating a dependency, which is how you avoid an effect re-firing on a signal you only want to read, not watch. Signals replace a lot of RxJS boilerplate for synchronous state, and unlike React's `useState`, reads are **glitch-free and synchronous** — `computed` always reflects the latest consistent value.

## Examples

### signal / computed / effect
```ts
import { signal, computed, effect } from '@angular/core';

const price = signal(100);
const qty   = signal(2);

const total = computed(() => price() * qty());  // read-only, memoized

price.set(120);                  // direct set
qty.update(n => n + 1);          // derive from previous

effect(() => {
  // re-runs whenever price or qty (read via total) changes
  console.log('Total is', total());
});
```

### untracked — read without subscribing
```ts
effect(() => {
  const v = value();               // tracked: effect re-runs when value changes
  log(v, untracked(() => userId())); // userId read, but effect won't re-run on userId change
});
```

### linkedSignal — derived AND writable (resets when source changes)
```ts
const options = signal(['a', 'b']);
// defaults to first option, but the user can also override it
const choice = linkedSignal(() => options()[0]);
choice.set('b');                   // manual override allowed
// when options() changes, choice resets to the new computation
```

## Related Topics
- [[inputs-outputs-model|Inputs, Outputs & Model]]
- [[change-detection|Change Detection & Zoneless]]
- [[rxjs-interop|RxJS Interop]]
- [[usestate|React useState (comparison)]]

## Cards

```anki
START
Basic
Signals: How do you read a signal's value, and what side-effect does reading have?
Back: You call it like a function: count(). Reading also registers a dependency in the current reactive context (computed/effect/template), so that context re-runs when the signal changes.
<!--ID: 1783445399164-->
END

START
Basic
Signals: Contrast signal(), computed(), and effect() in one line each.
Back: signal() = writable state (.set/.update). computed() = read-only, lazy, memoized derivation. effect() = side effect that re-runs when its read signals change.
<!--ID: 1783445399167-->
END

START
Basic
Signals: You need a derived value. When do you reach for computed vs linkedSignal vs effect?
Back: computed for a pure derivation you only read. linkedSignal when it's derived but also manually settable (resets when its source changes). effect only to sync to non-signal APIs — it's the last resort.
<!--ID: 1783445399170-->
END

START
Basic
Signals: Why is computed() described as "lazy and memoized"?
Back: Lazy — it doesn't recompute until something reads it. Memoized — it caches the result and only recomputes when a signal it actually read last time changes.
<!--ID: 1783445399173-->
END

START
Basic
Signals: An effect re-runs every time `userId` changes, but you only wanted to react to `value`. How do you read userId without subscribing to it?
Back: Wrap it in untracked: `untracked(() => userId())`. The read happens but no dependency is created, so the effect won't re-run when userId changes.
<!--ID: 1783445399176-->
END

START
Basic
Signals: Why can't you call .set() or .update() on a computed signal?
Back: computed is read-only — its value is fully determined by its derivation function. Letting you set it would create two sources of truth. Use signal() or linkedSignal() for writable state.
<!--ID: 1783445399179-->
END

START
Basic
Signals: What problem do signals solve compared to the old RxJS-everywhere approach for synchronous UI state?
Back: They remove subscription/unsubscription boilerplate and give glitch-free, synchronous reads. For sync state you just read a signal; RxJS is reserved for genuinely async/event streams.
<!--ID: 1783445399182-->
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
