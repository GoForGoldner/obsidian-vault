---
tags: [web-dev, auth, comparison]
category: vs
related: [jwt-tokens, stateful-vs-stateless]
---

## Description
Cookies are small pieces of data stored on the client's browser and sent with every request. Sessions are server-side storage linked to a client via a session ID (usually stored in a cookie). Cookies are visible to the client; session data is hidden on the server.
## Examples
```java
// Server creates session, sends session ID as a cookie
HttpSession session = request.getSession();
session.setAttribute("user", authenticatedUser); // stored on server

// Response header:
// Set-Cookie: JSESSIONID=abc123; HttpOnly; Secure

// Every subsequent request sends the cookie automatically
// Server looks up session by JSESSIONID to get user data
```

## Related Topics
- [[jwt-tokens|JWT Tokens]]
- [[stateful-vs-stateless|Stateful vs Stateless]]
- [[authentication-vs-authorization|Authentication]]
- [[cors|CORS]]

## Cards

```anki
START
Basic
What's the difference between cookies and sessions?
Back: Cookies = client-side storage sent with every request (visible, stealable). Sessions = server-side storage, client only has a session ID cookie. Session data is hidden but hard to scale (needs sticky sessions or shared store like Redis).
<!--ID: 1773439958851-->
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
