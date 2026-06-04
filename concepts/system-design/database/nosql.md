---
tags: [database, system-design]
category: system-design
related: [sql, cap-theorem, eventual-consistency]
---

## Description
Non-relational databases optimized for specific data models and access patterns instead of general-purpose SQL querying. Trade ACID guarantees and joins for horizontal scalability and flexible schemas. Commonly used alongside SQL databases in polyglot persistence architectures.
## Examples
```
Using multiple NoSQL databases for different jobs:

PostgreSQL (SQL)     -> orders, transactions (ACID, joins)
MongoDB (Document)   -> user profiles (flexible schema, no joins)
Redis (Key-Value)    -> session cache (sub-ms reads)
Cassandra (Column)   -> analytics (massive write throughput)

NoSQL scales horizontally by sharding:
Data is split across nodes, each handles a subset
No joins means no need for all data on one machine
```

## Related Topics
- [[sql|SQL]]
- [[cap-theorem|CAP Theorem]]
- [[eventual-consistency|Eventual Consistency]]
- [[horizontal-vs-vertical-scaling|Horizontal Scaling]]
- [[horizontal-vs-vertical-scaling|Database Sharding]]

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
