---
tags: [threads, os, concurrency]
category: threads
related: [process, race-conditions, deadlock]
---

## Description
A lightweight unit of execution within a process. Threads share the same memory space as their parent process, which makes them fast to communicate with each other but also makes them prone to race conditions. A process can have multiple threads running concurrently.
## Examples
```java
// Threads share the same memory (dangerous without synchronization)
class Server {
    private int requestCount = 0;  // shared state

    void handleRequest() {
        new Thread(() -> {
            requestCount++;  // race condition! multiple threads touch this
            processRequest();
        }).start();
    }
}

// Better: use a thread pool
ExecutorService pool = Executors.newFixedThreadPool(10);
pool.submit(() -> processRequest());
```

## Related Topics
- [[process|Process]]
- [[race-conditions|Race Conditions]]
- [[deadlock|Deadlock]]
- [[thread|Thread Pool]]
- [[process-vs-thread|Context Switching]]
- [[locking-stradegies|Mutex]]

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
