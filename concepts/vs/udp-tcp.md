---
tags: [networking, comparison]
category: vs
related: [internet-protocal, tls(transport layer security)]
---

## Description
TCP is reliable. guarantees delivery, ordering, and error checking via a connection. UDP is unreliable but fast. no connection, no guaranteed delivery, no ordering. TCP for accuracy, UDP for speed.
## Examples
```
TCP (reliable, ordered):
  Client --SYN--> Server       3-way handshake first
  Client <--SYN+ACK-- Server
  Client --ACK--> Server
  Client --DATA--> Server      guaranteed delivery, retransmit on loss
  Used for: HTTP, file transfers, emails

UDP (fast, no guarantees):
  Client --DATA--> Server      just fire and forget, no handshake
  Used for: video streaming, gaming, VoIP, DNS
```

## Related Topics
- [[internet-protocal|Internet Protocol]]
- [[tls(transport layer security)|TLS]]
- [[http-requests|HTTP]]
- [[udp-tcp|WebSockets]]

## Cards

```anki
START
Basic
When do you use TCP vs UDP?
Back: TCP for reliable, ordered delivery (web pages, files, APIs). UDP for speed over reliability (live video, gaming, VoIP, DNS). UDP is faster because no handshake, no acks, no retransmission.
<!--ID: 1773439958985-->
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
