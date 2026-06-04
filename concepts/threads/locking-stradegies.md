---
tags: [threads, concurrency, synchronization]
category: threads
related: [deadlock, race-conditions, thread]
---

## Description
Mechanisms to control access to shared resources in multithreaded environments. Prevents race conditions by ensuring only one thread can access a critical section at a time (or controlled access for reads).

## Benefits
- Prevents race conditions and data corruption
- Read-write locks allow concurrent reads for better throughput

## Downsides
- Can cause deadlocks if locks are acquired in the wrong order
- Performance overhead from lock contention
- Over-locking kills parallelism


## Examples
```java
// Mutex (synchronized)
synchronized (lock) {
    balance += 50;  // only one thread at a time
}

// ReadWriteLock - readers don't block each other
ReadWriteLock rwLock = new ReentrantReadWriteLock();
rwLock.readLock().lock();    // multiple readers OK
rwLock.writeLock().lock();   // exclusive - blocks everyone

// Semaphore - allow N threads (e.g., connection pool of 5)
Semaphore sem = new Semaphore(5);
sem.acquire();  // blocks if 5 already in use
sem.release();

// Optimistic locking - no lock, check version before writing
// UPDATE accounts SET balance = 200, version = 2 WHERE id = 1 AND version = 1
```

## Related Topics
- [[deadlock|Deadlock]]
- [[race-conditions|Race Conditions]]
- [[locking-stradegies|Mutex]]
- [[locking-stradegies|Semaphore]]
- [[locking-stradegies|Read-Write Lock]]

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
