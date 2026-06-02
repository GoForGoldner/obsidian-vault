---
tags: [system-design, interview-prep]
---

# Design Spotify

**Scale:** 600M users — 100M songs in catalog — 30s buffer maintained during playback

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** On-demand streaming or also radio/podcast? Offline downloads? Lyrics sync?
>
> **Core components:**
> 1. **Audio storage** — songs in multiple bitrates (96/160/320kbps) in S3; served via CDN
> 2. **Streaming** — HTTP range requests or MPEG-DASH for adaptive streaming. Buffer ~30s ahead.
> 3. **Catalog service** — metadata (artist, album, track info) in SQL; heavily read-cached
> 4. **Search** — Elasticsearch over catalog; supports fuzzy matching
> 5. **Recommendations** — collaborative filtering (similar taste users liked X) + content-based (audio features). Offline batch job, cached per user.
> 6. **Offline downloads** — DRM-encrypted files downloaded to device; decryption key tied to active subscription
>
> **Licensing:** Song play events logged to a queue; royalty calculation is a batch job aggregating play counts to distribute to rights holders.
