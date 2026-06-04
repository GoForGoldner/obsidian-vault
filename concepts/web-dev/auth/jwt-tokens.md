---
tags:
  - web-dev
  - auth
  - http
category:
related: []
---
## Description
A signed token (Header.Payload.Signature) used for stateless authentication. The server signs it with a secret key; the client sends it in the Authorization: Bearer header on every request. The server verifies the signature without a database lookup, making it ideal for distributed/stateless APIs.

## Examples
```java
// 1. Login → server returns JWT
@PostMapping("/login")
public String login(String user, String pass) {
    if (authService.verify(user, pass)) {
        return Jwts.builder()
            .setSubject(user)
            .setExpiration(Date.from(Instant.now().plusSeconds(3600)))
            .signWith(secretKey)
            .compact();  // "eyJhbGciOi..."
    }
}

// 2. Client sends: Authorization: Bearer eyJhbGciOi...

// 3. Server verifies - no DB lookup needed
Claims claims = Jwts.parser()
    .setSigningKey(secretKey)
    .parseClaimsJws(token)
    .getBody();
String user = claims.getSubject(); // trusted if signature checks out
```

## Related Topics

- [[jwt-tokens|OAuth2]]
- [[http-requests|HTTP Headers]]
- Session-based auth (contrast)
- [[jwt-tokens|Refresh tokens]]
- ASP.NET Identity
- Middleware / Auth pipelines

## Cards
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
