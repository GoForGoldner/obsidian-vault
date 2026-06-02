---
tags: [system-design, interview-prep]
---

# Design a Notification System

**Scale:** 10M+ notifications/day across push, email, and SMS

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Which channels (push, email, SMS, in-app)? Time-critical vs marketing? User opt-out preferences?
>
> **Core components:**
> 1. **Notification API** — accepts `{ userId, type, channel, payload }`, validates, enqueues
> 2. **Kafka** — one topic per channel; decouples producers, handles traffic spikes
> 3. **Workers** — push (APNs/FCM), email (SendGrid), SMS (Twilio)
> 4. **User preference service** — opt-outs, quiet hours, channel preferences checked before enqueue
> 5. **Deduplication** — idempotency key per notification; workers check before sending
> 6. **Dead letter queue** — failed messages go to DLQ for alerting and retry
