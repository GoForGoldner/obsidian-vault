---
tags: [system-design, distributed-systems]
category: system-design
related: [cap-theorem, message-queue]
---

## Description
A consistency model where updates to a distributed system will propagate to all nodes eventually, but not immediately. At any given moment, different nodes might return different values, but given enough time with no new updates, all nodes will converge to the same value.

## Benefits
- High availability (system stays responsive during partitions)
- Better performance (no waiting for all nodes to agree)
- Scales well across regions

## Downsides
- Stale reads (user might see old data temporarily)
- Conflict resolution is complex (what if two nodes update the same thing?)
- Harder to reason about than strong consistency


## Examples
```
User posts a photo:

Region A (origin):   POST /photo -> saved -> user sees it right away
Region B (replica):  still syncing... friend doesn't see it yet
Region B (3s later): replication done -> friend sees the photo now

Both regions end up with the same data, just not at the same time.

OK for: social feeds, analytics, product catalogs
NOT OK for: bank balances, inventory counts, seat bookings
```

## Related Topics
- [[cap-theorem|CAP Theorem]]
- [[eventual-consistency|Strong Consistency]]
- [[message-queue|Message Queue]]
- [[eventual-consistency|Database Replication]]
- [[cap-theorem|Distributed Systems]]

## Cards

```anki
START
Basic
What is eventual consistency and when is it acceptable?
Back: All nodes will eventually have the same data, but not instantly - reads might be stale temporarily. Acceptable for social feeds, analytics, catalogs. NOT for bank balances, inventory, bookings. The tradeoff for availability in distributed systems (CAP).
<!--ID: 1773439958549-->
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
