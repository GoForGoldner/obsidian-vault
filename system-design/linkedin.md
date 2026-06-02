---
tags: [system-design, interview-prep]
---

# Design LinkedIn

**Scale:** 900M users — degree-of-connection queries across a massive graph

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** 1st/2nd/3rd degree connections? Job recommendations? Messaging?
>
> **The hard problem — degree-of-connection queries:**
> "Are these two users connected within 3 degrees?" on a graph of 900M nodes.
>
> **Solution:** Bidirectional BFS from both nodes toward each other. Store the social graph in a graph DB or adjacency list in a distributed KV store. Cache 1st and 2nd degree connections per user.
>
> **Core components:**
> 1. **Profile service** — resume data, skills, experience (SQL)
> 2. **Connection service** — bidirectional edges; graph DB or adjacency list
> 3. **Feed service** — posts from connections + followed companies; hybrid fan-out
> 4. **Job service** — listings with structured data; Elasticsearch for search/matching
> 5. **Recommendations** — "People You May Know" via common connections + profile similarity (offline batch job)
> 6. **Messaging** — same architecture as WhatsApp
