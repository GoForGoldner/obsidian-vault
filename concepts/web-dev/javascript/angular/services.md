---
tags: [angular, web-dev, services, architecture, state]
category: web-dev
related: [dependency-injection, http-client, signals, rxjs-interop]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
A **service** is a plain `@Injectable` class for logic that doesn't belong to any single component: data access, HTTP calls, business rules, and **shared state**. The point is separation of concerns — components handle the view, services handle everything else — and reusability via DI. Because `providedIn: 'root'` services are **singletons**, they're Angular's idiomatic answer to global/shared state: hold the state inside a service (increasingly as **signals**), inject that service wherever it's needed, and every consumer reads/writes the same instance. This is the Angular analog of a React context/store. A common, robust pattern is the **"smart service, dumb signals"** shape: keep the writable signal `private`, expose a **read-only** view via `.asReadonly()` (or a `computed`), and mutate only through methods — so components can't bypass your logic. Services were historically RxJS-heavy (`BehaviorSubject` + `asObservable()`); the modern equivalent uses a private `signal` + `asReadonly()`. Reach for a service whenever two components need the same data, or when a component is doing non-view work that you'd want to unit-test in isolation.

## Examples

### A signal-based state service (modern shared state)
```ts
@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<Item[]>([]);     // private writable
  readonly items = this._items.asReadonly(); // public read-only signal
  readonly count = computed(() => this._items().length);

  add(item: Item)    { this._items.update(xs => [...xs, item]); }
  remove(id: string) { this._items.update(xs => xs.filter(x => x.id !== id)); }
}
```

### Consuming it from components
```ts
export class Navbar  { cart = inject(CartService); }   // template: {{ cart.count() }}
export class Product { private cart = inject(CartService);
  buy(item: Item) { this.cart.add(item); }
}
// Both share the SAME CartService instance (root singleton) -> shared state.
```

## Related Topics
- [[dependency-injection|Dependency Injection]]
- [[http-client|HttpClient]]
- [[signals|Signals]]
- [[rxjs-interop|RxJS Interop]]

## Cards

```anki
START
Basic
Services: What belongs in a service rather than a component?
Back: Anything that isn't view logic: data access, HTTP, business rules, and shared state. Components render; services do the work, and DI shares them.
<!--ID: 1783445399146-->
END

START
Basic
Services: How is a root-provided service Angular's idiomatic shared/global state?
Back: providedIn: 'root' makes it a singleton, so every component that injects it gets the same instance. Hold state (signals) in the service; all consumers read/write the one copy.
<!--ID: 1783445399149-->
END

START
Basic
Services: What's the "private signal + asReadonly()" pattern and why use it?
Back: Keep the writable signal private and expose `_x.asReadonly()` publicly, mutating only through methods. Consumers can read but not bypass your logic — a controlled single source of truth.
<!--ID: 1783445399152-->
END

START
Basic
Services: What's the modern signal-based replacement for the old `BehaviorSubject` + `asObservable()` service pattern?
Back: A private writable signal() exposed via .asReadonly() (and computed() for derived views). Same encapsulation, no subscription/teardown boilerplate.
<!--ID: 1783445399155-->
END

START
Basic
Services: When should you extract logic from a component into a service?
Back: When two+ components need the same data/behavior, or when a component does non-view work you'd want to unit-test in isolation. Shared or testable -> service.
<!--ID: 1783445399158-->
END

START
Basic
Services: Two components inject the same root service and see different data. What's the likely cause?
Back: One of them re-provided the service in its own `providers` array, creating a separate instance. Component-level providers break the root singleton; remove it to share state.
<!--ID: 1783445399161-->
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
