---
tags: [architecture, comparison]
category: vs
related: [docker, message-queue, load-balancing]
---

## Description
A monolith is a single deployable unit where all features live in one codebase and process. Microservices split features into independently deployable services that communicate over the network. Monoliths are simpler to start; microservices are easier to scale and deploy independently but add network complexity.
## Examples
```
Monolith:
  One project, one deployable, one database
  UserController, OrderController, PaymentController all in the same app

Microservices:
  UserService (DB1)  |  OrderService (DB2)  |  PaymentService (DB3)
  Each deployed independently
  Talk to each other over HTTP or message queues
```

## Related Topics
- [[docker|Docker]]
- [[message-queue|Message Queue]]
- [[load-balancing|Load Balancing]]
- [[ci-cd|CI/CD]]
- [[rate-limiting|API Gateway]]
- [[eventual-consistency|Eventual Consistency]]

## Cards

```anki
START
Basic
When do you use monolith vs microservices?
Back: Start monolith - simpler to build, deploy, debug. Move to microservices when you hit scaling bottlenecks or need independent deployment. Microservices cost: network complexity, distributed tracing, eventual consistency. Benefit: scale individual services independently.
<!--ID: 1773439958898-->
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
