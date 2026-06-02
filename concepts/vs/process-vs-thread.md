---
tags: [threads, os, comparison]
category: vs
related: [process, thread]
---

## Description
A process has its own memory space and is isolated from other processes. A thread runs inside a process and shares memory with other threads in the same process. Processes are heavier to create and safer; threads are lighter and faster but risk race conditions.
## Examples
```java
// Process - isolated memory, heavyweight
ProcessBuilder pb = new ProcessBuilder("java", "-jar", "app.jar");
Process p = pb.start();  // separate memory space

// Thread - shared memory, lightweight
new Thread(() -> {
    sharedCounter++;  // can access parent process memory (dangerous)
}).start();

// Context switch: threads are cheaper (shared memory)
// Crash isolation: process crash doesn't kill other processes
```

## Related Topics
- [[process|Process]]
- [[thread|Thread]]
- [[race-conditions|Race Conditions]]
- [[process-vs-thread|Context Switching]]
- [[sync-vs-async|Concurrency]]

## Cards

```anki
START
Basic
What's the key difference between a process and a thread?
Back: Process: own memory, isolated, heavier, safer (one crashing doesn't kill others). Thread: shared memory, lightweight, faster communication, but needs synchronization to avoid race conditions. Thread context switches are cheaper.
<!--ID: 1773439958997-->
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
