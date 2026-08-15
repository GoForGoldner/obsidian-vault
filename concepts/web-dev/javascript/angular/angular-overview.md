---
tags: [angular, web-dev, framework]
category: web-dev
related: [components-and-templates, signals, dependency-injection, typescript-overview, react-overview]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
Angular is a **batteries-included** TypeScript framework for building web apps — it ships routing, forms, HTTP, DI, and a CLI in the box, unlike React which is a library you assemble. The unit of UI is a **component**: a TypeScript class decorated with `@Component`, paired with an HTML template and styles. Modern Angular (v17+, fully matured by v20 and current in v22 as of 2026) has shifted hard toward three things: **standalone components** (no more `NgModule` boilerplate — components import their own dependencies), **signals** (a fine-grained reactivity primitive, `UI = f(signals)`), and **built-in control flow** (`@if`/`@for`/`@switch` in templates instead of the old `*ngIf`/`*ngFor` directives). Coming from React: components are classes not functions, "props" are `input()` signals, "state" is `signal()`, and there's a first-class **dependency injection** system (you `inject()` services rather than importing singletons). Change detection traditionally relied on **Zone.js** monkey-patching async APIs to know when to re-render; modern Angular is going **zoneless**, driven by signals instead. TypeScript is mandatory, not optional.

## Examples

### A standalone component (the modern default)
```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',          // used as <app-counter /> in templates
  standalone: true,                 // implicit/default since v19 — no NgModule needed
  template: `<button (click)="inc()">Clicked {{ count() }} times</button>`,
})
export class Counter {
  count = signal(0);                // reactive state
  inc() { this.count.update(n => n + 1); }
}
```

### Bootstrapping an app without NgModule
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';

bootstrapApplication(App, {
  providers: [/* provideRouter(...), provideHttpClient(), ... */],
});
```

## Related Topics
- [[components-and-templates|Components & Templates]]
- [[signals|Signals]]
- [[dependency-injection|Dependency Injection]]
- [[control-flow|Control Flow]]
- [[react-overview|React (comparison)]]

## Cards

```anki
START
Basic
Angular Overview: How is Angular fundamentally different in scope from React?
Back: Angular is a full framework — routing, forms, HTTP, DI, and CLI are built in. React is a UI library you assemble with third-party packages. With Angular you adopt conventions; with React you make choices.
<!--ID: 1783445398799-->
END

START
Basic
Angular Overview: What are the three big shifts that define "modern" Angular (v17+/v20+)?
Back: Standalone components (no NgModule), signals (fine-grained reactivity), and built-in control flow (@if/@for/@switch). Plus the move toward zoneless change detection.
<!--ID: 1783445398802-->
END

START
Basic
Angular Overview: In Angular, what is a "component" made of?
Back: A TypeScript class decorated with @Component, a `selector`, an HTML template, and optional styles. The class holds state/logic; the template binds to it.
<!--ID: 1783445398805-->
END

START
Basic
Angular Overview: Coming from React, map the concepts: props, state, context/shared singletons. What are Angular's equivalents?
Back: props -> input() signals; state -> signal(); shared singletons -> services injected via dependency injection (inject()).
<!--ID: 1783445398808-->
END

START
Basic
Angular Overview: What did "standalone" components eliminate, and what's their status by v19+?
Back: They eliminated NgModule boilerplate — a component declares its own imports directly. Standalone is the default since v19; you rarely write NgModules in new code.
<!--ID: 1783445398811-->
END

START
Basic
Angular Overview: What is Zone.js's role, and why is Angular moving "zoneless"?
Back: Zone.js monkey-patches async APIs (setTimeout, events, fetch) so Angular knows when to re-check the UI. Zoneless drops it and drives change detection from signals instead — fewer needless checks, better performance.
<!--ID: 1783445398815-->
END

START
Basic
Angular Overview: Why is TypeScript not optional in Angular the way it is in React?
Back: Angular is built around decorators, DI tokens, and typed templates — the framework, CLI, and tooling assume TypeScript. It's the native language of Angular apps.
<!--ID: 1783445398818-->
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
