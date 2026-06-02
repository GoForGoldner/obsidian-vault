---
tags: [system-design, interview-prep]
---

# Design Search Autocomplete

**Scale:** Respond in < 100ms to every keystroke across billions of daily searches

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Personalized or global suggestions? How many suggestions shown? Explicit curation or data-driven?
>
> **The hard problem — speed at scale:**
> Must respond in < 100ms. Can't query a database on every keystroke.
>
> **Data structure — Trie:**
> Each node = a character. Each node stores the top K completions for that prefix. Traversal to prefix node = O(prefix length). Built offline from query logs.
>
> **At scale:**
> - Trie is too large for one machine → shard by first character(s)
> - Trie rebuilt periodically (e.g., daily) from query frequency logs
> - Results cached in Redis by prefix — most traffic hits just a few thousand common prefixes
>
> **Core components:**
> 1. **Data collection** — log every search query with frequency; aggregate hourly/daily
> 2. **Trie builder** — batch job that builds new trie from aggregated logs; stores serialized trie in object storage
> 3. **Trie service** — loads trie into memory; serves prefix lookups
> 4. **Cache** — Redis caches top-K for most common prefixes
> 5. **Filter** — remove offensive/spam terms before storing suggestions
