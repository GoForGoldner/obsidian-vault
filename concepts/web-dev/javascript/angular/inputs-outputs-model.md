---
tags: [angular, web-dev, components, signals]
category: web-dev
related: [signals, components-and-templates, angular-overview, components-and-props]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
This is how components talk to each other. **`input()`** is the modern, signal-based replacement for the old `@Input()` decorator — the parent binds a value with `[prop]="..."` and the child reads it as a **signal** (`this.value()`). Use `input.required<T>()` when the input must be provided (Angular enforces it at build time), and pass `{ alias }` or `{ transform }` options to rename or coerce the incoming value (`booleanAttribute`/`numberAttribute` are built-in transforms — great for HTML attributes like `disabled`). **`output()`** replaces `@Output()`: it returns an emitter the child calls with `.emit(value)`, and the parent listens with `(eventName)="handler($event)"`. **`model()`** creates a **two-way bindable** signal: it's a writable signal in the child *and* automatically exposes a `{name}Change` output, so the parent can use `[(value)]="x"`. The big mental shift from `@Input()`: inputs are now **read as signals**, so they compose directly into `computed()` and `effect()` and trigger change detection precisely — no more `ngOnChanges` just to react to an input changing.

## Examples

### input, required, transform, alias
```ts
import { Component, input, output, model, booleanAttribute } from '@angular/core';

@Component({ selector: 'app-slider', /* ... */ })
export class Slider {
  value    = input(0);                                   // optional, default 0
  max      = input.required<number>();                   // must be bound
  disabled = input(false, { transform: booleanAttribute }); // "" / "true" -> true
  label    = input('', { alias: 'sliderLabel' });        // bound as [sliderLabel]

  // derive from an input signal directly
  percent = computed(() => (this.value() / this.max()) * 100);
}
```

### output — child emits, parent listens
```ts
export class Slider {
  changed = output<number>();
  onDrag(v: number) { this.changed.emit(v); }
}
// parent: <app-slider (changed)="onChanged($event)" [max]="100" />
```

### model — two-way binding
```ts
export class Slider {
  value = model(0);                       // writable signal + valueChange output
  bump() { this.value.update(v => v + 1); }
}
// parent: <app-slider [(value)]="volume" />   (volume is a signal)
```

## Related Topics
- [[signals|Signals]]
- [[components-and-templates|Components & Templates]]
- [[components-and-props|React Components & Props (comparison)]]

## Cards

```anki
START
Basic
Inputs, Outputs & Model: What is input() and how is it read inside the child component?
Back: The signal-based replacement for @Input(). The parent binds [prop]="x"; the child reads it as a signal by calling it: this.prop(). It composes directly into computed/effect.
<!--ID: 1783445399050-->
END

START
Basic
Inputs, Outputs & Model: How do you declare an input that the parent is forced to provide?
Back: input.required<T>() — no default value. Angular enforces at build time that the input must be bound wherever the component is used.
<!--ID: 1783445399054-->
END

START
Basic
Inputs, Outputs & Model: A boolean input bound from an HTML attribute arrives as the string "" or "true". How do you coerce it to a real boolean?
Back: input(false, { transform: booleanAttribute }). The booleanAttribute (and numberAttribute) helpers are built-in transforms for attribute-style inputs.
<!--ID: 1783445399058-->
END

START
Basic
Inputs, Outputs & Model: How does a child send an event up to its parent in modern Angular?
Back: output<T>() returns an emitter; the child calls .emit(value). The parent listens with (eventName)="handler($event)". It replaces @Output()/EventEmitter.
<!--ID: 1783445399062-->
END

START
Basic
Inputs, Outputs & Model: What does model() give you that input() + output() doesn't?
Back: Two-way binding. model() is a writable signal in the child AND auto-creates a {name}Change output, so the parent can write [(value)]="x". It's input + matching output in one.
<!--ID: 1783445399065-->
END

START
Basic
Inputs, Outputs & Model: Why do signal inputs reduce the need for ngOnChanges?
Back: Because inputs are signals, you react to changes by reading them in a computed() or effect() — the reactivity is automatic. You no longer need a lifecycle hook just to detect an input changing.
<!--ID: 1783445399070-->
END

START
Basic
Inputs, Outputs & Model: A parent writes `<app-slider [(value)]="volume" />`. What two bindings does that expand to and what must `volume` be?
Back: [value]="volume" and (valueChange)="volume.set($event)" (conceptually). With model() and signal-based parents, volume is itself a signal.
<!--ID: 1783445399074-->
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
