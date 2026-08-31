---
tags: [aws, saa-c03, networking, dns, resiliency, domain-2, domain-3]
category: aws
related: [aws-elastic-load-balancing, aws-hybrid-connectivity, aws-disaster-recovery, aws-global-infrastructure]
---
TARGET DECK: Study::AWS::Networking

## Description
Route 53 is AWS's global DNS service — registrar, authoritative DNS, and **health checking**. On the exam it appears almost entirely as a **routing-policy identification** question: the scenario describes a goal, you name the policy.

The seven routing policies:
- **Simple** — one record, no health checks. The baseline.
- **Weighted** — split traffic by percentage. The answer for **canary / blue-green / A-B testing** ("send 10% to the new version").
- **Latency-based** — send users to the Region with the **lowest measured latency**. The answer for "best performance for a global user base."
- **Failover** — active/passive. Primary record plus a health check; on failure, traffic goes to the secondary. The answer for **DR**.
- **Geolocation** — route by the *user's physical location*. The answer for **compliance, data residency, language/content localization** ("EU users must hit the EU Region").
- **Geoproximity** — route by location but with a **bias** you can shift to send more or less traffic to a Region. Requires Traffic Flow.
- **Multivalue answer** — returns up to 8 healthy records at random. Health-checked, but it is **not a load balancer** — it's poor-man's client-side spreading.

The trap: **latency-based ≠ geolocation.** Latency is about *speed*; geolocation is about *where the user is*, used for legal/compliance reasons. Read what the question is optimizing.

**Alias vs CNAME** is the other guaranteed question. An **Alias** record is AWS-specific, **free**, and — critically — **can be created at the zone apex** (`example.com`). A **CNAME cannot exist at the zone apex** and costs per query. So pointing `example.com` at an ALB, CloudFront, or S3 website endpoint **must** be an Alias.

## Examples
```
Scenario → policy:

"Route 10% of users to the new version to test it"   → Weighted
"Users worldwide should get the fastest response"    → Latency-based
"German users' data must be served from eu-central-1"→ Geolocation  (legal, not speed)
"If us-east-1 fails, send everything to eu-west-1"   → Failover (+ health check)
"Shift 30% more traffic toward the Tokyo Region"     → Geoproximity (bias)
"Return several healthy IPs so clients can retry"    → Multivalue answer
```

```
Alias vs CNAME:

example.com          → ALB          MUST be Alias (apex; CNAME is illegal here)
www.example.com      → ALB          Alias or CNAME both work — Alias is free
app.example.com      → ec2-1-2-3-4  CNAME fine (or an A record)

Alias targets: ALB/NLB, CloudFront, S3 website endpoint, API Gateway,
               Global Accelerator, another Route 53 record.
               NOT an EC2 instance's DNS name.
```

A DR pattern combining several pieces:
```
Route 53 Failover policy
 ├── PRIMARY   → ALB in us-east-1   ← health check (HTTP /health, 3 failures = unhealthy)
 └── SECONDARY → ALB in eu-west-1   (warm standby)
Set a low TTL (60s) on these records, or clients cache the dead endpoint.
```

## Related Topics
- DNS resolution and TTL
- Health checks and failover
- Blue-green and canary deployments
- Data residency requirements
- Anycast and edge routing

## Cards

```anki
START
Basic
Route 53: "EU customers' data must be served from an EU Region for GDPR." Latency-based or Geolocation?
Back: Geolocation — the requirement is legal/where-the-user-is, not speed. Latency-based optimizes response time and could route an EU user to the US.
<!--ID: 1788139020967-->
END

START
Basic
Route 53: Why can't you use a CNAME for example.com pointing at an ALB?
Back: DNS forbids a CNAME at the zone apex. Use an Alias record — AWS-specific, free, and legal at the apex.
<!--ID: 1788139020974-->
END

START
Basic
Route 53: You want to send 5% of production traffic to a new stack to validate it. Which policy?
Back: Weighted routing — assign weights 95/5. This is the canary/blue-green answer.
<!--ID: 1788139020981-->
END

START
Basic
Route 53: What makes Failover routing actually work, and what's easy to forget?
Back: An associated health check on the primary. And a low TTL (~60s) — otherwise resolvers keep serving the cached dead endpoint long after failover.
<!--ID: 1788139020985-->
END

START
Basic
Route 53: Is Multivalue answer routing a load balancer?
Back: No. It returns up to 8 healthy records at random for client-side spreading. It has health checks but none of an ELB's algorithms, connection draining, or TLS termination.
<!--ID: 1788139020989-->
END

START
Basic
Route 53: When is Geoproximity the answer over plain Geolocation?
Back: When you need to deliberately shift traffic volume toward or away from a Region using a bias value — e.g. gradually shifting load during a migration.
<!--ID: 1788139020995-->
END

START
Basic
Route 53: Two reasons to prefer Alias over CNAME even where both are legal?
Back: Alias queries to AWS targets are free, and Alias automatically tracks the target's changing IPs. CNAME is billed per query.
<!--ID: 1788139021002-->
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
