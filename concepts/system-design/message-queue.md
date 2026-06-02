---
tags: [system-design, distributed-systems]
category: system-design
related: [event-sourcing-pattern, microservices-vs-monolith, eventual-consistency]
---

## Description
A broker that sits between sender and receiver, storing messages for async consumption. The sender publishes messages without knowing who consumes them. Examples: RabbitMQ, Kafka, AWS SQS.

## Benefits
- Async processing (sender doesn't wait for consumer)
- Load smoothing during traffic spikes
- Retry on failures without losing messages
- Loose coupling between services

## Downsides
- Added infrastructure complexity
- Eventual consistency (consumer processes later)
- Harder to debug message flow across services
- Consumers must be idempotent (may get same message twice)


## Examples
```
Order placed -> [Message Queue] -> consumed by multiple services

Producer:                    Consumer 1: EmailService
OrderService.publish(        Consumer 2: InventoryService
  "ORDER_PLACED",            Consumer 3: AnalyticsService
  {orderId: 123}
)
```

```java
// Producer
rabbitTemplate.convertAndSend("orders", new OrderEvent(orderId));

// Consumer (must be idempotent, might get same message twice)
@RabbitListener(queues = "orders")
void handleOrder(OrderEvent event) {
    if (alreadyProcessed(event.getId())) return;  // dedupe
    emailService.sendConfirmation(event);
}
```

## Related Topics
- [[event-sourcing-pattern|Event Sourcing]]
- [[microservices-vs-monolith|Microservices]]
- [[eventual-consistency|Eventual Consistency]]
- [[observer-pattern|Pub/Sub]]
- [[message-queue|Kafka]]
- [[message-queue|RabbitMQ]]

## Cards

```anki
START
Basic
What is a message queue and when do you use one?
Back: Broker between sender and receiver that stores messages. Enables async processing, load smoothing, retry on failure, loose coupling. Queue = one consumer per message. Pub/Sub = all subscribers get it. Overkill for simple request/response. Consumers must be idempotent (may process same message twice).
<!--ID: 1773439958560-->
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
