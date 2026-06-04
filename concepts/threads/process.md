---
tags: [threads, os, concurrency]
category: threads
related: [thread, deadlock]
---

## Description
An independent program in execution with its own memory space, resources, and at least one thread. Processes are isolated from each other. one crashing doesn't take down another. The OS manages scheduling and resource allocation between processes.
## Examples
```java
// Start a new process from Java
ProcessBuilder pb = new ProcessBuilder("ls", "-la");
Process process = pb.start();
int exitCode = process.waitFor();

// Each process has its own memory space
// Process A crashing doesn't affect Process B
// Communication between processes: sockets, pipes, shared files
```

## Related Topics
- [[thread|Thread]]
- [[process-vs-thread|Process vs Thread]]
- [[process-vs-thread|Context Switching]]
- [[process|Inter-Process Communication]]
- [[process|Fork]]

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
