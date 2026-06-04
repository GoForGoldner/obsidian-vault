---
tags: [concurrency, comparison]
category: vs
related: [thread, process]
---

## Description
Synchronous means operations execute one at a time. each one blocks until complete before the next starts. Asynchronous means operations can start without waiting for the previous one to finish. the program continues and handles the result when it's ready.
## Examples
```java
// Synchronous - blocks the thread while waiting
User user = userService.getUser(1);      // waits...
List<Order> orders = orderService.get(); // waits...
// total time = getUser + getOrders

// Asynchronous - runs concurrently
CompletableFuture<User> userF = CompletableFuture.supplyAsync(() -> userService.getUser(1));
CompletableFuture<List<Order>> ordersF = CompletableFuture.supplyAsync(() -> orderService.get());
// total time = max(getUser, getOrders)
User user = userF.get();
List<Order> orders = ordersF.get();
```

## Related Topics
- [[thread|Threads]]
- [[sync-vs-async|Concurrency]]
- [[sync-vs-async|Promises]]
- [[sync-vs-async|async/await]]
- [[sync-vs-async|Event Loop]]
- [[sync-vs-async|Non-blocking I/O]]

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
