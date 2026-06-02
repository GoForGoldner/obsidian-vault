---
tags: [web-dev, architecture]
category: web-dev
related: [microservices-vs-monolith, dependency-injection-pattern]
---

## Description
The structural design of the server-side application. Common patterns include layered architecture (Controller -> Service -> Repository), clean architecture (dependencies point inward), and microservices. The goal is separation of concerns so code is testable, maintainable, and swappable.
## Examples
```java
// Controller - handles HTTP, delegates to service
@RestController
class OrderController {
    @Autowired OrderService service;

    @PostMapping("/orders")
    Order create(@RequestBody OrderRequest req) {
        return service.createOrder(req);
    }
}

// Service - business logic, no HTTP knowledge
class OrderService {
    @Autowired OrderRepository repo;

    Order createOrder(OrderRequest req) {
        validate(req);
        Order order = new Order(req);
        return repo.save(order);
    }
}

// Repository - data access, no business logic
interface OrderRepository extends JpaRepository<Order, Long> {}
```

## Related Topics
- [[microservices-vs-monolith|Microservices vs Monolith]]
- [[dependency-injection-pattern|Dependency Injection]]
- [[repository-pattern|Repository Pattern]]
- [[dependency-inversion|SOLID Principles]]
- [[backend-architecture|Clean Architecture]]

## Cards

```anki
START
Basic
What are the main layers in a typical backend?
Back: Controller (HTTP handling) -> Service (business logic) -> Repository (data access). Each layer only depends on the one below it. Keeps business logic testable without a web server or database.
<!--ID: 1773439959034-->
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
