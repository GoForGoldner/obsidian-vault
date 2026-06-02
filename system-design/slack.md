---
tags: [system-design, interview-prep]
---

# Design Slack

**Scale:** 20M DAU — messages persist indefinitely and must be searchable

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Max workspace size? Threads? Full-text search over history? Bot integrations?
>
> **Core components:**
> 1. **WebSocket gateway** — persistent connections per client; Redis pub/sub for cross-server delivery
> 2. **Channel service** — membership, permissions, metadata (SQL)
> 3. **Message store** — Cassandra: partition key = `channel_id`, clustering key = `message_id` (time-ordered). Append-only.
> 4. **Search** — Elasticsearch index fed by async consumer of message events
> 5. **File service** — uploads to S3, stores metadata + download URL
> 6. **Notification service** — push/email for mentions and DMs when user is offline
>
> **Threads:** A thread is a message with a `parent_message_id`. Stored in the same message table. Thread reply count cached in Redis.
