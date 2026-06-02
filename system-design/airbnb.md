---
tags: [system-design, interview-prep]
---
![[airbnb-design-1.png|697]]
# Design Airbnb

**Scale:** 150M users — 7M active listings worldwide

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Instant book vs host approval? Search radius? How far in advance can you book?
>
> **The hard problem — preventing double booking:**
> Two guests try to book the same listing for the same dates simultaneously.
>
> **Solution:** DB-level unique constraint on `(listing_id, date)` in a calendar table. Wrap booking in a transaction with `SELECT FOR UPDATE` to lock the relevant rows.
>
> **Core components:**
> 1. **Listing service** — property metadata in SQL; photos in S3 + CDN
> 2. **Availability service** — calendar of `(listing_id, date, status)`. Updated when booked or blocked by host.
> 3. **Search service** — geospatial query (PostGIS/Elasticsearch) + availability filter + ranking. Cache results with short TTL.
> 4. **Booking service** — transactional; checks availability, locks dates, processes payment, confirms booking
> 5. **Pricing service** — dynamic rates per listing per date; demand-based multipliers
