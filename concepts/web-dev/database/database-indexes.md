---
tags: [database, performance]
category: web-dev
related: [sql, nosql]
---

## Description
A data structure in databases that improves query speed at the cost of extra storage and write performance. Like a book index: instead of scanning every page, you look up the topic and jump to the right page. Turns O(n) scans into O(log n) lookups.

## Benefits
- Huge speedup for read-heavy queries
- B-Tree indexes support range queries and sorting
- Composite indexes optimize multi-column WHERE clauses

## Downsides
- Slower writes (index updated on every INSERT/UPDATE/DELETE)
- Extra disk space
- Over-indexing hurts performance


## Examples
```sql
-- Without index: full table scan O(n)
SELECT * FROM users WHERE email = 'alice@mail.com';  -- scans every row

-- Add index: B-Tree lookup O(log n)
CREATE INDEX idx_email ON users(email);
SELECT * FROM users WHERE email = 'alice@mail.com';  -- jumps directly

-- Tradeoff: inserts are slower now (must update the index too)
INSERT INTO users (email) VALUES ('bob@mail.com');  -- O(log n) instead of O(1)
```

## Related Topics
- [[sql|SQL]]
- [[nosql|NoSQL]]
- [[database-indexes|B-Tree]]
- [[database-indexes|Query Optimization]]
- [[database-indexes|Database Performance]]

## Cards

```anki
START
Basic
What is a database index and what's the tradeoff?
Back: Data structure (usually B-Tree) that speeds up reads from O(n) to O(log n). Tradeoff: slower writes (must update index too), extra storage. Don't index columns with heavy writes and few reads, or low cardinality (booleans).
<!--ID: 1773439959065-->
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
