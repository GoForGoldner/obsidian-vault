---
tags: [aws, saa-c03, networking, resiliency, domain-2, domain-3]
category: aws
related: [aws-ec2-autoscaling, aws-vpc, aws-route-53, load-balancing]
---
TARGET DECK: Study::AWS::Networking

## Description
Elastic Load Balancing distributes traffic across targets in **multiple AZs**. Three types, and the exam distinguishes them by **OSI layer** first:

**Application Load Balancer (ALB) — Layer 7 (HTTP/HTTPS).** Understands requests, so it can do **content-based routing**: by path (`/api/*`), host header, HTTP header, query string, or source IP. Targets can be EC2, IP addresses, **Lambda**, and containers. Supports WebSockets and HTTP/2. This is the default answer for any web application, microservices, or container workload.

**Network Load Balancer (NLB) — Layer 4 (TCP/UDP/TLS).** Extreme performance (millions of requests/sec), **ultra-low latency**, and — the giveaway — a **static IP per AZ** (and Elastic IP support). Preserves the client source IP. The answer when you see: non-HTTP protocols, static IP requirement, extreme throughput, or IP allow-listing.

**Gateway Load Balancer (GWLB) — Layer 3.** Deploys and scales third-party **virtual network appliances** (firewalls, IDS/IPS, deep packet inspection) transparently. If a question mentions inserting third-party security appliances into the traffic path, it's GWLB.

Shared behaviours worth knowing:
- **Health checks** decide which targets receive traffic. An unhealthy target is removed, not terminated (that's Auto Scaling's job).
- **Cross-zone load balancing**: spreads evenly across *all* targets in all AZs. **On by default for ALB** (free), **off by default for NLB** (and incurs cross-AZ data charges).
- **Sticky sessions** (session affinity) pin a user to one target via a cookie. Useful for stateful apps — but the better architectural answer is usually to **externalize session state** to ElastiCache or DynamoDB so the app becomes stateless.
- **Connection draining / deregistration delay** lets in-flight requests finish before a target is removed.
- SSL/TLS termination uses certificates from **ACM**; **SNI** allows multiple certificates on one listener.

An ELB requires **at least two subnets in two different AZs**.

## Examples
```
Layer 7 routing on one ALB:

  example.com/api/*     → target group: API service    (ECS tasks)
  example.com/images/*  → target group: image service
  example.com/*         → target group: web servers
  admin.example.com     → target group: admin          (host-based)
  /health               → Lambda target                (yes, Lambda works)
```

```
Choosing:

HTTP/HTTPS web app, microservices, containers   → ALB
Path/host-based routing needed                  → ALB (only one that can)
Static IP or Elastic IP required                → NLB
UDP, MQTT, or raw TCP                           → NLB
Millions of req/sec, lowest latency             → NLB
Preserve client source IP without X-Forwarded-For → NLB
Insert a third-party firewall/IDS appliance     → GWLB
```

Stickiness vs stateless — what the exam prefers:
```
Problem: user's shopping cart lives in server memory; ASG scales in and loses it.

Quick fix:   ALB sticky sessions (cookie pins user to one target)
Better fix:  move session state to ElastiCache (Redis) or DynamoDB
             → app becomes stateless → any target serves any request
             → scaling and instance failure stop being a problem

The exam usually rewards the stateless answer.
```

## Related Topics
- OSI model layers 3, 4, 7
- Load balancing algorithms
- Session state and stateless design
- TLS termination and SNI
- Health checks and connection draining

## Cards

```anki
START
Basic
ELB: The requirement is "route /api requests to one fleet and /images to another." Which load balancer, and why is it the only option?
Back: ALB. Content-based routing (path, host, header, query string) requires Layer 7 — NLB operates at Layer 4 and cannot see the HTTP request.
<!--ID: 1788139020368-->
Tags: cantrill::ha-scaling
END

START
Basic
ELB: A client's corporate firewall must allow-list your load balancer's IP. ALB or NLB?
Back: NLB — it provides a static IP per AZ and supports Elastic IPs. An ALB only gives a DNS name whose IPs change.
<!--ID: 1788139020373-->
Tags: cantrill::ha-scaling
END

START
Basic
ELB: The application uses UDP for IoT telemetry. Which load balancer?
Back: NLB. It's the only one handling UDP; ALB is HTTP/HTTPS only.
<!--ID: 1788139020378-->
Tags: cantrill::ha-scaling
END

START
Basic
ELB: You need to run a third-party firewall appliance inline for traffic inspection. Which ELB?
Back: Gateway Load Balancer — it deploys, scales, and health-checks third-party virtual appliances transparently at Layer 3.
<!--ID: 1788139020383-->
Tags: cantrill::ha-scaling
END

START
Basic
ELB: Users get logged out when Auto Scaling adds instances. What's the quick fix and what's the better fix?
Back: Quick: enable ALB sticky sessions. Better: externalize session state to ElastiCache or DynamoDB so the app is stateless.
The exam usually wants stateless.
<!--ID: 1788139020390-->
Tags: cantrill::ha-scaling
END

START
Basic
ELB: Which ELB has cross-zone load balancing OFF by default, and what does that cost you?
Back: NLB (ALB has it on and free). With it off, an AZ holding fewer targets sends each of them more traffic; turning it on adds cross-AZ data transfer charges.
<!--ID: 1788139020397-->
Tags: cantrill::ha-scaling
END

START
Basic
ELB: A target fails its health check. Does the load balancer terminate it?
Back: No — it only stops sending traffic. Terminating and replacing is Auto Scaling's job, and only if the ASG uses ELB health checks rather than EC2 status checks.
<!--ID: 1788139020404-->
Tags: cantrill::ha-scaling
END

START
Basic
ELB: What's the minimum subnet requirement for any ELB, and why?
Back: At least two subnets in two different AZs. The load balancer itself must be highly available, so it cannot live in a single AZ.
<!--ID: 1788139020412-->
Tags: cantrill::ha-scaling
END

START
Basic
ELB: How do you host several HTTPS domains with different certificates behind one ALB listener?
Back: SNI (Server Name Indication) — attach multiple ACM certificates to the listener and the ALB picks by hostname.
<!--ID: 1788139020419-->
Tags: cantrill::security-ops
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
