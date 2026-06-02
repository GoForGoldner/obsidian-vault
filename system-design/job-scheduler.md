---
tags: [system-design, interview-prep]
---

# Design a Distributed Job Scheduler

**Scale:** Millions of scheduled jobs — must execute exactly once even if servers crash

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** At-most-once or exactly-once execution? Max delay tolerance? Long-running or quick tasks?
>
> **The hard problem — exactly-once execution in a distributed system:**
> If the scheduler crashes after dispatching a job but before confirming execution, the job may run twice on recovery.
>
> **Solution — heartbeat + watchdog:**
> Worker acquires a DB lock on the job (`status = RUNNING`, `claimed_by`, `heartbeat_at`). If worker crashes, heartbeat stops. A watchdog reclaims jobs whose heartbeat is stale.
>
> **Core components:**
> 1. **Job store** — DB table: `(job_id, cron_expr, next_run_at, status, last_run_at)`
> 2. **Scheduler** — polls for jobs where `next_run_at <= now AND status = PENDING`; claims job atomically (optimistic locking)
> 3. **Worker pool** — executes job logic; sends heartbeats; updates status on completion
> 4. **Watchdog** — reclaims stale jobs from dead workers
> 5. **Job queue (Kafka/SQS)** — buffer between scheduler and workers for high throughput
>
> **Cron parsing:** Parse cron expression → pre-compute `next_run_at` → efficient DB polling.
