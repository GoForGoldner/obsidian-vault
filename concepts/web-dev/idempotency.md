---
tags: [web-dev, api]
category: web-dev
related: [http-requests, message-queue]
---

## Description
Making the same request multiple times produces the same result. Idempotent methods: GET, PUT, DELETE. Not idempotent: POST (creates a new resource each time). Important because clients may retry requests and the network is unreliable.
## Examples
```java
// Idempotent - safe to retry
PUT  /users/1  {name: "John"}  // 10 calls → still {name: "John"}
DELETE /users/1                 // 10 calls → user still deleted

// NOT idempotent - creates duplicates
POST /orders {item: "book"}    // 10 calls → 10 orders!

// Fix: idempotency key
@PostMapping("/orders")
Order create(@RequestHeader("Idempotency-Key") String key, @RequestBody OrderReq req) {
    if (cache.exists(key)) return cache.get(key);  // already processed
    Order order = orderService.create(req);
    cache.put(key, order);
    return order;
}
```

## Related Topics
- [[http-requests|HTTP Requests]]
- [[message-queue|Message Queue]]
- REST API
- [[idempotency|Retry Logic]]

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
