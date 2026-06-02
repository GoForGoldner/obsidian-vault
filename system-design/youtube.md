---
tags: [system-design, interview-prep]
---

# Design YouTube

**Scale:** 2B logged-in users/month — 500 hours of video uploaded per minute

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Upload + watch or just watch? Live or on-demand?
>
> **Upload path:**
> 1. Client uploads raw video to S3 via pre-signed URL
> 2. Triggers transcoding job via message queue
> 3. Workers produce multiple resolutions (360p → 4K) split into ~2–10s segments
> 4. Manifest file (`.m3u8`) lists all quality levels and segment URLs
>
> **Watch path:**
> 1. Client fetches manifest
> 2. **Adaptive Bitrate (ABR):** player monitors bandwidth, switches quality automatically
> 3. Segments served from CDN edge nodes closest to user
>
> **Core components:**
> 1. **Upload service** — issues pre-signed S3 URLs, tracks upload state
> 2. **Transcoding pipeline** — SQS + auto-scaling worker pool. Parallelize by splitting video into chunks.
> 3. **CDN** — cache popular segments at edge nodes; tail traffic falls back to S3
> 4. **Metadata service** — title, description, view count (SQL)
>
> **Bottleneck:** Transcoding is CPU-intensive. Split raw video into 1-minute chunks, transcode in parallel, stitch segments back.
