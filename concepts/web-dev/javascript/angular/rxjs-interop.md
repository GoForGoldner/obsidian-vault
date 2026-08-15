---
tags: [angular, web-dev, rxjs, signals, async]
category: web-dev
related: [signals, http-client, services, async-promises]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
RxJS **Observables** are Angular's tool for **async event streams over time** — HTTP responses, websocket messages, user-input debouncing, intervals. The key contrasts with signals: an Observable is a **push stream of many values** that you must **subscribe** to (and clean up), and it shines with **operators** (`map`, `filter`, `switchMap`, `debounceTime`, `combineLatest`); a **signal** is a **synchronous, always-readable single value** with no subscription. Modern guidance: **signals for synchronous state, RxJS for async/event pipelines** — and bridge between them with `@angular/core/rxjs-interop`. **`toSignal(obs$)`** converts an Observable into a read-only signal (it auto-subscribes and auto-unsubscribes — no manual teardown). **`toObservable(sig)`** goes the other way, emitting whenever the signal changes. In templates, the **`async` pipe** (`obs$ | async`) subscribes, renders the latest value, and unsubscribes automatically — the idiomatic way to consume an Observable without `ngOnDestroy`. For component-scoped subscriptions you do keep, **`takeUntilDestroyed()`** completes the stream on destroy. The classic gotcha is the **memory leak from a manual `.subscribe()` you never unsubscribe** — prefer `async`/`toSignal`/`takeUntilDestroyed` so teardown is automatic.

## Examples

### Bridging both directions
```ts
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable -> signal (auto sub/unsub)
private http = inject(HttpClient);
user = toSignal(this.http.get<User>('/api/me'), { initialValue: null });

// signal -> Observable, then RxJS operators
query = signal('');
results$ = toObservable(this.query).pipe(
  debounceTime(300),
  switchMap(q => this.http.get<Item[]>(`/api/search?q=${q}`)),
);
```

### async pipe — subscribe/unsubscribe for free
```html
@if (user(); as u) { <p>{{ u.name }}</p> }
<!-- or directly on an Observable: -->
<p>{{ (results$ | async)?.length }} results</p>
```

### A subscription you keep — auto-teardown
```ts
constructor() {
  fromEvent(window, 'resize')
    .pipe(debounceTime(100), takeUntilDestroyed())
    .subscribe(() => this.recalc());
}
```

## Related Topics
- [[signals|Signals]]
- [[http-client|HttpClient]]
- [[services|Services]]
- [[async-promises|Promises (comparison)]]

## Cards

```anki
START
Basic
RxJS Interop: Signals vs Observables — what's each best for?
Back: Signals: synchronous, always-readable single value, no subscription — use for state. Observables: async push streams of many values over time with operators — use for events/HTTP/streams.
<!--ID: 1783445399104-->
END

START
Basic
RxJS Interop: What does toSignal(obs$) do, and what tedious work does it remove?
Back: Converts an Observable into a read-only signal you read with (). It auto-subscribes and auto-unsubscribes on destroy — no manual subscribe/unsubscribe or ngOnDestroy.
<!--ID: 1783445399108-->
END

START
Basic
RxJS Interop: You have a signal and need RxJS operators like debounceTime/switchMap on its changes. What do you use?
Back: toObservable(signal) — emits whenever the signal changes — then .pipe(...) the operators. It's the signal -> Observable bridge.
<!--ID: 1783445399111-->
END

START
Basic
RxJS Interop: What three things does the `async` pipe do for you in a template?
Back: Subscribes to the Observable, renders its latest emitted value, and unsubscribes automatically when the view is destroyed. No manual subscription management.
<!--ID: 1783445399115-->
END

START
Basic
RxJS Interop: You wrote `obs$.subscribe(...)` in a component and have a memory leak. What's the fix?
Back: Add takeUntilDestroyed() to the pipe so it completes on destroy — or avoid the manual subscribe entirely with the async pipe / toSignal.
<!--ID: 1783445399119-->
END

START
Basic
RxJS Interop: You need to cancel an in-flight request when a new one starts (typeahead). Which operator and why?
Back: switchMap — it unsubscribes from the previous inner Observable when a new source value arrives, cancelling the stale request. mergeMap would keep them all running.
<!--ID: 1783445399122-->
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
