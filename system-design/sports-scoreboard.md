---
tags: [system-design, interview-prep]
---

# Design a Real-Time Sports Scoreboard

**Scale:** 10M+ concurrent viewers per game — score updates every few seconds

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** How many live games simultaneously? Latency tolerance? Mobile + web?
>
> **The hard problem — fan-out at scale:**
> 1 game has 10M viewers. Score updates every few seconds. Pushing to 10M WebSocket connections simultaneously is expensive.
>
> **Solution — tiered fan-out:**
> 1. Score update arrives → published to a Redis channel for that game
> 2. Regional edge servers subscribe to that channel
> 3. Edge servers push to their local WebSocket connections
> 4. 10M connections spread across hundreds of edge servers, each handling ~100K connections
>
> **Alternative — short-poll:**
> If true real-time isn't required, clients poll every 5s. Score cached in Redis with 5s TTL. Very simple, scales infinitely.
>
> **Core components:**
> 1. **Score ingestion** — authorized data provider pushes score events via API
> 2. **Score store** — Redis (current score, game state) + DB (historical)
> 3. **Pub/sub bus** — Redis pub/sub or Kafka; fan-out to edge servers
> 4. **WebSocket servers** — maintain client connections; subscribe to relevant game channels
> 5. **REST API** — for polling clients; score served from Redis cache
