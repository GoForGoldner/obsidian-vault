---
tags: [system-design, interview-prep]
---

# Design a Distributed Cache (like Redis)

**Scale:** Sub-millisecond latency — data too large for one machine

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** GET/SET/DELETE + TTL? Consistency requirements? Data size?
>
> **Single node:** In-memory hash map + LRU eviction (hash map + doubly linked list) + TTL background sweep.
>
> **Distributed:**
> 1. **Consistent hashing** — adding/removing a node only re-maps ~1/N keys
> 2. **Replication** — N copies per key; primary handles writes, replicas serve reads
> 3. **Quorum** — W + R > N = strong consistency
> 4. **Gossip protocol** — nodes share state with random peers to detect failures
> 5. **Hotspot** — cache a hot key on multiple nodes, distribute reads randomly
