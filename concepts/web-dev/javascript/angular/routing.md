---
tags: [angular, web-dev, routing, navigation]
category: web-dev
related: [angular-overview, dependency-injection, control-flow, lifecycle-hooks]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
Angular's **Router** maps URL paths to components, enabling a single-page app with deep-linkable views. You define a flat array of `Route` objects (`{ path, component }`) and register it once with `provideRouter(routes)` at bootstrap. `<router-outlet>` is the placeholder where the matched component renders; `routerLink` is the declarative navigation directive (use it instead of `href` to avoid full-page reloads), and `Router.navigate()` does it imperatively. Two big modern wins: **lazy loading** with `loadComponent: () => import('./x').then(m => m.X)` (code-splits a route's bundle so it only downloads when visited), and **functional guards/resolvers** — plain functions like `CanActivateFn` that use `inject()` (no guard classes anymore). Route data flows in via `ActivatedRoute`; with `withComponentInputBinding()` enabled, route **params, query params, and resolver data bind straight to your component's `input()` signals** — no manual `ActivatedRoute` subscription. Key distinctions to keep straight: **path params** (`/users/:id`, part of the route) vs **query params** (`?sort=asc`, optional filters); and matching order matters — `''` and `**` (wildcard 404) routes go last.

## Examples

### Routes with lazy loading, params, and a functional guard
```ts
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'users/:id', component: UserDetail, canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./admin').then(m => m.Admin) },
  { path: '**', component: NotFound },   // wildcard 404 — must be last
];

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).isLoggedIn() || router.createUrlTree(['/login']);
};
```

### Outlet, links, and param-as-input
```html
<a routerLink="/users/42" routerLinkActive="active">User 42</a>
<router-outlet />
```
```ts
// with provideRouter(routes, withComponentInputBinding())
export class UserDetail { id = input.required<string>(); } // ":id" binds here
```

## Related Topics
- [[angular-overview|Angular Overview]]
- [[dependency-injection|Dependency Injection]]
- [[inputs-outputs-model|Inputs, Outputs & Model]]

## Cards

```anki
START
Basic
Routing: What's the difference between <router-outlet> and routerLink?
Back: <router-outlet> is the placeholder where the matched route's component renders. routerLink is the directive you put on an anchor to navigate without a full page reload.
<!--ID: 1783445399125-->
END

START
Basic
Routing: Why use routerLink instead of a plain href for in-app navigation?
Back: href triggers a full-page reload (re-bootstraps the whole app). routerLink does client-side navigation — the Router swaps the outlet content and updates the URL, preserving app state.
<!--ID: 1783445399128-->
END

START
Basic
Routing: How do you lazy-load a route's component so its code only downloads when visited?
Back: Use loadComponent: () => import('./x').then(m => m.X) instead of component:. The router code-splits that bundle and fetches it on navigation.
<!--ID: 1783445399131-->
END

START
Basic
Routing: What replaced class-based route guards in modern Angular?
Back: Functional guards — plain functions typed as CanActivateFn/CanMatchFn that call inject() for dependencies and return boolean/UrlTree/Observable. No guard classes needed.
<!--ID: 1783445399134-->
END

START
Basic
Routing: Path param vs query param — when do you use each, and how are they written?
Back: Path param (/users/:id) identifies a resource and is part of the route. Query param (?sort=asc) is optional state/filter on a page. Path = identity, query = options.
<!--ID: 1783445399137-->
END

START
Basic
Routing: With withComponentInputBinding() enabled, how do you read a route param like :id?
Back: Declare an input() with the same name (id = input.required<string>()). The router binds the param, query param, or resolver data straight to the signal input — no ActivatedRoute subscription.
<!--ID: 1783445399140-->
END

START
Basic
Routing: Why must the '' (empty) and '**' (wildcard) routes come last in the array?
Back: The router matches top-down, first match wins. '' matches the base and '**' matches anything, so placing them early would shadow more specific routes. Wildcard 404 goes last.
<!--ID: 1783445399143-->
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
