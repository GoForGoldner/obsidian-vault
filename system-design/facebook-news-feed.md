---
tags: [system-design, interview-prep]
---

# Design Facebook News Feed

**Scale:** 2B DAU — personalized ranked feed per user

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Ranked by ML relevance or chronological? Content types (text, photos, videos, shares, ads)?
>
> **Same fan-out problem as Twitter, but with ML ranking:**
> Facebook's feed is ranked, not chronological — requires a scoring model at read time.
>
> **Core components:**
> 1. **Post service** — creates posts; triggers fan-out
> 2. **Fan-out service** — writes post IDs into follower feed caches (hybrid push/pull)
> 3. **Feed ranking service** — at read time, fetches candidate posts from cache, scores each with ML model, returns top N
> 4. **Social graph service** — stores friend/follow relationships
> 5. **Ads service** — injects sponsored content at ranking time
>
> **Edge ranking signals:** Time since post, predicted likes/comments/shares, relationship closeness to poster, content type preference.
