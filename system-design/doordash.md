---
tags: [system-design, interview-prep]
---

# Design DoorDash

**Scale:** Three-sided marketplace — customer, restaurant, driver — all need real-time updates

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Real-time location tracking? ETA predictions? How are drivers assigned?
>
> **The hard problem — three-party coordination:**
> Order state must stay consistent across customer app, restaurant tablet, and driver app simultaneously.
>
> **State machine:**
> `placed → confirmed → preparing → ready_for_pickup → picked_up → delivered`
> Each transition publishes an event that fans out to all three parties.
>
> **Core components:**
> 1. **Order service** — manages state machine; publishes state change events to Kafka
> 2. **Restaurant service** — tablet app receives orders via WebSocket; confirms and updates prep status
> 3. **Driver matching** — geospatial matching (same as Uber); assign nearest available driver when order is `ready_for_pickup`
> 4. **Location service** — driver sends GPS every 4s; customer sees live tracking after `picked_up`
> 5. **ETA service** — ML model: prep time estimate + driver travel time (historical + live traffic)
> 6. **Notification service** — push notifications at each state transition to all parties
> 7. **Payment** — charged at order placement; payouts to restaurant and driver after delivery
