---
epoch: 1780422805228
modelKey: deepseek-v4-flash|deepseek
topic: L4 vs L7 Load Balancing
tags:
  - copilot-conversation
lastAccessedAt: 1780424303177
---

**user**: What is the difference between l4 and l7 load balancing
[Timestamp: 2026/06/02 13:53:25]

**ai**: L4 (Layer 4) and L7 (Layer 7) load balancing differ primarily in the OSI layer they operate on and the level of intelligence they can apply.

---

## Core Differences

| Aspect | L4 Load Balancer | L7 Load Balancer |
|--------|------------------|------------------|
| **Layer** | Transport (TCP/UDP) | Application (HTTP, gRPC, etc.) |
| **Routing decision** | IP, port, protocol | Header, cookie, URI, payload content |
| **Performance** | Very high (minimal processing) | Slightly lower (needs to parse payload) |
| **TLS termination** | No (unless explicitly configured) | Yes (can offload SSL) |
| **Sticky sessions** | Based on source IP | Based on cookie or session |
| **Use cases** | Simple TCP/UDP traffic, load balancing databases, VPNs | HTTP/S APIs, microservices, content‑aware routing |
| **Can cache** | No | Yes (some L7 balancers can cache responses) |

**When to use L4**: You need raw TCP/UDP forwarding with minimal latency, no application‑level inspection required. Good for databases, messaging queues, or when you need to preserve the client IP without proxying.

**When to use L7**: You need traffic inspection, content‑based routing (e.g., route `/api/v1` to one backend, `/api/v2` to another), SSL termination, or header rewriting. Standard for modern web apps and microservices.

---

I've added a note with this explanation to keep for review.

Added [[l4-vs-l7-load-balancing]] in `concepts/system-design/`.

---

## Anki Cards (3)

**Card 1 – Concept**
START
Basic
Which layer does an L4 load balancer operate on, and how does it differ from an L7 balancer in terms of routing?
Back: L4 works at the transport layer (TCP/UDP) and routes based on IP and port. L7 works at the application layer and can inspect headers, cookies, and URI paths.
END

**Card 2 – Gotcha**
START
Basic
You have a database cluster that must preserve client IP addresses for logging. Should you use L4 or L7 load balancing?
Back: Use L4. L7 typically terminates the connection and proxies it, losing the original client IP unless explicitly forwarded (via X‑Forwarded‑For). L4 preserves the original IP because it only forwards packets without inspecting the payload.
END

**Card 3 – Recognition**
START
Basic
You need to route traffic to different server pools based on the URL path (`/api` vs `/static`). Which load balancer type must you use?
Back: An L7 load balancer, because URL routing requires inspecting the application layer (HTTP path).
END
[Timestamp: 2026/06/02 13:53:38]