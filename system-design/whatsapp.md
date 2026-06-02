---
tags: [system-design, interview-prep]
---

# Design WhatsApp

**Scale:** 2B users — 100B messages/day

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Group chat max size? Media support? End-to-end encryption? Read receipts?
>
> **Core components:**
> 1. **WebSocket server** — stateful; a user's connection lives on one server
> 2. **Message store** — Cassandra: partition key = `conversation_id`, clustering key = `message_id`. Optimized for "last N messages in conversation."
> 3. **Offline delivery** — message stored server-side; push notification (APNs/FCM) to wake app; client pulls on reconnect.
> 4. **Presence service** — Redis with short TTL; client sends heartbeat every 5s
> 5. **Cross-server routing** — Redis pub/sub channel per user; server A publishes → server B delivers via WebSocket
> 6. **Media** — client uploads directly to S3, sends only the URL in the message
>
> **Group chat:** Fan-out message to all members. For large groups, queue the fan-out asynchronously.
