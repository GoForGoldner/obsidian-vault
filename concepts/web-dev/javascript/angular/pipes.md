---
tags: [angular, web-dev, pipes, templates]
category: web-dev
related: [components-and-templates, rxjs-interop, change-detection, directives]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
A **pipe** transforms a value *for display* directly in the template with the `|` syntax — `{{ value | pipeName:arg }}` — keeping formatting out of your component class. Angular ships many: `date`, `currency`, `number`, `percent`, `uppercase`/`lowercase`/`titlecase`, `json` (debugging), `slice`, `keyvalue`, and the special **`async`** pipe (subscribes to an Observable/Promise and renders its latest value, auto-unsubscribing). You can chain them (`birthday | date:'short' | uppercase`) and pass arguments after a colon (`amount | currency:'EUR'`). The crucial concept is **pure vs impure**. A **pure** pipe (the default) only re-runs when its **input reference changes** — so mutating an array/object in place (`arr.push(x)`) won't update the view, because the reference is the same; that's the #1 pipe gotcha, and the fix is to replace the reference (`arr = [...arr, x]`) or return a new value. An **impure** pipe (`pure: false`) re-runs on *every* change-detection cycle — flexible but a performance risk, which is exactly why `async` is impure. Pure pipes are also **cached/memoized** per input, making them cheap. Write a custom pipe with `@Transform`/`@Pipe({ name })` implementing `transform(value, ...args)`.

## Examples

### Built-in pipes, chaining, and arguments
```html
<p>{{ today | date:'fullDate' }}</p>           <!-- Saturday, June 29, 2026 -->
<p>{{ price | currency:'USD':'symbol' }}</p>    <!-- $19.99 -->
<p>{{ ratio | percent:'1.0-1' }}</p>            <!-- 42.5% -->
<p>{{ name | titlecase }}</p>
<pre>{{ user | json }}</pre>                     <!-- debugging -->
<p>{{ data$ | async }}</p>                      <!-- subscribe + render latest -->
```

### Custom pipe
```ts
@Pipe({ name: 'truncate' })
export class Truncate implements PipeTransform {
  transform(value: string, limit = 20): string {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}
// {{ description | truncate:50 }}
```

## Related Topics
- [[components-and-templates|Components & Templates]]
- [[rxjs-interop|RxJS Interop]]
- [[change-detection|Change Detection & Zoneless]]
- [[directives|Directives]]

## Cards

```anki
START
Basic
Pipes: What is a pipe for, and what's the point of using one over a method in the class?
Back: It transforms a value for display in the template via `value | pipe`. It keeps formatting out of the component, is reusable, and (when pure) is memoized so it's cheap.
<!--ID: 1783445399079-->
END

START
Basic
Pipes: When does a PURE pipe re-run, and what's the gotcha that follows?
Back: Only when its input REFERENCE changes. Gotcha: mutating an array/object in place (arr.push) keeps the same reference, so the view doesn't update. Replace the reference instead (arr = [...arr]).
<!--ID: 1783445399083-->
END

START
Basic
Pipes: A pipe over your list won't update after you add an item. What's the likely cause and fix?
Back: It's a pure pipe and you mutated the array in place (same reference). Fix: produce a new reference — arr = [...arr, item] — or use an impure pipe (perf cost).
<!--ID: 1783445399087-->
END

START
Basic
Pipes: Pure vs impure pipe — when does each run, and why is `async` impure?
Back: Pure runs only on input-reference change (memoized). Impure runs every change-detection cycle. async is impure because new emissions arrive over time, not via a reference change.
<!--ID: 1783445399091-->
END

START
Basic
Pipes: How do you pass arguments to a pipe and chain multiple pipes?
Back: Arguments after a colon: amount | currency:'EUR'. Chain with more pipes left-to-right: birthday | date:'short' | uppercase.
<!--ID: 1783445399094-->
END

START
Basic
Pipes: What does the async pipe save you from writing manually?
Back: subscribe(), storing the value, and unsubscribe() on destroy. It subscribes, renders the latest value, and tears down automatically when the view is destroyed.
<!--ID: 1783445399100-->
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
