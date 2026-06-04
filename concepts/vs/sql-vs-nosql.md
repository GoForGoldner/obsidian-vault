---
tags: [database, comparison]
category: vs
related: [sql, nosql]
---

## Description
SQL databases are relational. structured tables with schemas, joins, and ACID transactions. NoSQL databases are non-relational. flexible schemas, optimized for specific data models (documents, key-value, graphs). The choice depends on your data structure, scale, and consistency needs.
## Examples
SQL:
```sql
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;
```

NoSQL (MongoDB):
```json
db.users.findOne({ _id: 1 })
// Returns: { name: "Alice", orders: [{total: 150}, {total: 80}] }
// No joins - data is nested in the document
```

## Related Topics
- [[sql|SQL]]
- [[nosql|NoSQL]]
- [[sql|ACID]]
- [[cap-theorem|CAP Theorem]]
- [[database-indexes|Database Indexes]]
- [[eventual-consistency|Eventual Consistency]]

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
