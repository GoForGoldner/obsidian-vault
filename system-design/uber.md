---
tags: [system-design, interview-prep]
---

# Design Uber

**Scale:** 5M trips/day — 1M active drivers sending GPS every 4s = 250K writes/second

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Just matching, or routing/navigation too?
>
> **The hard problem — geospatial queries:**
> Need to answer "all drivers within 5km of this point" in milliseconds.
>
> **Solution — Geohash:**
> Encode lat/lng as a string prefix. Nearby points share prefixes. Store `geohash → [driverIds]` in Redis. Query target cell + 8 adjacent cells.
>
> **Core components:**
> 1. **Location service** — ingests driver GPS pings, updates Redis geospatial index
> 2. **Matching service** — finds nearby drivers, ranks by ETA, offers ride to best match
> 3. **Trip service** — manages state machine (requested → accepted → in-progress → completed)
> 4. **Surge pricing** — compares supply vs demand per geohash cell
> 5. **WebSocket** — rider tracks driver live after match
