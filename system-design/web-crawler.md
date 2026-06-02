---
tags: [system-design, interview-prep]
---

# Design a Web Crawler

**Scale:** Crawl billions of pages — re-crawl for freshness

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** How much of the web? Re-crawl frequency? Just HTML or also media?
>
> **Core components:**
> 1. **URL frontier** — queue of URLs to crawl; partitioned by domain (politeness — don't hammer one site)
> 2. **Fetcher workers** — download HTML; respect `robots.txt`; rate-limit per domain
> 3. **HTML parser** — extract + normalize links; add new URLs to frontier
> 4. **URL dedup** — bloom filter (1B URLs ≈ 1.2GB at 1% false positive rate — fits in memory)
> 5. **Content dedup** — hash page body; skip if already seen (handles mirror sites)
> 6. **Content storage** — raw HTML in S3; parsed content to downstream indexer
> 7. **Scheduler** — priority queue; re-crawl high-importance pages more often
>
> **Politeness rules:** One outstanding request per domain at a time. Minimum 1s delay between requests to same domain. Honor `Crawl-delay` in `robots.txt`.
