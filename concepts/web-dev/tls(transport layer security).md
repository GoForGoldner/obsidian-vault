---
tags: [web-dev, security, networking]
category: web-dev
related: [encryption-vs-hashing, internet-protocal]
---

## Description
A communication protocol in the transport layer that ensures authentication, integrity, and encryption. Authentication: a CA (Certificate Authority) chain verifies the server's identity. Integrity: uses HMAC to verify messages haven't been modified. Encryption: both parties exchange keys and encrypt all traffic so eavesdroppers can't read it.
## Examples
```
Browser connects to https://github.com:

1. ClientHello: browser sends supported cipher suites
2. ServerHello: server sends back chosen cipher + its certificate
3. Browser checks the certificate chain:
   github.com cert -> signed by DigiCert -> DigiCert is trusted by browser
4. Key exchange: both sides derive a shared session key
5. All traffic from here on is encrypted with that key

Without TLS: anyone on the network can read your packets
With TLS: encrypted, tamper-proof, server identity verified
```

## Related Topics
- [[encryption-vs-hashing|Encryption vs Hashing]]
- [[tls(transport layer security)|HTTPS]]
- [[tls(transport layer security)|Certificate Authority]]
- [[internet-protocal|Internet Protocol]]
- [[tls(transport layer security)|Public Key Cryptography]]

## Cards

```anki
START
Basic
What does TLS provide?
Back: Authentication (server identity via CA certificate chain), Integrity (HMAC verifies messages aren't tampered), Encryption (shared keys encrypt all traffic). TLS handshake: client hello -> server cert -> verify -> derive shared keys -> encrypted channel.
<!--ID: 1773439959146-->
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
