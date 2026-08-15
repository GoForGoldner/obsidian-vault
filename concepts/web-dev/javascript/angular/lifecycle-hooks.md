---
tags: [angular, web-dev, components, lifecycle]
category: web-dev
related: [components-and-templates, signals, inputs-outputs-model, useeffect]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
Lifecycle hooks are methods Angular calls at defined moments of a component's existence. The ones that matter most: **`ngOnInit`** — runs once after the first inputs are set; the right place for initialization (NOT the constructor, which runs before inputs exist). **`ngOnChanges`** — runs whenever a *decorator-based* `@Input()` changes, receiving a `SimpleChanges` map; with **signal inputs you rarely need it** because you react with `computed`/`effect` instead. **`ngOnDestroy`** — runs right before the component is torn down; your cleanup hook for manual subscriptions, timers, and listeners. **`ngAfterViewInit`** — runs once after the component's view and its child views/`viewChild` queries are initialized (the moment your `@ViewChild`/`viewChild()` refs are reliably available). The modern, signal-friendly additions are **`afterNextRender`** (run a callback once after the next render, browser-only — perfect for DOM measurement) and **`afterRender`/`afterRenderEffect`** (after every render). The two classic gotchas: doing input-dependent work in the **constructor** (inputs aren't set yet) and forgetting **`ngOnDestroy`** cleanup (leaking subscriptions/timers). With signals + the `async` pipe + `takeUntilDestroyed()`, manual `ngOnDestroy` teardown is increasingly unnecessary.

## Examples

### The common hooks
```ts
export class Widget implements OnInit, OnDestroy {
  data = input<string>();
  private timer?: number;

  constructor() { /* DI only — inputs are NOT set yet */ }

  ngOnInit() {
    // inputs are available now; do initialization here
    this.timer = window.setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);  // cleanup to avoid leaks
  }
}
```

### Modern render hooks + auto-teardown
```ts
export class Chart {
  private el = inject(ElementRef);
  constructor() {
    afterNextRender(() => {
      // DOM exists & measured — browser only
      const width = this.el.nativeElement.offsetWidth;
    });
    interval(1000)
      .pipe(takeUntilDestroyed())   // auto-unsubscribe on destroy, no ngOnDestroy
      .subscribe(/* ... */);
  }
}
```

## Related Topics
- [[components-and-templates|Components & Templates]]
- [[inputs-outputs-model|Inputs, Outputs & Model]]
- [[signals|Signals]]
- [[useeffect|React useEffect (comparison)]]

## Cards

```anki
START
Basic
Lifecycle Hooks: Why initialize in ngOnInit instead of the constructor?
Back: The constructor runs before Angular sets the component's inputs. ngOnInit runs once after the first inputs are bound, so input-dependent setup has real values to work with.
<!--ID: 1783445399024-->
END

START
Basic
Lifecycle Hooks: What is ngOnDestroy for, and what breaks if you skip it?
Back: Cleanup before teardown — clear timers, unsubscribe, remove listeners. Skipping it leaks subscriptions/intervals that keep running after the component is gone.
<!--ID: 1783445399028-->
END

START
Basic
Lifecycle Hooks: Why do signal inputs make ngOnChanges largely unnecessary?
Back: ngOnChanges existed to react to @Input() changes. Signal inputs are signals, so you react by reading them in computed()/effect() — the reactivity is automatic.
<!--ID: 1783445399032-->
END

START
Basic
Lifecycle Hooks: When is it safe to read a @ViewChild / viewChild() reference, and which hook guarantees it?
Back: After the view is initialized — ngAfterViewInit (or a viewChild signal read in an effect). In the constructor or ngOnInit the child view may not exist yet.
<!--ID: 1783445399037-->
END

START
Basic
Lifecycle Hooks: You need to measure a DOM element's size right after it renders. Which modern hook, and what's its constraint?
Back: afterNextRender(() => ...) — runs once after the next render and is browser-only (skipped during server-side rendering), so the DOM is present and measurable.
<!--ID: 1783445399040-->
END

START
Basic
Lifecycle Hooks: What's the modern way to auto-unsubscribe an Observable without writing ngOnDestroy?
Back: Pipe it through takeUntilDestroyed() (from @angular/core/rxjs-interop), which completes the stream when the component is destroyed. Or just use the async pipe.
<!--ID: 1783445399045-->
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
