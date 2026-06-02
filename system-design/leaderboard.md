---
tags: [system-design, interview-prep]
---

# Design a Live Leaderboard

**Scale:** Millions of score updates/second — top 10 must reflect updates in real time

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Global or per-game? Real-time or refresh every N seconds? Score history or just current?
>
> **The hard problem — maintaining a sorted top-K at high write throughput:**
> Can't sort all scores on every request. Can't afford a full table scan.
>
> **Solution — Redis Sorted Set:**
> - `ZADD leaderboard <score> <userId>` — O(log N) insert
> - `ZREVRANGE leaderboard 0 9 WITHSCORES` — O(log N + K) to get top K
> - Handles millions of score updates/second with sub-millisecond reads
>
> **For data too large for one Redis node:**
> - Shard leaderboard by user ID range across multiple Redis nodes
> - Each node tracks its own top K
> - A merger node queries all shards and picks the global top K
>
> **Core components:**
> 1. **Score ingestion service** — validates and writes score events to Kafka
> 2. **Score processor** — consumes Kafka, updates Redis sorted set
> 3. **Leaderboard service** — reads Redis; merges shard results if sharded
> 4. **WebSocket / SSE** — pushes leaderboard updates to clients watching live
> 5. **Historical scores** — persisted to Cassandra for analytics; Redis is ephemeral
