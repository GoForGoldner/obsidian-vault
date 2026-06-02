---
tags: [system-design, interview-prep]
---

# Design Yelp

**Scale:** 178M unique visitors/month — 224M reviews

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Search radius options? What business metadata? Reviews and ratings included?
>
> **The hard problem — geospatial queries:**
> "Find all restaurants within 5km of (lat, lng)" needs to be fast.
>
> **Solutions:**
> - **Geohash** — encode location as a string prefix; nearby places share prefix; query target cell + neighbors
> - **QuadTree** — recursively split map into quadrants until each cell has ≤ N businesses; fast range queries
> - **PostGIS** — geospatial extension for PostgreSQL; `ST_DWithin(point, center, radius)` with spatial index
>
> **Core components:**
> 1. **Business service** — CRUD for business metadata; SQL DB
> 2. **Location index** — geospatial index (QuadTree or PostGIS); updated when businesses are added/modified
> 3. **Search service** — query location index, filter by category/hours/rating, sort by distance or relevance
> 4. **Review service** — reviews in SQL; average rating cached in Redis and updated asynchronously
> 5. **CDN** — business photos served from edge
