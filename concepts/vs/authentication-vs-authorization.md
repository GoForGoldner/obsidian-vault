---
tags: [security, comparison]
category: vs
related: [jwt-tokens, rate-limiting]
---

## Description
Authentication is verifying WHO you are (login, credentials, identity). Authorization is verifying WHAT you can do (permissions, roles, access control). Authentication comes first, then authorization.
## Examples
```java
// Authentication - WHO are you?
@PostMapping("/login")
public Token login(String username, String password) {
    User user = authService.verify(username, password); // identity check
    return jwtService.generateToken(user);
}

// Authorization - WHAT can you do?
@GetMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")  // permission check
public List<User> getAllUsers() { ... }
```

## Related Topics
- [[jwt-tokens|JWT Tokens]]
- [[jwt-tokens|OAuth2]]
- [[authentication-vs-authorization|RBAC]]
- [[chain-of-responsibility-pattern|Middleware]]

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
