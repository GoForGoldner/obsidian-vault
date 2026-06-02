---
tags: [web-dev, api, comparison]
category: vs
related: [gRPC, http-requests]
---

## Description
REST uses multiple endpoints (one per resource) with fixed response shapes. GraphQL uses a single endpoint where the client specifies exactly what data it wants. REST is simpler and well-cached; GraphQL avoids over/under-fetching but is more complex to implement.
## Examples
REST:
```
GET /users/1          → { id: 1, name: "Alice", email: "...", bio: "..." }
GET /users/1/posts    → [{ title: "..." }, ...]
// Two requests, might get fields you don't need
```

GraphQL:
```graphql
query {
  user(id: 1) {
    name
    posts { title }
  }
}
// One request, only the fields you asked for
```

## Related Topics
- [[gRPC|gRPC]]
- [[http-requests|HTTP Requests]]
- [[caching-stradegies|Caching]]
- [[rest-vs-graphql|API Design]]

## Cards

```anki
START
Basic
When do you use REST vs GraphQL?
Back: REST for simple CRUD, HTTP caching matters, simpler implementation. GraphQL when clients need flexible queries and you want to avoid over/under-fetching. GraphQL downside: no built-in caching, potential N+1 queries, more complex server.
<!--ID: 1773439958925-->
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
