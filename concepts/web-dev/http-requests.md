---
tags: [web-dev, networking]
category: web-dev
related: [rest-vs-graphql, idempotency, cors]
---

## Description
HTTP status codes grouped by category:
1xx: Information
2xx: Success (200 OK, 201 Created, 204 No Content)
3xx: Redirect (301 Moved Permanently, 302 Found)
4xx: Client Error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 429 Too Many Requests)
5xx: Server Error (500 Internal Server Error, 502 Bad Gateway)
## Examples
```
Common status codes:

200 OK              GET /users/1        success, here's your data
201 Created         POST /users         new resource created
204 No Content      DELETE /users/1     success, nothing to return

301 Moved           GET /old-page       permanently redirected
400 Bad Request     POST /users {bad}   invalid input
401 Unauthorized    GET /admin           not authenticated (who are you?)
403 Forbidden       GET /admin           authenticated but no permission
404 Not Found       GET /users/999      doesn't exist
429 Too Many        GET /api/data        rate limited

500 Internal Error  GET /anything        server crashed
```

## Related Topics
- [[rest-vs-graphql|REST vs GraphQL]]
- [[idempotency|Idempotency]]
- [[cors|CORS]]
- [[tls(transport layer security)|TLS]]
- [[rate-limiting|Rate Limiting]]

## Cards

```anki
START
Basic
What's the conceptual difference between 4xx and 5xx errors, and what do 401 vs 403 mean?
Back: 4xx = client's fault (bad input, missing auth). 5xx = server's fault (crash, timeout). 401 Unauthorized = not authenticated (who are you?). 403 Forbidden = authenticated but no permission (you can't do that). Common gotcha: 401 is really "unauthenticated" despite the name.
<!--ID: 1773439959100-->
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
