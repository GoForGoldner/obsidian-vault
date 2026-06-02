---
tags: [database, system-design, performance]
category: system-design
related: [sql, nosql, orm]
---

## Description
A data structure in databases that improves query speed at the cost of extra storage and write performance. Common types: B-Tree (default, good for range queries and sorting), Hash (fast exact lookups only), and Composite (multi-column indexes for common query patterns).

## Benefits
- Turns O(n) full table scans into O(log n) lookups
- Huge speedup for read-heavy workloads
- Composite indexes optimize multi-column WHERE clauses

## Downsides
- Slower writes (index must be updated on every INSERT/UPDATE/DELETE)
- Extra disk space
- Too many indexes hurt more than they help


## Examples
```sql
-- Composite index on (user_id, created_at)
CREATE INDEX idx_user_date ON orders(user_id, created_at);

-- This query uses the index efficiently:
SELECT * FROM orders WHERE user_id = 5 ORDER BY created_at DESC;

-- Leftmost prefix rule:
-- ✓ WHERE user_id = 5                    (uses index)
-- ✓ WHERE user_id = 5 AND created_at > X (uses index)
-- ✗ WHERE created_at > X                 (can't use - skipped user_id)

-- Covering index: all columns in query are in the index
-- DB answers from index alone, never touches the table rows
```

## Related Topics
- [[sql|SQL]]
- [[nosql|NoSQL]]
- [[orm|ORM]]
- [[database-indexes|Query Optimization]]
- [[database-indexes|B-Tree]]
- [[database-indexes|Hash Index]]

## Cards

```anki
START
Basic
What are the common index types and what's the leftmost prefix rule?
Back: B-Tree (range + equality, default), Hash (equality only), Composite (multi-column). Leftmost prefix: index on (A, B, C) works for queries on A, (A,B), or (A,B,C) - but NOT B or C alone. A covering index contains all columns a query needs - fastest possible read.
<!--ID: 1773439958515-->
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
