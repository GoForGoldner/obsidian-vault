---
tags: [aws, saa-c03, analytics, data, domain-3]
category: aws
related: [aws-integration-messaging, aws-s3, aws-rds-aurora, kafka]
---
TARGET DECK: Study::AWS::Operations

## Description
Task Statement 3.5 covers data ingestion and transformation. It's a small slice, and it's almost entirely **name → job** recall.

**Streaming ingestion**
- **Kinesis Data Streams** — real-time ingestion, ordered, replayable, retained 1–365 days, multiple independent consumers. **You manage shards** (or use on-demand mode). Sub-second latency.
- **Kinesis Data Firehose** — **fully managed delivery** to S3, Redshift, OpenSearch, or Splunk. **Near-real-time (buffered, ~60s minimum)**, no shard management, can transform with Lambda and convert to Parquet. If the question says "**load streaming data into S3 with no administration**" → Firehose. If it says "**custom real-time processing / multiple consumers / replay**" → Data Streams.
- **Amazon MSK** — managed Apache Kafka. The answer when the question **names Kafka** or an existing Kafka ecosystem.

**Storage and query**
- **Amazon S3** as the **data lake** foundation.
- **AWS Lake Formation** — builds and secures a data lake on S3 with fine-grained permissions.
- **Amazon Athena** — **serverless SQL directly on S3**. Pay per TB scanned. The answer for "**ad-hoc queries on S3 data with no infrastructure**." Cost drops sharply with **columnar formats (Parquet/ORC), compression, and partitioning** — a favourite exam optimization.
- **Amazon Redshift** — petabyte-scale columnar data warehouse for complex analytical queries. **Redshift Spectrum** queries S3 directly from Redshift.
- **Amazon OpenSearch Service** — search and log analytics.

**Transformation**
- **AWS Glue** — **serverless ETL**, plus the **Glue Data Catalog** (the metadata store Athena and Redshift Spectrum use). The answer for "serverless ETL / catalog our data / convert CSV to Parquet."
- **Amazon EMR** — managed Hadoop/Spark/Hive clusters. The answer for **big data processing frameworks** and heavy custom transformation, often on Spot.

**Visualization**
- **Amazon QuickSight** — serverless BI dashboards.

## Examples
```
Name → job:

Real-time stream, replay, many consumers      → Kinesis Data Streams
Just land streaming data in S3, no admin      → Kinesis Data Firehose
The question says "Kafka"                     → Amazon MSK
Ad-hoc SQL over S3, serverless                → Athena
Petabyte warehouse, complex joins, BI         → Redshift
Serverless ETL + data catalog                 → AWS Glue
Spark / Hadoop / Hive clusters                → EMR
Log search and analytics                      → OpenSearch
Dashboards for business users                 → QuickSight
Build and secure a data lake                  → Lake Formation
```

```
The Athena cost optimization the exam loves:

  CSV, uncompressed, unpartitioned   →  scans 1 TB  →  $5.00/query
  Parquet, snappy, partitioned by
  year/month/day                     →  scans 8 GB  →  $0.04/query

  Convert with Glue. "Reduce Athena cost" is nearly always:
  columnar format + compression + partitioning.
```

```
Streams vs Firehose — the deciding words:

"sub-second", "custom processing",
"multiple applications read the same data",
"replay the last 3 days"                      → Data Streams
"near-real-time", "no administration",
"deliver to S3/Redshift/OpenSearch",
"automatically scale"                         → Firehose
```

## Related Topics
- Batch vs stream processing
- Data lakes and warehouses
- Columnar storage formats
- ETL and schema-on-read
- OLAP

## Cards

```anki
START
Basic
Analytics: "Stream logs into S3 with zero administration and no shard management." Kinesis Data Streams or Firehose?
Back: Firehose — fully managed delivery, auto-scaling, no shards. Data Streams requires you to manage shards and write consumers.
<!--ID: 1788139019950-->
Tags: cantrill::ha-scaling
END

START
Basic
Analytics: Why would you choose Kinesis Data Streams over Firehose?
Back: When you need sub-second latency, replay of retained records, or multiple independent consumers reading the same stream at their own positions. Firehose is buffered (~60s) and delivery-only.
<!--ID: 1788139019959-->
Tags: cantrill::dynamodb-nosql
END

START
Basic
Athena: Athena queries cost too much. What three changes cut the bill most?
Back: Convert to a columnar format (Parquet/ORC), compress, and partition the data. Athena bills per TB scanned, so scanning less is the entire optimization.
<!--ID: 1788139019964-->
Tags: cantrill::dynamodb-nosql
END

START
Basic
Analytics: "Run ad-hoc SQL against data already in S3 without provisioning anything." Which service?
Back: Amazon Athena — serverless SQL directly over S3, billed per TB scanned. Redshift would require loading data into a provisioned cluster.
<!--ID: 1788139019971-->
Tags: cantrill::dynamodb-nosql
END

START
Basic
Analytics: When is Redshift right instead of Athena?
Back: For sustained, complex analytical workloads over petabytes with frequent joins and BI concurrency. Athena wins for infrequent, ad-hoc queries where you don't want a running cluster.
<!--ID: 1788139019977-->
Tags: cantrill::dynamodb-nosql
END

START
Basic
Analytics: What does the AWS Glue Data Catalog do that Athena depends on?
Back: It stores table/schema metadata for data in S3 — Athena and Redshift Spectrum query against it rather than the raw files' structure.
<!--ID: 1788139019985-->
Tags: cantrill::dynamodb-nosql
END

START
Basic
Analytics: The question mentions existing Apache Kafka producers and consumers. Which AWS service?
Back: Amazon MSK — managed Kafka. Migrating to Kinesis would mean rewriting the client code.
<!--ID: 1788139019992-->
Tags: cantrill::dynamodb-nosql
END

START
Basic
Analytics: Which service for running existing Spark jobs on large datasets, ideally on Spot for cost?
Back: Amazon EMR — managed Hadoop/Spark/Hive, and it supports Spot for task nodes to cut cost dramatically.
<!--ID: 1788139020000-->
Tags: cantrill::ec2-basics
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
