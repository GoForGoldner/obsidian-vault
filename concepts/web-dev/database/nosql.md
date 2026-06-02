---
tags: [web-dev, database]
category: web-dev
related: [sql, sql-vs-nosql]
---

## Description
Non-relational databases that don't use tables with fixed schemas. Main types: Document stores (MongoDB. JSON-like docs), Key-Value stores (Redis. fast cache), Column stores (Cassandra. analytics), Graph databases (Neo4j. relationships). Optimized for specific access patterns rather than general-purpose querying.
## Examples
```javascript
// Document (MongoDB) - flexible JSON, no joins
db.users.insertOne({
  name: "Alice",
  orders: [{total: 50}, {total: 120}]  // nested, not a separate table
})

// Key-Value (Redis) - sub-millisecond cache
SET session:abc123 "{userId: 1, role: admin}"  // O(1) lookup
GET session:abc123

// Column (Cassandra) - time-series at scale
// Graph (Neo4j) - relationship-heavy queries
```

## Related Topics
- [[sql|SQL]]
- [[sql-vs-nosql|SQL vs NoSQL]]
- [[cap-theorem|CAP Theorem]]
- [[eventual-consistency|Eventual Consistency]]
- [[database-indexes|Database Indexes]]

## Cards

```anki
START
Basic
What are the four types of NoSQL databases?
Back: Document (MongoDB - flexible JSON docs), Key-Value (Redis - fast cache), Column (Cassandra - analytics at scale), Graph (Neo4j - relationship queries). Each optimized for specific access patterns, not general-purpose like SQL.
<!--ID: 1773439959072-->
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
