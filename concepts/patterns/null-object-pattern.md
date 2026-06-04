---
tags: [design-pattern, behavioral]
category: patterns
related: [stradegy-pattern, dependency-injection-pattern]
---

## Description
A pattern that provides a default no-op behavior instead of using null checks everywhere. Instead of returning null and checking `if (obj != null)` before every call, return a NullObject that implements the same interface but does nothing.

## Benefits
- Eliminates repetitive null checks
- Code reads cleaner and is less error-prone
- Follows polymorphism over conditionals

## Downsides
- Can silently hide bugs (no-op when something should have failed)
- Harder to tell when something genuinely wasn't found


## Examples
```java
interface Logger {
    void log(String msg);
}

class ConsoleLogger implements Logger {
    public void log(String msg) { System.out.println(msg); }
}

// Null object - does nothing, no null checks needed
class NullLogger implements Logger {
    public void log(String msg) { /* no-op */ }
}

class OrderService {
    private Logger logger;
    OrderService(Logger logger) { this.logger = logger; }

    void placeOrder(Order o) {
        logger.log("Placing order");  // safe - never null
    }
}

// No logging needed? Pass NullLogger instead of null
new OrderService(new NullLogger());
```

## Related Topics
- [[stradegy-pattern|Strategy Pattern]]
- [[dependency-injection-pattern|Dependency Injection]]
- [[dependency-inversion|Polymorphism]]
- Default Implementations

## Cards
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
