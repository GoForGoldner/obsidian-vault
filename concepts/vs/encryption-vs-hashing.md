---
tags: [security, comparison]
category: vs
related: [tls(transport layer security), jwt-tokens]
---

## Description
Encryption is reversible. you can decrypt data back to the original with a key. Hashing is one-way. you can't get the original data back from a hash. Encryption protects data in transit/storage. Hashing verifies data integrity and stores passwords safely.
## Examples
```java
// Encryption - reversible (need data back)
String encrypted = AES.encrypt("secret message", key);
String original  = AES.decrypt(encrypted, key); // "secret message"

// Hashing - one-way (never need original back)
String hash = BCrypt.hashpw("password123", BCrypt.gensalt());
// hash = "$2a$10$N9qo8uLOi..." - can't reverse this

// Verify password: hash the input and compare
BCrypt.checkpw("password123", hash); // true
BCrypt.checkpw("wrongpass", hash);   // false
```

## Related Topics
- [[tls(transport layer security)|TLS]]
- [[jwt-tokens|JWT Tokens]]
- [[authentication-vs-authorization|Authentication]]
- [[encryption-vs-hashing|bcrypt]]
- [[encryption-vs-hashing|AES]]
- [[encryption-vs-hashing|RSA]]

## Cards

```anki
START
Basic
When do you use encryption vs hashing?
Back: Encryption is reversible (need data back - messages, files). Hashing is one-way (never need original - passwords, integrity checks). Passwords must be hashed with slow+salted algorithms (bcrypt/argon2), never encrypted.
<!--ID: 1773439958865-->
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
