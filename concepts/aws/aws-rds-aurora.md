---
tags: [aws, saa-c03, database, resiliency, domain-2, domain-3, domain-4]
category: aws
related: [aws-dynamodb, aws-caching-elasticache, aws-disaster-recovery, sql, aws-migration-transfer]
---
TARGET DECK: Study::AWS::Databases

## Description
**Amazon RDS** is managed relational database (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, and Aurora). AWS handles patching, backups, and failover; you still own schema, queries, and tuning.

The single most-tested distinction on the whole exam:

| | **Multi-AZ** | **Read Replica** |
|---|---|---|
| Purpose | **High availability / DR** | **Read scaling / performance** |
| Replication | **Synchronous** | **Asynchronous** |
| Standby serves traffic? | **No** (invisible standby) | **Yes** (readable) |
| Failover | Automatic, ~60–120s, DNS moves | Manual promotion |
| Cross-Region? | Multi-AZ is within a Region | **Yes**, cross-Region supported |

If a question says "reduce load on the primary" or "reporting queries are slowing the app" → **read replica**. If it says "survive an AZ failure with minimal downtime" → **Multi-AZ**. They are complementary, not alternatives, and questions often want both.

**Amazon Aurora** — AWS's MySQL/PostgreSQL-compatible engine. Storage is a shared, distributed volume replicated **6 ways across 3 AZs**, auto-growing to 128 TB. Up to **15 low-latency read replicas** with automatic failover. Roughly 3–5x MySQL throughput. Variants:
- **Aurora Serverless v2** — scales capacity in fine-grained increments; the answer for **unpredictable, intermittent, or spiky** database load, and for dev/test that idles.
- **Aurora Global Database** — cross-Region replication with **sub-second lag** and **RTO under a minute**; the answer for global reads plus fast Region-level DR.
- **Aurora Multi-Master** — multiple write nodes (niche).

**RDS Proxy** — connection pooling in front of RDS/Aurora. The answer for **Lambda exhausting database connections** (thousands of concurrent functions each opening a connection), and it also shortens failover time and lets you enforce IAM auth.

**Backups**: automated backups with point-in-time recovery (1–35 day retention, default 7); manual snapshots persist until you delete them. Snapshots can be copied cross-Region and shared.

**Migration**: **AWS DMS** moves data with minimal downtime; pair it with the **Schema Conversion Tool (SCT)** for **heterogeneous** migrations (Oracle → PostgreSQL). Homogeneous (MySQL → MySQL) needs DMS alone.

Other engines the exam name-drops: **Redshift** (columnar data warehouse / OLAP / analytics), **DocumentDB** (MongoDB-compatible), **Neptune** (graph — social networks, fraud rings, recommendations), **Keyspaces** (Cassandra), **QLDB** (immutable cryptographically-verifiable ledger), **Timestream** (time-series/IoT).

## Examples
```
Reading the question:

"Reporting queries slow down the app"          → Read replica
"Must survive an AZ outage automatically"      → Multi-AZ
"Both of the above"                            → Multi-AZ + read replicas (common)
"Global users need local read latency + DR"    → Aurora Global Database
"Load is spiky and unpredictable / idles"      → Aurora Serverless v2
"Lambda is exhausting DB connections"          → RDS Proxy
"Complex analytics over petabytes, columnar"   → Redshift (NOT RDS)
"Relationships/graph traversal, fraud rings"   → Neptune
"Immutable, verifiable audit ledger"           → QLDB
```

```
Aurora storage — why it's more durable than RDS:

  Write ──► shared distributed storage volume
             ├── AZ-a: copy, copy
             ├── AZ-b: copy, copy      6 copies / 3 AZs
             └── AZ-c: copy, copy
  Tolerates losing 2 copies for writes, 3 copies for reads.
  Compute nodes (up to 15 readers) are separate and stateless.
```

```
Migration paths:

Oracle → Oracle on RDS         → DMS alone (homogeneous)
Oracle → Aurora PostgreSQL     → SCT (convert schema) + DMS (move data)
Minimal downtime cutover       → DMS with ongoing replication (CDC), then switch
```

## Related Topics
- Synchronous vs asynchronous replication
- Read scaling and eventual consistency
- OLTP vs OLAP
- Connection pooling
- Point-in-time recovery

## Cards

```anki
START
Basic
RDS: Reporting queries are slowing the production app. Multi-AZ or read replica?
Back: Read replica — it exists to offload reads. A Multi-AZ standby serves NO traffic; it's purely for failover.
This distinction is the most-tested RDS fact on the exam.
<!--ID: 1788139020899-->
END

START
Basic
RDS: Why is Multi-AZ replication synchronous while read replicas are asynchronous?
Back: Multi-AZ must guarantee zero data loss on failover, so writes commit to the standby before acknowledging. Read replicas trade freshness for not slowing the primary — so they can lag.
<!--ID: 1788139020906-->
END

START
Basic
RDS: A Lambda function scales to 2,000 concurrent executions and RDS starts refusing connections. Fix?
Back: RDS Proxy — pools and reuses connections so thousands of Lambdas share a small set. It also cuts failover time.
<!--ID: 1788139020913-->
END

START
Basic
Aurora: What does "6 copies across 3 AZs" actually buy you?
Back: Writes survive losing 2 copies, reads survive losing 3, and repair is automatic. Durability comes from the shared storage layer, not from the compute nodes.
<!--ID: 1788139020920-->
END

START
Basic
Aurora: The database is idle most of the week and spikes unpredictably. Which option?
Back: Aurora Serverless v2 — scales capacity in fine increments and down when idle, so you don't pay for a provisioned instance sitting unused.
<!--ID: 1788139020927-->
END

START
Basic
Aurora: Requirement is "global read latency under 100ms AND recover from a Region failure in under a minute." What?
Back: Aurora Global Database — sub-second cross-Region replication lag and RTO under a minute. Cross-Region read replicas alone are slower to promote.
<!--ID: 1788139020934-->
END

START
Basic
RDS: Migrating Oracle to Aurora PostgreSQL. Which two tools, and why both?
Back: Schema Conversion Tool (SCT) to convert schema and stored procedures, then DMS to move the data. Heterogeneous migrations need both; homogeneous ones need only DMS.
<!--ID: 1788139020941-->
END

START
Basic
RDS: The question asks for petabyte-scale analytical queries over historical data. Why is RDS wrong?
Back: RDS is row-oriented OLTP. Analytics over petabytes wants Redshift — columnar, MPP, built for OLAP scans.
<!--ID: 1788139020948-->
END

START
Basic
Databases: "Detect fraud rings by traversing relationships between accounts." Which AWS database?
Back: Amazon Neptune — a managed graph database. Relationship traversal is the tell; a relational join-heavy design would be the wrong answer.
<!--ID: 1788139020954-->
END

START
Basic
RDS: What's the difference between automated backups and manual snapshots when you delete the DB instance?
Back: Automated backups are deleted with the instance (retention 1–35 days). Manual snapshots persist until you explicitly delete them — the answer for long-term retention.
<!--ID: 1788139020960-->
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
