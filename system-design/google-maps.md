---
tags: [system-design, interview-prep]
---

# Design Google Maps

**Scale:** 1B+ users — 1T+ location data points processed/day

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Just routing, or also map rendering? Real-time traffic? ETA accuracy?
>
> **Map rendering:**
> World map split into tiles at multiple zoom levels. Tiles pre-rendered and served via CDN. Most tiles are static and cache forever.
>
> **Routing:**
> Road network = directed weighted graph (nodes = intersections, edges = roads, weights = travel time).
> - **Dijkstra** — correct but too slow for continent-scale
> - **A\*** — heuristic (straight-line distance) explores fewer nodes
> - **Contraction Hierarchies (CH)** — pre-process by contracting unimportant nodes; query is 1000x faster than Dijkstra
>
> **Real-time traffic:** Aggregate GPS data from phones to estimate current speed per road segment. Update edge weights dynamically. Re-route if a faster path appears mid-trip.
>
> **Core components:**
> 1. **Tile service** — serves map tiles from CDN
> 2. **Geocoding service** — `address → (lat, lng)` and reverse
> 3. **Routing service** — computes optimal path given origin, destination, traffic weights
> 4. **Traffic service** — aggregates probe data from phones; updates road speed estimates
> 5. **ETA service** — ML model trained on historical travel times + time of day + current conditions
