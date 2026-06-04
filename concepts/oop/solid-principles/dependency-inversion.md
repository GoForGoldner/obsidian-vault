---
tags: [oop, solid, principles]
category: oop
related: [dependency-injection-pattern, repository-pattern]
---

## Description
The "D" in SOLID. High-level modules should not depend on low-level modules. both should depend on abstractions (interfaces). Instead of a service directly referencing a concrete database class, it references an IDatabase interface. This makes it easy to swap implementations and test with mocks.
## Examples
Bad (high-level depends on low-level):
```java
class OrderService {
    private MySqlDatabase db = new MySqlDatabase(); // tightly coupled
}
```

Good (both depend on abstraction):
```java
interface Database {
    void save(Order order);
}

class OrderService {
    private Database db;
    OrderService(Database db) { this.db = db; } // inject anything
}

class MySqlDatabase implements Database { ... }
class MongoDatabase implements Database { ... }
```

## Related Topics
- [[dependency-injection-pattern|Dependency Injection]]
- [[repository-pattern|Repository Pattern]]
- [[dependency-inversion|SOLID Principles]]
- [[dependency-inversion|Interfaces]]
- [[dependency-inversion|Loose Coupling]]

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
