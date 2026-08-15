---
tags: [angular, web-dev, templates, control-flow]
category: web-dev
related: [components-and-templates, signals, change-detection, conditional-rendering-and-lists]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
Modern Angular (v17+, default in new projects) has **built-in control flow blocks** in templates — `@if`, `@for`, `@switch` — that replace the old structural directives `*ngIf`, `*ngFor`, `*ngSwitch`. They're real template syntax, not directives, so they need no imports, are faster, and give compile-time type narrowing. **`@for` requires a `track` expression** — this is the #1 gotcha: `track` tells Angular how to identify each item across renders so it can reuse DOM nodes instead of destroying/recreating them (track by a stable id, not `$index`, when items can reorder). `@for` exposes contextual variables — `$index`, `$count`, `$first`, `$last`, `$even`, `$odd` — and an optional `@empty {}` block for the empty-list case. `@if` supports `@else if`/`@else` and can alias the truthy result with `as`. `@switch` uses strict (`===`) equality with `@case`/`@default` and no fallthrough. The separate **`@defer`** block lazy-loads a chunk of template (and its component code) on a trigger like `on viewport`, `on interaction`, `on idle`, or `when condition`, with `@placeholder`/`@loading`/`@error` sub-blocks — it's the built-in way to code-split and defer non-critical UI.

## Examples

### @if / @else
```html
@if (user(); as u) {
  <p>Welcome, {{ u.name }}</p>
} @else if (loading()) {
  <p>Loading…</p>
} @else {
  <p>Please log in</p>
}
```

### @for with mandatory track + @empty
```html
@for (todo of todos(); track todo.id; let i = $index, last = $last) {
  <li [class.last]="last">{{ i + 1 }}. {{ todo.title }}</li>
} @empty {
  <li>No todos yet</li>
}
```

### @switch and @defer
```html
@switch (status()) {
  @case ('active')  { <app-active /> }
  @case ('paused')  { <app-paused /> }
  @default          { <app-unknown /> }
}

@defer (on viewport; prefetch on idle) {
  <app-heavy-chart />
} @placeholder { <p>Scroll to load chart</p> }
  @loading (after 100ms) { <app-spinner /> }
  @error { <p>Failed to load</p> }
```

## Related Topics
- [[components-and-templates|Components & Templates]]
- [[signals|Signals]]
- [[change-detection|Change Detection & Zoneless]]
- [[conditional-rendering-and-lists|React Conditional Rendering & Lists (comparison)]]

## Cards

```anki
START
Basic
Control Flow: What replaced *ngIf, *ngFor, and *ngSwitch in modern Angular, and why is the new form better?
Back: Built-in blocks @if, @for, @switch. They need no imports, are faster, and give compile-time type narrowing — they're real template syntax, not directives.
<!--ID: 1783445398862-->
END

START
Basic
Control Flow: What's the one thing @for requires that @ngFor didn't make mandatory, and why does it matter?
Back: A `track` expression. It tells Angular how to identify each item across renders so it reuses DOM nodes instead of destroying/recreating them. Forgetting it is a compile error.
<!--ID: 1783445398865-->
END

START
Basic
Control Flow: In @for, when should you NOT track by $index?
Back: When items can be reordered, inserted, or removed. Tracking by $index ties DOM to position, so Angular reuses the wrong nodes (state/focus jumps). Track by a stable id instead.
<!--ID: 1783445398868-->
END

START
Basic
Control Flow: How do you render a fallback when a @for list is empty?
Back: Add an @empty block right after the @for: `@for (...) { ... } @empty { <li>None</li> }`. No need for a separate @if on the length.
<!--ID: 1783445398871-->
END

START
Basic
Control Flow: Inside @for, name the contextual variables available.
Back: $index, $count, $first, $last, $even, $odd. Alias them with `let i = $index`. They give position info without manual bookkeeping.
<!--ID: 1783445398874-->
END

START
Basic
Control Flow: What does @defer do and name three triggers.
Back: Lazy-loads a block of template (and its component's code) until a trigger fires. Triggers: on viewport, on interaction, on hover, on idle, on timer, or when <condition>.
<!--ID: 1783445398877-->
END

START
Basic
Control Flow: What are the @defer sub-blocks and when does each show?
Back: @placeholder (before the trigger fires), @loading (while the deferred code downloads), @error (if loading fails). All optional.
<!--ID: 1783445398880-->
END

START
Basic
Control Flow: How does @if let you capture and reuse the truthy value of its condition?
Back: With `as`: `@if (user(); as u) { {{ u.name }} }`. `u` is the narrowed, non-null value, avoiding repeated calls and null checks.
<!--ID: 1783445398883-->
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
