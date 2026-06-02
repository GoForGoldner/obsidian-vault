---
tags: [system-design, interview-prep]
---

# Design Google Docs

**Scale:** ~10 concurrent editors per document

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Offline support? Rich text or plain text? Version history?
>
> **The hard problem — concurrent edits:**
> Two users insert at position 5 simultaneously. After both ops apply, positions shift — naive last-write-wins destroys data.
>
> **Solution — Operational Transformation (OT):**
> - Every op is transformed against concurrent ops before applying
> - Server sequences all ops and broadcasts the canonical order
> - Client applies ops optimistically, then reconciles with server's order
>
> **Alternative — CRDTs:** Each character gets a unique ID. Merging is always deterministic. Used by Figma, Notion. No central server needed.
>
> **Core components:**
> 1. **WebSocket server** — persistent connections per doc, routes ops between clients
> 2. **Op log** — append-only log of all ops per document (Kafka or DB table)
> 3. **Document state** — snapshot in S3, rebuilt by replaying the op log
> 4. **Presence service** — live cursors via Redis pub/sub
> 5. **Autosave** — debounce writes, flush to DB every few seconds
>
> **Bottleneck:** All editors of a doc must connect to the same server (or use pub/sub between servers). Use consistent hashing to route by doc ID.
