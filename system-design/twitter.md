---
tags: [system-design, interview-prep]
---

# Design Twitter

**Scale:** 300M DAU — 500M tweets/day

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Chronological or ranked feed?
>
> **The hard problem — feed generation:**
> - **Fan-out on write (push):** On tweet, write tweet ID into every follower's feed cache. Read is instant. Fails for celebrities (80M followers = 80M writes per tweet).
> - **Fan-out on read (pull):** On feed request, fetch from each followed user and merge. Write is cheap, read is slow.
> - **Hybrid (Twitter's approach):** Fan-out on write for normal users, fan-out on read for celebrities. Merge at read time.
>
> **Core components:**
> 1. **Tweet service** — writes to DB, enqueues fan-out jobs
> 2. **Fan-out workers** — consume queue, write tweet IDs to follower feed caches
> 3. **Feed cache** — Redis sorted set per user, scored by timestamp, capped at ~800 entries
> 4. **User graph service** — follower/following relationships
> 5. **Media** — images/video in S3 + CDN
