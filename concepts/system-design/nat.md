---
tags: [system-design, networking, nat]
category: system-design
related: [load-balancing]
---

## Description
NAT (Network Address Translation) remaps private IP addresses to a public IP by rewriting the source/destination IP+port of packets in transit, tracking each flow in a mapping table. Its purpose is **address translation** — letting many private hosts share one public IPv4 address — **not security**. It only incidentally blocks unsolicited inbound connections because there's no mapping entry for them; that's a side effect, not a firewall. NAT also breaks end-to-end IP transparency, which complicates VoIP, gaming, and peer-to-peer (needing port forwarding or traversal techniques like STUN/TURN). Variants: Static NAT (fixed 1:1), Dynamic NAT (a pool), and PAT / NAT overload (port-based, the common home-router case).

## Examples
```
Private LAN                NAT device                 Internet
10.0.0.5:51000  --->  rewrites src to  203.0.113.7:40001  --->  server
10.0.0.6:51000  --->  rewrites src to  203.0.113.7:40002  --->  server

NAT table tracks: (private ip:port) <-> (public ip:port)
Reply comes back to 203.0.113.7:40001 -> translated back to 10.0.0.5:51000
```

## Related Topics
- [[load-balancing]]

## Cards

```anki
START
Basic
What is NAT's actual purpose, and why is it often mistaken for a security feature?
Back: Its job is address translation — remapping private IPs to a shared public IP so many hosts share one public IPv4.<br>It's not security: it only incidentally blocks unsolicited inbound connections because no mapping entry exists for them. That's a side effect, not a firewall.
<!--ID: 1782144297904-->
END

START
Basic
What problem does PAT (Port Address Translation / NAT overload) solve that static NAT doesn't?
Back: PAT lets MANY private hosts share a single public IP by also remapping source PORTS, tracking each connection by IP+port in the NAT table.<br>Static NAT is only a fixed 1:1 IP mapping, so it can't multiplex many hosts onto one address.
<!--ID: 1782144297907-->
END

START
Basic
Why does NAT complicate protocols like VoIP, gaming, and peer-to-peer?
Back: NAT breaks end-to-end IP transparency — internal hosts have no directly reachable public address.<br>So inbound/peer connections fail without port forwarding or NAT-traversal techniques (STUN/TURN/hole punching).
<!--ID: 1782144297910-->
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
