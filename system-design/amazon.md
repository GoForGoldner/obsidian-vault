---
tags: [system-design, interview-prep]
---

# Design Amazon

**Scale:** 300M active customers — 1.6M packages shipped per day

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Marketplace (3rd party sellers) or single retailer? Flash sales? How many SKUs?
>
> **The hard problem — inventory consistency under flash sales:**
> Thousands of users try to buy the last item simultaneously. Must not oversell.
>
> **Solution:** Use a Redis counter as a fast pre-check; atomic decrement. DB-level constraint as final guarantee. Wrap purchase in a transaction.
>
> **Core components:**
> 1. **Product service** — catalog, pricing (SQL + Elasticsearch for search)
> 2. **Cart service** — stored in Redis (ephemeral) or DB (persistent); expires after inactivity
> 3. **Inventory service** — tracks stock per SKU; atomic decrement on purchase
> 4. **Order service** — creates order, triggers payment, notifies warehouse
> 5. **Payment service** — idempotent; integrates with payment processors
> 6. **Recommendation service** — "customers also bought"; collaborative filtering (offline batch job)
> 7. **Search** — Elasticsearch with faceted filtering (price range, brand, rating, shipping speed)
