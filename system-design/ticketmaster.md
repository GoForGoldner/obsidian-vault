---
tags: [system-design, interview-prep]
---

# Design Ticketmaster

**Scale:** Millions of users competing simultaneously for limited seats on sale day

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Flash sale behavior? Seat selection or best-available? Payment integration?
>
> **The hard problem — preventing overselling:**
> 10,000 users try to buy the last ticket at the same time. Must never sell more tickets than exist.
>
> **Solution — virtual waiting queue:**
> On sale start, put everyone in a Redis queue. Issue tokens to small batches — only token holders can proceed to checkout.
>
> **Seat reservation with TTL:**
> When user selects a seat, mark it `RESERVED` for 10 minutes in Redis. If payment isn't completed, TTL expires and seat releases back to available pool.
>
> **Core components:**
> 1. **Inventory service** — `seat_id → status` in Redis for speed, persisted to DB
> 2. **Queue service** — virtual waiting room; Redis sorted set + Lua script for atomic token issuance
> 3. **Booking service** — validates reservation, processes payment, marks seat `SOLD` in a single DB transaction
> 4. **Payment service** — integrates with Stripe; idempotent
> 5. **Notification service** — confirmation on successful purchase
