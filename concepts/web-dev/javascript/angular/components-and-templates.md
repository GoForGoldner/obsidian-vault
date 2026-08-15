---
tags: [angular, web-dev, components, templates]
category: web-dev
related: [angular-overview, signals, inputs-outputs-model, control-flow, lifecycle-hooks]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
A component couples a class with a template via the `@Component` decorator. The **template** is HTML plus Angular's binding syntax, and there are four binding kinds you must keep straight: **interpolation** `{{ expr }}` (text), **property binding** `[prop]="expr"` (set a DOM/component property), **event binding** `(event)="handler()"` (listen), and **two-way binding** `[(ngModel)]="x"` / `[(value)]="x"` (the "banana in a box" — property + event combined). The `selector` is how you place the component (`<app-foo />`), and Angular matches it like a CSS selector. Styles are **scoped to the component by default** (view encapsulation — Angular rewrites selectors with a unique attribute so your CSS can't leak out or in). You pass content into a component with `<ng-content>` (Angular's slot/`children` equivalent), and you can have multiple named slots via `<ng-content select="...">`. A key gotcha: template expressions must be **simple and side-effect-free** — Angular re-evaluates them on every change-detection pass, so no method that mutates state or does heavy work. Use `class.active="cond"` / `[class.active]` and `[style.color]` for conditional classes and styles rather than string concatenation.

## Examples

### The four binding types
```html
<h1>{{ title }}</h1>                          <!-- interpolation -->
<img [src]="user.avatarUrl" [alt]="user.name" /> <!-- property binding -->
<button (click)="save()">Save</button>         <!-- event binding -->
<input [(ngModel)]="name" />                    <!-- two-way binding -->

<div [class.active]="isActive" [style.color]="color">...</div>
```

### Content projection (slots)
```html
<!-- card.component template -->
<div class="card">
  <header><ng-content select="[card-title]"></ng-content></header>
  <ng-content></ng-content>   <!-- default slot for everything else -->
</div>

<!-- usage -->
<app-card>
  <h2 card-title>Hello</h2>
  <p>Body content goes into the default slot.</p>
</app-card>
```

## Related Topics
- [[angular-overview|Angular Overview]]
- [[inputs-outputs-model|Inputs, Outputs & Model]]
- [[control-flow|Control Flow]]
- [[signals|Signals]]
- [[lifecycle-hooks|Lifecycle Hooks]]

## Cards

```anki
START
Basic
Components & Templates: Name Angular's four binding syntaxes and the symbol for each.
Back: Interpolation {{ x }} (text), property binding [prop]="x" (set a property), event binding (event)="fn()" (listen), two-way [(x)]="y" (property + event combined).
<!--ID: 1783445398821-->
END

START
Basic
Components & Templates: What does the "banana in a box" `[(x)]` actually desugar to?
Back: A property binding plus an event binding: `[x]="y"` and `(xChange)="y = $event"`. Two-way is just shorthand for setting a value and listening for its change.
<!--ID: 1783445398824-->
END

START
Basic
Components & Templates: By default, can a component's CSS leak out to other components or be affected by global styles?
Back: No — styles are scoped via view encapsulation. Angular adds a unique attribute to the component's elements and rewrites your selectors to match only them.
<!--ID: 1783445398828-->
END

START
Basic
Components & Templates: Why must template expressions be simple and side-effect-free?
Back: Angular re-evaluates them on every change-detection pass. A method that mutates state or does heavy work runs constantly, causing bugs and jank. Keep template expressions pure and cheap.
<!--ID: 1783445398831-->
END

START
Basic
Components & Templates: You want to pass markup from a parent into a child component (like React's children). What do you use?
Back: <ng-content></ng-content> in the child's template — a projection slot. Use <ng-content select="[attr]"> for multiple named slots.
<!--ID: 1783445398834-->
END

START
Basic
Components & Templates: How do you conditionally apply a class or style without string concatenation?
Back: [class.active]="cond" toggles a single class; [style.color]="value" sets a single style. For many at once, [ngClass]/[ngStyle] take an object/map.
<!--ID: 1783445398837-->
END

START
Basic
Components & Templates: What is a component's `selector` and how does Angular match it?
Back: The tag/attribute used to place the component (e.g. 'app-foo' -> <app-foo />). Angular matches it like a CSS selector against the template.
<!--ID: 1783445398840-->
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
