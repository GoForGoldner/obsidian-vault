---
tags: [system-design, interview-prep]
---

# Design Instagram

**Scale:** 100M DAU — 20M photos uploaded/day

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Ranked or chronological feed? Stories?
>
> **Core components:**
> 1. **Photo upload** — client uploads directly to S3 via pre-signed URL, then registers metadata (owner, caption, S3 key) via API
> 2. **Image processing** — generate thumbnails, run content moderation asynchronously via job queue
> 3. **CDN** — all images served from edge nodes; photos are immutable = perfect cache hit rate
> 4. **Feed** — hybrid fan-out same as Twitter; feed stored as ranked list in Redis per user
> 5. **Stories** — separate from main feed; 24h TTL; view state tracked per user per story in Redis bitmap
