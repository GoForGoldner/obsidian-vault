---
tags: [system-design, distributed-systems]
category: system-design
related: [eventual-consistency, sql-vs-nosql]
---

## Description
A theorem that states distributed systems can have at most 2 of: Consistency (all nodes see the same data at the same time), Availability (system always responds to requests), Partition Tolerance (system works even when network splits happen). In practice, Partition Tolerance is essential because the internet is unreliable. so it's really a choice between consistency or availability.
## Examples
```
Distributed DB with 3 nodes:

Normal: all 3 nodes in sync

Network partition happens (Node C can't talk to A and B):

CP (Consistency + Partition Tolerance):
  Node C rejects writes until partition heals
  "Can't process request right now" (banking, inventory)

AP (Availability + Partition Tolerance):
  Node C accepts writes, syncs later when it can
  "Here's your data but it might be stale" (social feeds, DNS)
```

## Related Topics
- [[eventual-consistency|Eventual Consistency]]
- [[sql-vs-nosql|SQL vs NoSQL]]
- [[eventual-consistency|Database Replication]]
- [[cap-theorem|Distributed Systems]]

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
