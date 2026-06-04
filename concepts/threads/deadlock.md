---
tags: [threads, concurrency]
category: threads
related: [locking-stradegies, race-conditions, thread]
---

## Description
Two or more threads waiting on each other to release a resource in order to progress, causing infinite waiting. Neither can continue because each holds what the other needs.
## Examples
```java
Object lock1 = new Object(), lock2 = new Object();

// Thread A
new Thread(() -> {
    synchronized (lock1) {       // holds lock1
        synchronized (lock2) {}  // waits for lock2
    }
}).start();

// Thread B
new Thread(() -> {
    synchronized (lock2) {       // holds lock2
        synchronized (lock1) {}  // waits for lock1 - DEADLOCK
    }
}).start();

// Fix: always acquire locks in the same order (lock1 then lock2)
```

## Related Topics
- [[locking-stradegies|Locking Strategies]]
- [[race-conditions|Race Conditions]]
- [[thread|Thread]]
- [[locking-stradegies|Mutex]]
- Lock Ordering

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
