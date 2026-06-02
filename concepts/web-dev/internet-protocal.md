---
tags: [web-dev, networking]
category: web-dev
related: [tls(transport layer security), http-requests]
---

## Description
The Internet Protocol (IP) is responsible for addressing and routing packets across networks. Every device gets an IP address. IPv4 uses 32-bit addresses (e.g., 192.168.1.1), IPv6 uses 128-bit addresses. IP is connectionless and unreliable on its own. TCP/UDP sit on top to add reliability or speed.
## Examples
```
You type google.com in the browser:

1. DNS resolves google.com -> 142.250.80.46 (IP address)
2. Your machine breaks data into packets
3. IP routes each packet through routers to that address
4. TCP reassembles packets in order at the destination

IPv4: 192.168.1.1      (32-bit, about 4 billion addresses, running out)
IPv6: 2001:0db8::1     (128-bit, basically unlimited)
```

## Related Topics
- [[udp-tcp|TCP/UDP]]
- [[internet-protocal|DNS]]
- [[tls(transport layer security)|TLS]]
- [[http-requests|HTTP]]
- [[internet-protocal|Subnetting]]
- [[internet-protocal|NAT]]

## Cards

```anki
START
Basic
What does IP (Internet Protocol) do?
Back: Addresses and routes packets between devices. IPv4: 32-bit (running out). IPv6: 128-bit (unlimited). IP alone is unreliable - no delivery guarantee, no ordering. TCP adds reliability on top; UDP trades reliability for speed.
<!--ID: 1773439959125-->
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
