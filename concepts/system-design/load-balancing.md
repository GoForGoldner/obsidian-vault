---
tags: [system-design, infrastructure]
category: system-design
related: [horizontal-vs-vertical-scaling, microservices-vs-monolith]
---

## Description
Distributing incoming requests across multiple servers to improve performance, reliability, and redundancy.

## Benefits
- No single server is overwhelmed
- Redundancy: if one server dies, traffic goes to the others
- Can scale horizontally by adding more servers

## Downsides
- Load balancer itself can be a single point of failure (need redundant LBs)
- Session affinity adds complexity
- Configuration and health check tuning


## Examples
```
Client requests -> [Load Balancer] -> Server A, B, or C

Strategies:
  Round Robin:       A -> B -> C -> A -> B -> C
  Least Connections: send to whichever server has fewest active requests
  IP Hash:           same client IP always goes to same server (sessions)
  Weighted:          stronger server gets more traffic

Health checks: LB pings /health every 10s
  Server B stops responding -> LB removes it
  Server B comes back -> LB adds it back
```

## Related Topics
- [[horizontal-vs-vertical-scaling|Horizontal Scaling]]
- [[microservices-vs-monolith|Microservices]]
- [[load-balancing|Reverse Proxy]]
- [[load-balancing|Health Checks]]
- [[load-balancing|Nginx]]

## Cards

```anki
START
Basic
What's the core difference between L4 and L7 load balancing?
Back: L4 routes on transport-layer info (IP, port, protocol) WITHOUT reading the payload — fast, low overhead.<br>L7 reads application-layer data (HTTP headers, path, cookies) to make content-based routing decisions — more capable but higher cost.
<!--ID: 1782144297891-->
END

START
Basic
A TCP/database service must preserve the original client IP. L4 or L7, and why?
Back: L4. It forwards packets without proxying, so the source IP is preserved.<br>L7 terminates the connection and proxies it, losing the client IP unless it's forwarded via `X-Forwarded-For`.
<!--ID: 1782144297894-->
END

START
Basic
You need to route `/api` and `/static` to different backend pools. L4 or L7, and why?
Back: L7. Path-based routing requires inspecting application-layer data (the HTTP URL/path), which only an L7 balancer reads.<br>L4 only sees IP/port, so it can't route on path.
<!--ID: 1782144297897-->
END

START
Basic
Which load-balancing layer can terminate TLS / offload SSL, and why not the other?
Back: L7 — it works at the application layer, so it can decrypt, inspect, and re-encrypt traffic.<br>L4 just forwards transport-layer packets and normally passes encrypted traffic through untouched.
<!--ID: 1782144297900-->
END
```

```dataviewjs
function renderCards() {
  const rendered = this.container.closest('.markdown-rendered');
  if (!rendered) return;
  const block = rendered.querySelector('code.language-anki');
  if (!block) return;
  const raw = block.innerText;
  const cards = [...raw.matchAll(/START\r?\nBasic\r?\n([\s\S]*?)(?=\r?\nEND)/g)];
  if (!cards.length) return;
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const wrap = dv.el('div', '', {cls: 'anki-cards-container'});
  block.closest('pre').replaceWith(wrap);
  cards.forEach(m => {
    const content = m[1];
    const bi = content.indexOf('\nBack:');
    if (bi === -1) return;
    const front = esc(content.slice(0, bi).trim());
    const back = esc(content.slice(bi + 6).replace(/\n<!--ID:.*?-->/g, '').trim());
    wrap.innerHTML += '<div class="anki-card">'
      + '<div class="anki-card-front">'
      + '<span class="anki-label anki-label-q">QUESTION</span>'
      + '<div class="anki-front-text">' + front + '</div>'
      + '</div>'
      + '<div class="anki-card-back">'
      + '<span class="anki-label anki-label-a">* ANSWER</span>'
      + '<div class="anki-back-text">' + back + '</div>'
      + '</div>'
      + '</div>';
  });
}

renderCards.call(this);
setTimeout(() => renderCards.call(this), 100);
setTimeout(() => renderCards.call(this), 500);
```
