---
tags: [system-design, interview-prep]
---

# Design Bitly

**Scale:** 100M URLs shortened per day — 100:1 read/write ratio

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Custom aliases? Analytics (click counts, geo)?
>
> **API:**
> - `POST /shorten` → `{ shortUrl }`
> - `GET /:slug` → redirect to original
>
> **Core components:**
> 1. **ID generation** — base62-encode an auto-incrementing counter (7 chars = 62^7 = 3.5T URLs). Or hash the URL and take first 7 chars, but handle collisions.
> 2. **Storage** — `slug → original_url`. Pure key-value lookup → NoSQL (DynamoDB) or Redis.
> 3. **Redirect** — `301` (permanent, browser caches, loses analytics) vs `302` (temporary, every visit hits server, trackable).
> 4. **Cache** — top 20% of URLs get 80% of traffic. Cache hot slugs in Redis.
> 5. **Analytics** — write click events to Kafka asynchronously; separate aggregation service.
>
> **Bottleneck:** Read-heavy (100:1 read/write). Solve with CDN + Redis caching layer.
