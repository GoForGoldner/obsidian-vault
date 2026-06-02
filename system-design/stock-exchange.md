---
tags: [system-design, interview-prep]
---

# Design a Stock Exchange

**Scale:** Microsecond order matching — millions of orders/second

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Limit orders and market orders? Regulatory requirements?
>
> **The hard problem — order matching:**
> Orders must match in strict price-time priority. Requires ultra-low-latency.
>
> **Order book:** Two sorted structures per stock — bids (buy, descending by price) and asks (sell, ascending by price). When highest bid ≥ lowest ask, a trade executes.
>
> **Implementation:** Red-black tree or priority queue per side. In-memory — no DB calls in the hot path.
>
> **Core components:**
> 1. **Order gateway** — validates orders; writes to order log (Kafka)
> 2. **Matching engine** — single-threaded, in-memory; processes orders in strict sequence; outputs trade events
> 3. **Order book** — in-memory red-black tree per symbol; rebuilt from log on restart
> 4. **Market data service** — streams real-time prices to clients via WebSocket
> 5. **Settlement service** — processes completed trades; updates account balances async
> 6. **Risk engine** — pre-trade checks (sufficient funds, position limits) before order reaches matching engine
>
> **Why single-threaded matching engine?** Avoids locking overhead. One thread processes millions of orders/second in memory.
