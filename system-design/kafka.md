---
tags: [system-design, interview-prep]
---

# Design a Distributed Message Queue (like Kafka)

**Scale:** Millions of messages/second — retained for days for replay

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** At-least-once or exactly-once delivery? Ordering guarantees? Retention period?
>
> **Core concepts:**
> - **Topic** — logical channel
> - **Partition** — a topic is split into N ordered, append-only logs
> - **Offset** — each message has a sequential ID within its partition; consumers track their offset
> - **Consumer group** — each partition assigned to one consumer in the group; N partitions = N parallel consumers max
>
> **Core components:**
> 1. **Broker** — stores partitions on disk as append-only segment files
> 2. **ZooKeeper / KRaft** — cluster metadata, leader election per partition
> 3. **Producer** — chooses partition (by key hash or round-robin); sends batches for throughput
> 4. **Consumer** — polls broker for new messages; commits offset after processing
> 5. **Replication** — each partition has 1 leader + N-1 followers; leader handles reads/writes
>
> **Ordering guarantee:** Only within a partition. For global order, use 1 partition (limits throughput).
>
> **Retention:** Messages kept on disk for a configurable period (e.g., 7 days) regardless of consumption — allows replay and multiple independent consumers.
