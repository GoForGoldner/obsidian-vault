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
What is load balancing and when would you pick Least Connections over Round Robin?
Back: Distributing requests across servers. Round Robin when servers are identical and requests are uniform. Least Connections when request processing times vary widely (long-running vs quick requests) — prevents one server from getting overloaded. IP Hash for session affinity. Health checks auto-remove failed servers.
<!--ID: 1773439958554-->
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
