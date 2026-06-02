---
tags: [system-design, interview-prep]
---

# Design Dropbox

**Scale:** 700M registered users — files synced across all devices

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Max file size? Conflict resolution when same file edited on two devices? Sharing?
>
> **The hard problem — efficient sync:**
> Don't re-upload the whole file on every change.
>
> **Block-level sync:** Split files into ~4MB chunks. On change, only upload modified blocks. Each block is content-addressed by hash → automatic deduplication across all users.
>
> **Core components:**
> 1. **Upload service** — client checks which blocks already exist (by hash), uploads only new blocks to S3
> 2. **Metadata service** — file tree, block list per file, version history (SQL — strong consistency needed)
> 3. **Sync service** — publishes change events; other devices receive via WebSocket and download changed blocks
> 4. **Conflict resolution** — two offline edits → keep both: `report.doc` and `report (conflicted copy).doc`
