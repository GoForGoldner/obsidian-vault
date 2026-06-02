---
tags: [architecture, comparison]
category: vs
related: [cookies-vs-sessions, jwt-tokens, horizontal-vs-vertical-scaling]
---

## Description
Stateless means each request contains all the info needed to process it. the server doesn't remember previous requests. Stateful means the server keeps track of client state between requests (sessions, connections). Stateless is easier to scale because any server can handle any request.
## Examples
```java
// Stateless - each request is self-contained
@GetMapping("/orders")
public List<Order> getOrders(@RequestHeader("Authorization") String jwt) {
    User user = jwtService.verify(jwt); // any server can handle this
    return orderRepo.findByUser(user);
}

// Stateful - server remembers the session
@GetMapping("/orders")
public List<Order> getOrders(HttpSession session) {
    User user = (User) session.getAttribute("user"); // tied to this server
    return orderRepo.findByUser(user);
}
```

## Related Topics
- [[rest-vs-graphql|REST]]
- [[jwt-tokens|JWT Tokens]]
- [[cookies-vs-sessions|Sessions]]
- [[horizontal-vs-vertical-scaling|Horizontal Scaling]]
- [[load-balancing|Load Balancing]]

## Cards

```anki
START
Basic
When do you prefer stateless vs stateful?
Back: Stateless for horizontal scaling - any server handles any request (REST + JWT). Stateful when you need persistent connections (WebSockets) or server-side state (sessions). Stateless scales easily because no session affinity needed.
<!--ID: 1773439958959-->
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
