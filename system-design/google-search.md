---
tags: [system-design, interview-prep]
---

# Design Google Search

**Scale:** 8.5B searches/day — index of 100B+ web pages — results in < 100ms

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Just retrieval, or also crawling + indexing?
>
> **Three subsystems:**
>
> **Crawler:** Fetch pages from seed URLs. Extract links, add to frontier queue. Deduplicate URLs with bloom filter. Respect `robots.txt`.
>
> **Indexer:** Parse HTML → normalize text → build **inverted index** (`word → [(docId, position, frequency)]`). Compute PageRank from link graph. Shard index by term across thousands of machines.
>
> **Query processor:** Look up each query term in index → intersect doc sets → rank by TF-IDF + PageRank + 200+ signals → return top K. Cache popular queries in Redis.
>
> **Scale trick:** Query fans out to all index shards in parallel, each returns local top K, merger picks global top K.
