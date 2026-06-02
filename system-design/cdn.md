---
tags: [system-design, interview-prep]
---

# Design a CDN

**Scale:** Serve static assets to billions of users with < 20ms latency globally

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** What content types? Cache invalidation needs? Custom domains?
>
> **How a CDN works:**
> 1. User requests `cdn.example.com/image.jpg`
> 2. DNS resolves to nearest edge PoP via Anycast routing
> 3. Edge checks local cache — **HIT**: serve immediately; **MISS**: fetch from origin, cache, serve
> 4. Subsequent requests from that region hit the cache
>
> **Cache invalidation:**
> - **TTL-based** — content expires after N seconds. Simple but stale window.
> - **Purge API** — explicitly invalidate a URL. Immediate but must propagate to all edge nodes.
> - **Versioned URLs** — `image.v3.jpg` — old version stays cached; new version = new cache key. Best practice.
>
> **Core components:**
> 1. **Edge servers** — distributed globally; local SSD cache; serve requests
> 2. **Origin shield** — mid-tier cache layer between edge and origin; reduces origin load on cache miss storms
> 3. **Anycast DNS** — directs users to nearest PoP
> 4. **Purge service** — propagates invalidations to all edge nodes
> 5. **Analytics** — cache hit rates, bandwidth served, error rates per edge
