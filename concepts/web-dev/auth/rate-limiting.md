---
tags: [web-dev, auth, security]
category: web-dev
related: [jwt-tokens, load-balancing]
---

## Description
Limiting how many requests a client can make in a given time window. Common strategies: fixed window (100 requests per minute), sliding window, and token bucket.

## Benefits
- Protects from DDoS and brute force attacks
- Prevents runaway scripts from overwhelming your API
- Fair usage across clients

## Downsides
- Can block legitimate users during traffic spikes
- Distributed rate limiting across multiple servers is complex
- Choosing the right limits requires tuning


## Examples
```java
// Simple fixed-window rate limiter
Map<String, Integer> requestCounts = new ConcurrentHashMap<>();

boolean allowRequest(String clientIp) {
    int count = requestCounts.getOrDefault(clientIp, 0);
    if (count >= 5) return false;  // 5 requests per window
    requestCounts.put(clientIp, count + 1);
    return true;
}

// Returns 429 when limit exceeded
if (!rateLimiter.allowRequest(ip)) {
    response.setStatus(429); // Too Many Requests
    response.setHeader("Retry-After", "60");
}
```

## Related Topics
- [[jwt-tokens|JWT Tokens]]
- [[load-balancing|Load Balancing]]
- [[rate-limiting|DDoS Protection]]
- [[rate-limiting|API Gateway]]
- [[caching-stradegies|Redis]]

## Cards

```anki
START
Basic
What is rate limiting?
Back: Limit requests per client per time window. Prevents abuse, brute force, DDoS. Strategies: Fixed Window, Sliding Window, Token Bucket (smoothest). Return 429 Too Many Requests with a Retry-After header.
<!--ID: 1773439959021-->
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
