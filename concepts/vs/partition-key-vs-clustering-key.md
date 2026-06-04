---
tags: [database, cassandra, distributed-systems]
category: system-design/database
related: [primary-key, data-modeling, cassandra-internals]
---

## Description
In column‑family databases (Cassandra, ScyllaDB), the primary key is a composite of the **partition key** (decides which node stores the row) and optionally one or more **clustering columns** (decides the sort order of rows within a partition). They solve different problems: distribution vs. ordering.

## Examples
- `PRIMARY KEY ((user_id), order_time)` → partition key = `user_id` (all of Alice’s orders on one node), clustering key = `order_time` (orders sorted by time within her partition).
- `PRIMARY KEY ((id))` → partition key = `id`, no clustering — each row is its own partition.

## Related Topics
- [[primary-key]]
- [[data-modeling]]
- [[cassandra-internals]]

## Cards

```anki
START
Basic
In Cassandra, what's the difference between a partition key and a clustering key?
Back: Partition key decides WHICH NODE stores the row (distribution). Clustering key decides the SORT ORDER of rows within that partition (ordering). In PRIMARY KEY ((user_id), order_time): user_id = partition key, order_time = clustering key.
END

START
Basic
If the primary key is PRIMARY KEY ((a, b), c, d), how many clustering columns are there?
Back: Two: c and d. The partition key is the composite (a, b) — anything inside the extra parentheses. Everything after is clustering.
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