---
tags: [system-design, interview-prep]
---

# Design Reddit

**Scale:** 1.5B monthly visitors — 57M DAU

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Vote counting in real time? Nested comments? How is "hot" ranking calculated?
>
> **The hard problem — vote counting at scale:**
> A viral post gets millions of votes per hour. Can't update a single row that many times.
>
> **Solution:** Use a Redis counter (INCR) for live counts; periodically flush to DB. Accept slightly stale counts on reads.
>
> **Ranking algorithms:**
> - **Hot** — score = (upvotes - downvotes) / (age in hours)^gravity. Older posts decay faster.
> - **Top** — pure upvote count over time period
> - **New** — pure recency
>
> **Core components:**
> 1. **Post service** — creates posts with `subreddit_id`, `author_id`, `title`, `url/text`
> 2. **Vote service** — records `(user_id, post_id, direction)`; updates Redis counter; async flush to DB
> 3. **Comment service** — nested comments stored with `parent_id`
> 4. **Feed service** — pre-computes ranked feeds per subreddit; refreshed periodically
> 5. **Search** — Elasticsearch over posts and comments
