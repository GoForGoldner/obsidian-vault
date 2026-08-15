---
tags: [angular, web-dev, dependency-injection, architecture]
category: web-dev
related: [services, angular-overview, http-client, lifecycle-hooks]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
Dependency injection is one of Angular's defining features: instead of `new`-ing your dependencies, you declare what you need and Angular's **injector** hands you an instance. The modern way to grab one is the **`inject(Token)`** function called in a **field initializer** (`private api = inject(ApiService)`) — it's more flexible than the old constructor-parameter style and composes with helper functions. Services register themselves with `@Injectable({ providedIn: 'root' })`, which makes them an **app-wide singleton that is tree-shakable** (dropped from the bundle if never injected). Injectors are **hierarchical**: there's a root injector plus one per lazy route and per component (if it declares `providers`), and resolution walks **up** the tree until a provider is found — so a component-level provider gives that component subtree its own instance. The critical rule: `inject()` only works inside an **injection context** — constructors, field initializers, factory functions, and route guards — calling it later (e.g. inside a click handler or `setTimeout`) throws. Resolution modifiers tune the lookup: `{ optional: true }` returns `null` instead of throwing, `{ self: true }` looks only on the current injector, `{ skipSelf: true }` skips it, and `{ host: true }` stops at the host element.

## Examples

### Providing and injecting a singleton
```ts
@Injectable({ providedIn: 'root' })   // app-wide, tree-shakable singleton
export class UserService {
  getUser(id: string) { /* ... */ }
}

@Component({ /* ... */ })
export class Profile {
  private users = inject(UserService);   // field initializer = injection context
  user = this.users.getUser('42');
}
```

### Component-scoped instance + optional dependency
```ts
@Component({
  providers: [CartService],   // a NEW CartService for this component subtree
})
export class Checkout {
  private cart   = inject(CartService);
  private logger = inject(LoggerService, { optional: true }); // null if not provided
}
```

### Non-class tokens
```ts
export const API_URL = new InjectionToken<string>('API_URL');
// provide: { provide: API_URL, useValue: 'https://api.example.com' }
const url = inject(API_URL);
```

## Related Topics
- [[services|Services]]
- [[angular-overview|Angular Overview]]
- [[http-client|HttpClient]]

## Cards

```anki
START
Basic
Dependency Injection: What is the modern way to obtain a dependency, and where can you call it?
Back: inject(Token), typically in a class field initializer or constructor body. It only works in an injection context (constructors, field initializers, factories, route guards).
<!--ID: 1783445398886-->
END

START
Basic
Dependency Injection: What does `@Injectable({ providedIn: 'root' })` give you?
Back: An application-wide singleton that's tree-shakable — if nothing ever injects the service, it's dropped from the bundle. No NgModule registration needed.
<!--ID: 1783445398889-->
END

START
Basic
Dependency Injection: You call inject() inside a button click handler and it throws. Why?
Back: inject() only runs inside an injection context (construction-time). A click handler runs later, outside that context. Inject in a field/constructor and store the reference instead.
<!--ID: 1783445398893-->
END

START
Basic
Dependency Injection: What happens when you put a service in a component's `providers` array?
Back: That component (and its child subtree) gets its OWN instance instead of the root singleton. Injectors are hierarchical; a component-level provider creates a scoped instance.
<!--ID: 1783445398896-->
END

START
Basic
Dependency Injection: How does Angular resolve a dependency in its hierarchical injector tree?
Back: It walks UP from the requesting injector (component -> ... -> root) until it finds a provider for the token. First match wins; if none is found it throws (unless optional).
<!--ID: 1783445398898-->
END

START
Basic
Dependency Injection: Name the resolution modifiers and what each does.
Back: optional -> return null instead of throwing; self -> only the current injector; skipSelf -> skip current, start at parent; host -> stop at the host element's injector.
<!--ID: 1783445398903-->
END

START
Basic
Dependency Injection: You want to inject a plain value (string/config), not a class. How?
Back: Create an InjectionToken<T>, provide it with useValue (or useFactory), then inject(THE_TOKEN). Classes can be their own token; non-class values need an InjectionToken.
<!--ID: 1783445398907-->
END

START
Basic
Dependency Injection: Why prefer DI over importing a shared singleton module directly (React-style)?
Back: DI decouples the consumer from construction — you can swap implementations, scope instances per subtree, and mock easily in tests, all without the consumer changing.
<!--ID: 1783445398912-->
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
