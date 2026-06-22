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
<!--ID: 1780580932991-->
END

START
Basic
If the primary key is PRIMARY KEY ((a, b), c, d), how many clustering columns are there?
Back: Two: c and d. The partition key is the composite (a, b) — anything inside the extra parentheses. Everything after is clustering.
<!--ID: 1780580932993-->
END

START
Basic
You want all user names stored in ONE partition AND sorted alphabetically. Why can't `name` be both the partition key and the clustering key?
Back: If `name` is the partition key, each name hashes to its own partition (one row each), so they're scattered across nodes, not together.<br>Use a constant/bucket column as the partition key and `name` as the clustering key to get a single sorted partition.
<!--ID: 1782144297932-->
END

START
Basic
In Cassandra, how does the partition key relate to the primary key?
Back: The primary key is composite — partition key + clustering columns — so the partition key is a SUBSET of the primary key.<br>They're equal only when there are no clustering columns, e.g. `PRIMARY KEY ((id))`.
<!--ID: 1782144297935-->
END

START
Basic
With `PRIMARY KEY ((user_id), year, month, day)`, why does `WHERE user_id=? AND month=6` fail but `... AND year=2025` work?
Back: Composite clustering columns obey the leftmost-prefix rule (like a B-tree index): you must restrict them left-to-right.<br>You can't skip `year` to filter `month`; `year` (right after the partition key) is a valid prefix.
<!--ID: 1782144297938-->
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