---
epoch: 1780422412357
modelKey: "deepseek-v4-pro|deepseek"
topic: "L4 Versus L7 Load Balancing"



tags:
  - copilot-conversation
---

**user**: What is the difference between l4 and l7 load ba lancing?
[Context: Notes: concepts/patterns/command-pattern.md]
[Timestamp: 2026/06/02 13:46:52]

**ai**: The main difference is the OSI layer at which the load balancer makes routing decisions:

- **L4 (Transport Layer)** works with IP addresses and TCP/UDP ports. It doesn't inspect the actual application data (like HTTP headers or payload). Routing is based purely on network and transport layer information.
- **L7 (Application Layer)** understands the content of the traffic (e.g., HTTP headers, URL paths, cookies, TLS session IDs). It can make intelligent routing decisions by reading application data.

| Aspect | L4 Load Balancing | L7 Load Balancing |
|--------|------------------|-------------------|
| OSI Layer | Layer 4 (Transport) | Layer 7 (Application) |
| Data Inspected | Source/destination IP, port, protocol | HTTP Host, path, headers, cookies, payload |
| Routing Logic | Round‑robin, least‑connections, etc., based on connection info | Content‑based (e.g., redirect `/images` to a different backend, sticky sessions, A/B testing) |
| Performance Overhead | Lower (no parsing of application data) | Higher (needs to terminate/parse the protocol) |
| Protocols Supported | Any TCP/UDP | Typically HTTP/HTTPS, WebSockets, gRPC, etc. |
| TLS Termination | Usually not (passes through encrypted traffic) | Yes (can decrypt, inspect, then re‑encrypt) |
| Typical Use Cases | Simple traffic distribution for TCP-based services (e.g., game servers, non-HTTP protocols) | Microservices, API gateways, serving different content based on the request |

**When to use which:**
- **L4** when you need raw speed, don't need to differentiate by content, or are dealing with non‑HTTP protocols.
- **L7** when you need routing based on the request (e.g., path-based routing, header inspection, sticky sessions), or when you want to offload TLS, authentication, or rate‑limiting at the load balancer.

If you have a [[load-balancing]] note in your vault, it might cover more basics; this distinction is a common extension.
[Timestamp: 2026/06/02 13:47:20]