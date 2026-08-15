---
tags: [angular, web-dev, change-detection, performance, signals]
category: web-dev
related: [signals, angular-overview, components-and-templates, pipes]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
**Change detection** is how Angular decides when to re-evaluate a template and update the DOM. Historically it relied on **Zone.js**, which monkey-patches async APIs (`setTimeout`, `addEventListener`, `fetch`, promises) so that after *any* of them finishes, Angular runs change detection over the **whole component tree**, comparing each bound expression to its previous value. That's why the default strategy is called catch-all but wasteful. The optimization knob is **`ChangeDetectionStrategy.OnPush`**: an OnPush component is only re-checked when one of a few things happens — an **`@Input()` reference changes**, an **event fires inside it**, an **Observable it consumes via `async` emits**, or you **manually mark it** (`ChangeDetectorRef.markForCheck()`). This is why **immutability matters** with OnPush: mutating an input object in place keeps the same reference, so Angular skips the update (the same class of bug as pure pipes). **Signals** change the model fundamentally: reading a signal in a template creates a dependency, so when it changes Angular knows **exactly which components** need updating — no tree-walking, no Zone.js. This enables **zoneless** Angular (`provideZonelessChangeDetection()`, stable in v20): Zone.js is dropped entirely and signals (plus events/async pipe) drive updates precisely. Net effect: with signals + OnPush/zoneless, you get fine-grained, opt-in updates instead of brute-force whole-tree checks.

## Examples

### OnPush + immutable updates
```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ user().name }}`,
})
export class Profile {
  user = input.required<User>();
}
// Parent: this.user.set({ ...this.user(), name: 'New' });  // NEW reference -> updates
// this.user().name = 'New';  // BUG under OnPush: same reference, view won't update
```

### Going zoneless (v20+)
```ts
bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection()],   // no Zone.js; signals drive CD
});
```

## Related Topics
- [[signals|Signals]]
- [[angular-overview|Angular Overview]]
- [[pipes|Pipes]]
- [[components-and-templates|Components & Templates]]

## Cards

```anki
START
Basic
Change Detection: What did Zone.js do for Angular's default change detection?
Back: It monkey-patched async APIs (setTimeout, events, fetch, promises) so that after any of them, Angular ran change detection over the whole component tree, re-checking every bound expression.
<!--ID: 1783445398843-->
END

START
Basic
Change Detection: When is an OnPush component re-checked?
Back: Only when an @Input reference changes, an event fires within it, an async-piped Observable it uses emits, or you call markForCheck(). Otherwise Angular skips it.
<!--ID: 1783445398847-->
END

START
Basic
Change Detection: Under OnPush, you set `this.user().name = 'New'` and the view doesn't update. Why?
Back: OnPush triggers on input REFERENCE change, but mutating in place keeps the same object reference. Replace it: user.set({ ...user(), name: 'New' }). Immutability is required.
<!--ID: 1783445398850-->
END

START
Basic
Change Detection: How do signals make change detection fine-grained?
Back: Reading a signal in a template registers a dependency, so on change Angular knows exactly which components to update — no whole-tree walk and no Zone.js needed.
<!--ID: 1783445398853-->
END

START
Basic
Change Detection: What is "zoneless" Angular and how do you enable it?
Back: Change detection driven by signals/events instead of Zone.js. Enable with provideZonelessChangeDetection() (stable in v20) and drop the zone.js polyfill. Fewer, more precise updates.
<!--ID: 1783445398856-->
END

START
Basic
Change Detection: Why do pure pipes and OnPush share the same "in-place mutation" gotcha?
Back: Both detect change by reference identity. Mutating an array/object in place leaves the reference unchanged, so both skip the update. The fix in both cases is to produce a new reference.
<!--ID: 1783445398859-->
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
