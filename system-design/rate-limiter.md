---
tags: [system-design, interview-prep]
---

# Design a Rate Limiter

**Scale:** Applied per-user or per-IP across millions of clients

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Per user, per IP, or per API key? Hard drop or soft queue? Single server or distributed?
>
> **Algorithms:**
>
> | Algorithm | Trade-off |
> |---|---|
> | Fixed window counter | Simple but allows 2x burst at window boundary |
> | Sliding window log | Accurate but O(requests) memory |
> | Sliding window counter | Good balance — weighted blend of current + previous window |
> | Token bucket | Allows controlled bursts |
> | Leaky bucket | Smooth output rate, adds queue delay |
>
> **Distributed:** Store counters in Redis. Use atomic Lua script to check-and-increment. Mitigate Redis latency with local in-process counter synced every ~100ms.
>
> **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`
