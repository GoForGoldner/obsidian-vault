---
tags: [angular, web-dev, directives, templates]
category: web-dev
related: [components-and-templates, control-flow, signals, dependency-injection]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
A **directive** is a class that attaches behavior to an existing element without rendering its own template (a component is really just a directive *with* a template). There are two kinds. **Attribute directives** change the appearance or behavior of an element — e.g. the built-in `ngClass`/`ngStyle`, or a custom `appHighlight` that sets a background on hover. **Structural directives** change the **DOM layout** by adding/removing elements — the classic `*ngIf`/`*ngFor`/`*ngSwitch`, whose `*` syntax desugars to an `<ng-template>`. In modern Angular the built-in **structural** directives are largely replaced by the `@if`/`@for`/`@switch` control-flow blocks, so new custom directives are usually **attribute** directives. You build one with `@Directive({ selector: '[appThing]' })`, inject `ElementRef`/`Renderer2` for DOM access, and wire interactivity with `@HostListener` (listen to host events) and `@HostBinding`/the `host` metadata (bind to host properties). Inputs work just like on components — including signal `input()` — so a directive can be configured per-element. A directive's `selector` is typically an **attribute selector** `[appThing]`, which is why you apply it like an attribute: `<p appThing>`.

## Examples

### A custom attribute directive
```ts
@Directive({ selector: '[appHighlight]' })
export class Highlight {
  color = input('yellow', { alias: 'appHighlight' });   // <p [appHighlight]="'pink'">
  private el = inject(ElementRef<HTMLElement>);

  @HostListener('mouseenter') onEnter() { this.set(this.color()); }
  @HostListener('mouseleave') onLeave() { this.set(''); }
  private set(c: string) { this.el.nativeElement.style.backgroundColor = c; }
}
```

### Built-in attribute directives
```html
<div [ngClass]="{ active: isActive(), disabled: isDisabled() }"></div>
<div [ngStyle]="{ color: color(), 'font-size.px': size() }"></div>
<p appHighlight>Hover me</p>
```

## Related Topics
- [[components-and-templates|Components & Templates]]
- [[control-flow|Control Flow]]
- [[dependency-injection|Dependency Injection]]
- [[pipes|Pipes]]

## Cards

```anki
START
Basic
Directives: What's the relationship between a directive and a component?
Back: A component is a directive WITH a template. A plain directive attaches behavior to an existing element and renders no template of its own.
<!--ID: 1783445398917-->
END

START
Basic
Directives: Attribute directive vs structural directive — what does each change?
Back: Attribute directives change an element's appearance/behavior (ngClass, ngStyle, a custom highlight). Structural directives change DOM layout by adding/removing elements (*ngIf, *ngFor).
<!--ID: 1783445398921-->
END

START
Basic
Directives: Why are custom STRUCTURAL directives rarer in modern Angular?
Back: The built-in structural directives (*ngIf/*ngFor/*ngSwitch) are replaced by @if/@for/@switch control-flow blocks. New custom directives are usually attribute directives.
<!--ID: 1783445398926-->
END

START
Basic
Directives: How does a directive react to events on its host element?
Back: @HostListener('event') on a method (or the host metadata). For binding host properties/attributes use @HostBinding or the host map. ElementRef/Renderer2 give DOM access.
<!--ID: 1783445398944-->
END

START
Basic
Directives: Why do you apply a directive like an attribute, e.g. `<p appHighlight>`?
Back: Its selector is an attribute selector, '[appHighlight]'. Angular matches the directive to any element carrying that attribute.
<!--ID: 1783445398951-->
END

START
Basic
Directives: How do you make a custom directive configurable per element?
Back: Give it inputs (input()/@Input), often aliased to the selector name so you can write [appHighlight]="'pink'". Each host element binds its own value.
<!--ID: 1783445398956-->
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
