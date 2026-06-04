---
tags: [design-pattern, behavioral]
category: patterns
related: [state-pattern, dependency-injection-pattern]
---

## Description
A pattern that lets you define a family of algorithms, put each one in its own class, and make them interchangeable. The caller picks which strategy to use at runtime.

## Benefits
- Swap algorithms at runtime without changing client code
- Each algorithm is isolated and testable
- Follows open/closed principle

## Downsides
- Client needs to know which strategies exist to pick one
- More classes for simple algorithm variations


## Examples
```java
interface PaymentStrategy {
    void pay(double amount);
}

class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) { /* charge card */ }
}

class PayPalPayment implements PaymentStrategy {
    public void pay(double amount) { /* PayPal API call */ }
}

class CheckoutService {
    void checkout(Cart cart, PaymentStrategy strategy) {
        strategy.pay(cart.getTotal()); // caller picks which strategy
    }
}

// Usage - swap freely
checkout.checkout(cart, new CreditCardPayment());
checkout.checkout(cart, new PayPalPayment());
```

## Related Topics
- [[state-pattern|State Pattern]]
- [[dependency-injection-pattern|Dependency Injection]]
- [[stradegy-pattern|Open/Closed Principle]]
- [[dependency-inversion|Polymorphism]]

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
