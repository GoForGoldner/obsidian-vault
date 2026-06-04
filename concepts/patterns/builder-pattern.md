---
tags: [design-pattern, creational]
category: patterns
related: [singleton-pattern, prototype-pattern]
---

## Description
A pattern that constructs complex objects step by step. Instead of a constructor with 10 parameters, you chain readable method calls.

## Benefits
- Handles optional parameters cleanly without constructor overloading
- Readable and self-documenting construction
- Can enforce required vs optional fields

## Downsides
- Extra boilerplate (builder class for each object)
- Overkill for simple objects with few fields


## Examples
```java
Pizza pizza = new Pizza.Builder()
    .setSize("large")
    .addTopping("cheese")
    .addTopping("pepperoni")
    .setStuffedCrust(true)    // optional
    .build();

// The Builder class (inside Pizza):
public static class Builder {
    private String size;
    private List<String> toppings = new ArrayList<>();
    private boolean stuffedCrust = false;

    public Builder setSize(String s) { size = s; return this; }
    public Builder addTopping(String t) { toppings.add(t); return this; }
    public Builder setStuffedCrust(boolean b) { stuffedCrust = b; return this; }
    public Pizza build() { return new Pizza(this); }
}
```

## Related Topics
- [[singleton-pattern|Singleton Pattern]]
- [[prototype-pattern|Prototype Pattern]]
- Factory Pattern
- [[builder-pattern|Fluent Interface]]

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
