---
tags: [system-design, comparison]
category: vs
related: [load-balancing, microservices-vs-monolith]
---

## Description
Vertical scaling (scale up) means adding more power to one machine. more CPU, RAM, storage. Horizontal scaling (scale out) means adding more machines and distributing the load. Vertical is simpler but has a ceiling; horizontal is harder but virtually unlimited.
## Examples
```
Vertical (scale up):
  Same server but bigger (16GB -> 64GB RAM, 4 cores -> 16 cores)
  Simple but has a ceiling and single point of failure

Horizontal (scale out):
  Add more servers behind a load balancer
  Server A, Server B, Server C all handling requests
  No ceiling and if one dies the others keep going
```

## Related Topics
- [[load-balancing|Load Balancing]]
- [[microservices-vs-monolith|Microservices]]
- [[horizontal-vs-vertical-scaling|Database Sharding]]
- Stateless Architecture

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
