---
tags: [database, backend]
category: system-design
related: [nosql, orm, database-indexes]
---

## Description
Structured Query Language for relational databases. Data lives in tables with fixed schemas, rows are records, columns are fields. Supports relationships through foreign keys and joins. ACID-compliant (Atomicity, Consistency, Isolation, Durability). Examples: PostgreSQL, MySQL, SQL Server.
## Examples
```sql
-- ACID: all-or-nothing transaction
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;  -- both happen or neither happens

-- JOIN: combine related tables
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;

-- Normalization: separate tables, link by foreign key
-- Denormalization: duplicate data to avoid joins (read-heavy systems)
```

## Related Topics
- [[nosql|NoSQL]]
- [[orm|ORM]]
- [[database-indexes|Database Indexes]]
- [[sql|ACID]]
- [[sql|Normalization]]
- [[sql|Joins]]

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
