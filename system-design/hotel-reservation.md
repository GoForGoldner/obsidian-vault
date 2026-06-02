---
tags: [system-design, interview-prep]
---

# Design a Hotel Reservation System (like Booking.com)

**Scale:** 28M listings — 1.5M room nights booked per day

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** How far in advance? Cancellation policy? Dynamic pricing? Payment at booking or check-in?
>
> **The hard problem — preventing overbooking:**
> Two users book the last available room simultaneously.
>
> **Solution:** Use an `inventory` table: `(hotel_id, room_type, date, total_rooms, reserved_rooms)`. Wrap booking in a transaction with `SELECT FOR UPDATE` to lock rows:
> ```sql
> SELECT reserved_rooms FROM inventory
> WHERE hotel_id=X AND room_type=Y AND date=D FOR UPDATE;
> -- if reserved_rooms < total_rooms:
> UPDATE inventory SET reserved_rooms = reserved_rooms + 1 ...
> INSERT INTO bookings ...
> ```
>
> **Core components:**
> 1. **Hotel service** — property metadata, photos, amenities (SQL + S3/CDN)
> 2. **Search service** — geo search (PostGIS/Elasticsearch) + availability filter + price sort. Cache with short TTL.
> 3. **Inventory service** — tracks room availability per hotel/room type/date
> 4. **Booking service** — transactional; reserves inventory + processes payment atomically
> 5. **Pricing service** — dynamic rates per room per date; demand-based yield management
