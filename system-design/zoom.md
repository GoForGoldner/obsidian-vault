---
tags: [system-design, interview-prep]
---

# Design Zoom

**Scale:** 300M daily meeting participants — latency must be < 150ms for real-time feel

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Max participants per call? Screen sharing? Recording?
>
> **The hard problem — real-time media at scale:**
> A naive star topology where every client sends to every other client = O(N²) bandwidth.
>
> **Solution — Selective Forwarding Unit (SFU):**
> Each client sends one stream to a central media server. The SFU forwards each participant's stream to all others. The server controls quality/bitrate per stream.
>
> **Protocol:** WebRTC for browser/app clients. UDP preferred over TCP — a dropped packet is better than a delayed one.
>
> **Core components:**
> 1. **Signaling server** — WebSocket; handles session negotiation and ICE candidates for NAT traversal
> 2. **SFU media server** — receives and forwards streams; applies simulcast (client sends 3 quality levels, SFU picks per receiver)
> 3. **TURN server** — relay for clients behind restrictive NATs
> 4. **Recording service** — mixes streams server-side, writes to object storage
> 5. **Chat/reactions** — lightweight side channel over WebSocket
