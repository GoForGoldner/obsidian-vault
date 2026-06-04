---
tags: [design-pattern, structural]
category: patterns
related: [adapter-pattern, chain-of-responsibility-pattern]
---

## Description
A pattern that lets you add new behavior to an object by wrapping it in another object that has the same interface. You stack decorators like layers, each one adds something without modifying the original.

## Benefits
- Add behavior without touching existing code
- Can combine multiple decorators flexibly
- Follows open/closed principle

## Downsides
- Lots of small wrapper classes
- Debugging through layers of wrapping gets annoying
- Order of decoration can matter and be confusing


## Examples
```java
interface Coffee {
    double cost();
    String description();
}

class BasicCoffee implements Coffee {
    public double cost() { return 2.0; }
    public String description() { return "Coffee"; }
}

class MilkDecorator implements Coffee {
    private Coffee wrapped;
    MilkDecorator(Coffee c) { this.wrapped = c; }
    public double cost() { return wrapped.cost() + 0.5; }
    public String description() { return wrapped.description() + " + Milk"; }
}

// Stack decorators
Coffee order = new MilkDecorator(new SugarDecorator(new BasicCoffee()));
order.cost();        // 2.0 + 0.3 + 0.5 = 2.8
order.description(); // "Coffee + Sugar + Milk"
```

## Related Topics
- [[adapter-pattern|Adapter Pattern]]
- [[chain-of-responsibility-pattern|Chain of Responsibility]]
- [[chain-of-responsibility-pattern|Middleware]]
- [[stradegy-pattern|Open/Closed Principle]]

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
