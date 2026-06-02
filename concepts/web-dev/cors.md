---
tags: [web-dev, security]
category: web-dev
related: [http-requests, cookies-vs-sessions]
---

## Description
Cross-Origin Resource Sharing. A browser security mechanism that blocks web pages from making requests to a different domain than the one that served the page. The server must explicitly allow cross-origin requests by sending CORS headers (Access-Control-Allow-Origin). Without it, your frontend on localhost:3000 can't call your API on localhost:5000.
## Examples
```
Browser (localhost:3000) tries to call API (api.example.com):

1. Browser sends preflight:
   OPTIONS /users
   Origin: http://localhost:3000

2. Server responds:
   Access-Control-Allow-Origin: http://localhost:3000
   Access-Control-Allow-Methods: GET, POST

3. Browser allows the actual request (or blocks if headers are missing)
```

Fix in Spring Boot:
```java
@CrossOrigin(origins = "http://localhost:3000")
@GetMapping("/users")
public List<User> getUsers() { ... }
```

## Related Topics
- [[http-requests|HTTP Requests]]
- [[cors|Browser Security]]
- [[cors|Preflight Requests]]
- [[cors|Same-Origin Policy]]

## Cards

```anki
START
Basic
What is CORS and how do you fix CORS errors?
Back: Cross-Origin Resource Sharing - browser blocks requests to a different domain. Prevents malicious sites using your cookies. Fix on the server: add `Access-Control-Allow-Origin` header. Browser sends a preflight OPTIONS request to check first.
<!--ID: 1773439959054-->
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
