---
tags: [aws, saa-c03, database, nosql, serverless, domain-3, domain-4]
category: aws
related: [aws-rds-aurora, aws-caching-elasticache, nosql, aws-serverless-containers]
---
TARGET DECK: Study::AWS::Databases

## Description
DynamoDB is a **serverless, fully managed key-value and document NoSQL database** with single-digit millisecond latency at any scale. No servers, no version patching, no capacity floor. It is automatically replicated across **3 AZs** in a Region.

**Keys**: a **partition key** alone, or a **partition key + sort key** (composite). The partition key determines which physical partition holds the item — so a **poorly chosen partition key creates a hot partition** and throttling. Good partition keys are high-cardinality and evenly accessed.

**Indexes** — the exam always tests the difference:

| | **LSI** (Local Secondary Index) | **GSI** (Global Secondary Index) |
|---|---|---|
| Partition key | **Same** as table | **Different** — any attribute |
| Sort key | Different | Different |
| Created | **Only at table creation** | **Any time** |
| Capacity | Shares the table's | **Its own** |
| Consistency | Can be strongly consistent | **Eventually consistent only** |

So: "we need to query by an attribute that isn't the partition key, on an existing table" → **GSI** (an LSI can't be added later and can't change the partition key).

**Capacity modes**: **On-demand** (pay per request, instant scaling — for unpredictable/spiky/new workloads) vs **Provisioned** (cheaper for steady, predictable traffic; supports auto scaling and reserved capacity).

**Reads**: **eventually consistent** by default (cheaper, half an RCU); **strongly consistent** costs double and can't be served by a GSI.

**DAX (DynamoDB Accelerator)** — an in-memory cache purpose-built for DynamoDB delivering **microsecond** reads. The answer whenever a question wants to speed up DynamoDB reads specifically; ElastiCache is the generic answer but DAX requires no application caching logic.

**DynamoDB Streams** — an ordered change log of item modifications, consumed by Lambda. The backbone of event-driven patterns ("when an item changes, do X").

**Global Tables** — multi-Region, **multi-active** replication. The answer for globally distributed low-latency reads *and* writes.

**TTL** — auto-deletes expired items at no cost. The answer for session data, temporary records, and cost reduction on transient data.

Backups: **PITR** (point-in-time recovery, last 35 days) and on-demand backups.

## Examples
```
Table design:

  PK = CustomerId    SK = OrderDate#OrderId
  → query "all orders for customer X between two dates" is one efficient Query

  Bad PK: Status ("PENDING"/"SHIPPED")  → 2 values → hot partition → throttling
  Good PK: CustomerId, OrderId          → high cardinality → even spread
```

```
When the exam wants DynamoDB vs RDS:

Key-value lookups, massive scale, flexible schema, serverless → DynamoDB
Joins, transactions across tables, complex ad-hoc SQL        → RDS/Aurora
Millisecond latency at unpredictable scale, no ops           → DynamoDB
Existing relational app being lifted-and-shifted             → RDS
```

```
Speeding up reads:

DynamoDB too slow, need microseconds → DAX (no app changes, DynamoDB-native)
Generic cache for RDS or computed data → ElastiCache
Global users writing in their own Region → Global Tables (multi-active)
```

## Related Topics
- NoSQL data modeling and access patterns
- Partition keys and hot partitions
- Eventual vs strong consistency
- Change data capture
- Caching strategies

## Cards

```anki
START
Basic
DynamoDB: You need to query an existing table by an attribute that isn't the partition key. LSI or GSI?
Back: GSI — it uses a different partition key and can be added at any time. An LSI must share the table's partition key AND be created with the table.
<!--ID: 1788139020221-->
END

START
Basic
DynamoDB: The table throttles even though provisioned capacity looks sufficient. Most likely cause?
Back: A hot partition — a low-cardinality partition key concentrating traffic on one partition. Capacity is divided across partitions, so one key can starve.
<!--ID: 1788139020226-->
END

START
Basic
DynamoDB: A new application's traffic is completely unpredictable. Which capacity mode?
Back: On-demand — instant scaling, pay per request, no forecasting. Switch to provisioned + auto scaling later once the pattern is known and steady, for lower cost.
<!--ID: 1788139020231-->
END

START
Basic
DynamoDB: Reads must be in microseconds, not milliseconds. What do you add?
Back: DAX — an in-memory cache built for DynamoDB, requiring no application caching logic. ElastiCache would work but forces you to write cache-aside code.
<!--ID: 1788139020238-->
END

START
Basic
DynamoDB: How do you trigger a Lambda whenever an item is updated?
Back: DynamoDB Streams — an ordered change log of item-level modifications that Lambda consumes. The standard event-driven pattern.
<!--ID: 1788139020243-->
END

START
Basic
DynamoDB: Users in three continents must WRITE with local latency. What feature?
Back: Global Tables — multi-Region, multi-active replication. Cross-Region read replicas would only help reads.
<!--ID: 1788139020247-->
END

START
Basic
DynamoDB: Session records should disappear after 24 hours without a cleanup job. What?
Back: TTL — set an expiry timestamp attribute and DynamoDB deletes expired items automatically, at no cost.
<!--ID: 1788139020253-->
END

START
Basic
DynamoDB: Why can't a GSI serve a strongly consistent read?
Back: GSIs are replicated asynchronously from the base table, so they're eventually consistent by definition. Only base-table reads (and LSIs) can be strongly consistent.
<!--ID: 1788139020258-->
END

START
Basic
DynamoDB: The question mentions complex joins across five tables and ACID transactions across them. Why is DynamoDB the wrong answer?
Back: DynamoDB has no joins and is designed around known access patterns. Relational, join-heavy, ad-hoc querying is RDS/Aurora territory.
<!--ID: 1788139020263-->
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
