---
tags: [aws, saa-c03, networking, hybrid, domain-3, domain-4]
category: aws
related: [aws-vpc, aws-route-53, aws-storage-services, aws-migration-transfer]
---
TARGET DECK: Study::AWS::Networking

## Description
Four ways to connect something outside AWS to a VPC, and the exam distinguishes them almost entirely by **latency consistency, bandwidth, encryption, and setup time**.

**Site-to-Site VPN** — IPsec tunnel over the public internet. Encrypted by default, up to ~1.25 Gbps per tunnel, set up in **minutes**. But it rides the public internet, so latency is variable. This is the answer whenever the question stresses "quickly," "temporary," or "low cost."

**AWS Direct Connect (DX)** — a dedicated private fibre circuit from your datacenter to an AWS Direct Connect location. Consistent low latency, 1/10/100 Gbps, and **cheaper per-GB data transfer out**. The catch the exam always tests: **provisioning takes weeks to months**, and it is **not encrypted by default** (it's private, not encrypted). If a question wants DX *and* encryption, the answer is **Direct Connect + VPN on top (IPsec over DX)**.

The classic combo answer: **DX as primary, Site-to-Site VPN as backup** — resilient hybrid connectivity without paying for a second circuit.

**AWS Client VPN** — OpenVPN-based, for *individual remote users* (laptops) rather than whole sites.

**AWS PrivateLink / Interface endpoints** — exposes a service privately, without VPC peering, without exposing anything to the internet. The answer when a SaaS provider or another account must reach one service in your VPC and you don't want to join networks.

Also frequently confused, and both edge services:
- **CloudFront** — caching CDN. Best for *static/cacheable* content, HTTP/HTTPS only.
- **Global Accelerator** — anycast static IPs routing over the AWS backbone. No caching. Best for *non-HTTP* protocols (TCP/UDP, gaming, IoT), fast regional failover, and when you need **static IPs** in front of an ALB/NLB.

## Examples
```
Choosing hybrid connectivity:

"Set it up this week / temporary / cheap"        → Site-to-Site VPN
"Consistent latency, large sustained transfer"   → Direct Connect
"Consistent latency AND encrypted in transit"    → Direct Connect + VPN over it
"Highly available hybrid link"                   → Direct Connect + VPN backup
                                                   (or 2 DX at separate locations)
"Individual employees' laptops"                  → Client VPN
"One service reachable across accounts privately"→ PrivateLink
```

```
On-prem DC ══ DX (private fibre, weeks to provision, unencrypted) ══╗
           ╚═ VPN (internet, IPsec, minutes to set up) ═════════════╬══► VPC
                                                     backup path   ╝
```

CloudFront vs Global Accelerator:
```
                CloudFront              Global Accelerator
Caches?         Yes                     No
Protocols       HTTP/HTTPS only         TCP + UDP (any)
Static IPs?     No (use alias)          Yes — 2 anycast IPs
Best for        Static assets, video    Gaming, VoIP, IoT, fast failover,
                dynamic w/ origin       IP allow-listing by clients
```

## Related Topics
- IPsec and VPN tunnels
- Anycast routing
- CDN and edge caching
- Data transfer pricing
- Hybrid cloud architecture

## Cards

```anki
START
Basic
Hybrid Connectivity: A company needs a hybrid link "as soon as possible" for a project starting next week. DX or VPN?
Back: Site-to-Site VPN. Direct Connect takes weeks-to-months to provision — any question emphasizing speed of setup rules it out.
<!--ID: 1788139020480-->
Tags: cantrill::containers-ecs
END

START
Basic
Hybrid Connectivity: Direct Connect is described as "private." Is the traffic encrypted?
Back: No. Private ≠ encrypted. If the requirement says encryption in transit, the answer is Direct Connect WITH a VPN (IPsec) running over it.
<!--ID: 1788139020487-->
Tags: cantrill::security-ops
END

START
Basic
Hybrid Connectivity: What's the standard answer for resilient hybrid connectivity without paying for two fibre circuits?
Back: Direct Connect as primary, Site-to-Site VPN as the backup path. Cheap failover for the rare DX outage.
<!--ID: 1788139020494-->
Tags: cantrill::network-storage
END

START
Basic
Hybrid Connectivity: Beyond latency, what cost advantage does Direct Connect have?
Back: Lower per-GB data transfer OUT than internet egress. For sustained large transfers, DX can pay for itself — a cost-optimization answer, not just a performance one.
<!--ID: 1788139020501-->
Tags: cantrill::hybrid-migration
END

START
Basic
Hybrid Connectivity: Clients need to allow-list your application's IP addresses in their firewall, and it sits behind an ALB. What do you put in front?
Back: AWS Global Accelerator — it provides 2 static anycast IPs. ALBs only give you a changing DNS name.
<!--ID: 1788139020508-->
Tags: cantrill::cdn-optimization
END

START
Basic
Hybrid Connectivity: The workload is a UDP-based multiplayer game needing low global latency. CloudFront or Global Accelerator?
Back: Global Accelerator. CloudFront is HTTP/HTTPS only and caching-oriented; GA handles any TCP/UDP traffic over the AWS backbone.
<!--ID: 1788139020515-->
Tags: cantrill::cdn-optimization
END

START
Basic
Hybrid Connectivity: A SaaS vendor must reach one internal service in your VPC. You don't want to peer networks or expose anything publicly. What?
Back: AWS PrivateLink — exposes that single service via an interface endpoint. No route tables joined, no CIDR overlap concerns, no internet exposure.
<!--ID: 1788139020522-->
Tags: cantrill::advanced-vpc
END

START
Basic
Hybrid Connectivity: When is Client VPN the answer rather than Site-to-Site VPN?
Back: When individual remote users/laptops need access, not a whole office network. Site-to-Site connects networks; Client VPN connects people.
<!--ID: 1788139020529-->
Tags: cantrill::hybrid-migration
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
