---
tags: [angular, web-dev, http, rxjs]
category: web-dev
related: [services, rxjs-interop, dependency-injection, json-and-fetch]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
`HttpClient` is Angular's service for talking to APIs. You enable it once with `provideHttpClient()` at bootstrap, then `inject(HttpClient)` in a service. Its defining trait: methods like `http.get<T>(url)` return a **cold Observable** — the request **doesn't fire until you `subscribe()`** (or pipe it through the `async` pipe / `toSignal`/`rxResource`). "Cold" also means each subscription triggers a *new* request, so two subscribers = two HTTP calls (use `shareReplay` to dedupe). Responses are auto-parsed as JSON by default, and you type them with the generic (`get<User>`). Cross-cutting concerns go in **functional interceptors** — `HttpInterceptorFn` functions registered via `withInterceptors([...])` — for attaching auth tokens, logging, retries, or error handling to every request without touching call sites. Modern data-loading increasingly skips manual subscription entirely: **`rxResource`/`httpResource`** wrap an HTTP call as a signal-based **resource** that auto-refetches when its input signals change and exposes `value()`, `status()`, `error()` signals — no `subscribe`, no `async` pipe, no teardown. Error handling uses RxJS `catchError`; remember a `404` rejects the Observable, so handle it in `catchError` or the `subscribe` error callback.

## Examples

### A typed service call (cold Observable)
```ts
@Injectable({ providedIn: 'root' })
export class UserApi {
  private http = inject(HttpClient);
  getUser(id: string) {
    return this.http.get<User>(`/api/users/${id}`).pipe(
      retry(2),
      catchError(err => { console.error(err); return of(null); }),
    );
  }
}
// request fires only when something subscribes (or async pipe / toSignal)
```

### Functional interceptor (auth on every request)
```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
// bootstrap: provideHttpClient(withInterceptors([authInterceptor]))
```

### Modern signal-based loading (no subscribe)
```ts
userId = signal('42');
userRes = rxResource({
  request: () => this.userId(),                 // re-runs when userId changes
  loader: ({ request }) => this.http.get<User>(`/api/users/${request}`),
});
// template: @if (userRes.value(); as u) { {{ u.name }} }
```

## Related Topics
- [[services|Services]]
- [[rxjs-interop|RxJS Interop]]
- [[dependency-injection|Dependency Injection]]
- [[json-and-fetch|JSON & Fetch (comparison)]]

## Cards

```anki
START
Basic
HttpClient: Why doesn't `http.get(url)` send a request by itself?
Back: It returns a cold Observable — nothing happens until you subscribe (directly, via the async pipe, or via toSignal/rxResource). No subscription, no request.
<!--ID: 1783445398992-->
END

START
Basic
HttpClient: Two components subscribe to the same `http.get()` Observable. How many HTTP requests fire and why?
Back: Two — cold Observables run the producer per subscription. To share one response across subscribers, pipe through shareReplay (or load once in a service).
<!--ID: 1783445398996-->
END

START
Basic
HttpClient: Where should cross-cutting request logic (auth headers, logging, retries) live?
Back: In a functional HTTP interceptor (HttpInterceptorFn) registered via withInterceptors([...]). It wraps every request centrally, so call sites stay clean.
<!--ID: 1783445399001-->
END

START
Basic
HttpClient: How do you type the response of an HttpClient call?
Back: With the generic: http.get<User>(url). HttpClient parses JSON by default and types the emitted value as User. The generic is a compile-time annotation, not runtime validation.
<!--ID: 1783445399005-->
END

START
Basic
HttpClient: What does rxResource/httpResource give you over manually subscribing?
Back: A signal-based resource that auto-refetches when its request signals change and exposes value()/status()/error() signals — no subscribe, no async pipe, no manual teardown.
<!--ID: 1783445399009-->
END

START
Basic
HttpClient: A request 404s. Where do you handle it with HttpClient?
Back: The Observable errors, so handle it in catchError (RxJS) or the error callback of subscribe. HttpErrorResponse carries the status; use catchError to recover or rethrow.
<!--ID: 1783445399014-->
END

START
Basic
HttpClient: What single call enables HttpClient in a modern standalone app?
Back: provideHttpClient() in the bootstrap providers (add withInterceptors([...]) for interceptors). Then inject(HttpClient) anywhere.
<!--ID: 1783445399018-->
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
