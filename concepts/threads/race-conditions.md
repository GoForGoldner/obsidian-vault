---
tags:
  - threads
  - concurrency
category: theads
related: []
---

## Description
When 2 or more threads are trying to both update a shared resource. Updating or modifying the resource can cause errors because they are updating the value at the same time causing inconsistency.

##Solutions 
Atomicity
Making each transaction happen all as one action so that there is no time where another thread can interfere

Immutability 
Never modify the shared state of the resource (make it read only)

Locks and Timeouts
Only 1 thread has access to the critical section at a time

Message Passing?
Idk what this is
## Examples
Two threads in Increment counter:
```java
// Shared state
int counter = 5;

// Thread A reads 5, Thread B reads 5
// Thread A writes 6, Thread B writes 6
// Result: 6 (should be 7)

// Fix with AtomicInteger:
AtomicInteger counter = new AtomicInteger(5);
counter.incrementAndGet(); // thread-safe
```

## Related Fields
Thread
Concurrency

## Cards

```anki
START
Basic
Test
Back: hi
<!--ID: 1773439958798-->
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
