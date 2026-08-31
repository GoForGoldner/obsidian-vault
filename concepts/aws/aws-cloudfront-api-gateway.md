---
tags: [aws, saa-c03, networking, edge, performance, domain-1, domain-3]
category: aws
related: [aws-s3, aws-security-services, aws-hybrid-connectivity, aws-serverless-containers, cdn]
---
TARGET DECK: Study::AWS::Networking

## Description
**Amazon CloudFront** is AWS's CDN: 400+ edge locations caching content close to users. Origins can be S3, an ALB, an EC2 instance, API Gateway, or **any custom HTTP origin including on-premises**. Benefits stack up in three directions the exam tests separately:
- **Performance** — cached content served from the edge; even uncached ("dynamic") requests benefit by traversing the AWS backbone instead of the public internet.
- **Cost** — CloudFront egress is cheaper than direct S3/EC2 egress, and S3→CloudFront transfer is free.
- **Security** — it's the attachment point for **AWS WAF** and **Shield**, terminates TLS with ACM (**certificate must be in `us-east-1`**), and via **Origin Access Control (OAC)** lets an S3 bucket stay fully private.

Key controls: **TTL** and cache behaviours per path pattern; **invalidations** to purge cached objects early (or better, **versioned object names**); **signed URLs** (one file) and **signed cookies** (multiple files) for **private/paid content distribution**; **geo restriction** to allow/block countries; **field-level encryption**; and **Lambda@Edge / CloudFront Functions** for running code at the edge (header manipulation, A/B tests, auth checks).

CloudFront vs **Global Accelerator**: CloudFront **caches** and is **HTTP/HTTPS only**; Global Accelerator does **not cache**, handles **any TCP/UDP**, and gives **static anycast IPs**.

**Amazon API Gateway** — managed front door for APIs. Handles **authentication** (IAM, Cognito, Lambda authorizers), **throttling and rate limiting**, **usage plans and API keys**, request/response **transformation**, **caching**, and **stages** (dev/prod). Types: **REST** (full features), **HTTP API** (cheaper, faster, fewer features), **WebSocket** (bidirectional).

The recurring architecture: **CloudFront → API Gateway → Lambda → DynamoDB** is the canonical fully-serverless, auto-scaling, pay-per-use web stack, and it appears constantly as the right answer to "no servers to manage, scales to zero, handles unpredictable traffic."

For protecting an origin: put **WAF on CloudFront**, keep the ALB/S3 private, and the exam's "how do we stop users bypassing CloudFront and hitting the origin directly" answer is **OAC for S3**, or a **custom header + WAF rule / security group restricted to CloudFront's prefix list** for an ALB.

## Examples
```
CloudFront answers by requirement word:

"global users, static assets, slow"        → CloudFront (caching)
"reduce S3 egress cost"                    → CloudFront
"bucket must stay private"                 → CloudFront + OAC
"block SQL injection"                      → WAF on CloudFront
"only paying subscribers may download"     → Signed URLs / signed cookies
"not available in certain countries"       → Geo restriction
"run auth logic at the edge"               → Lambda@Edge / CloudFront Functions
"UDP game traffic, static IPs"             → Global Accelerator, NOT CloudFront
```

```
The canonical serverless web stack:

  Users
    │
  CloudFront  ── WAF, TLS (ACM in us-east-1), edge cache
    │
  API Gateway ── auth (Cognito), throttling, usage plans
    │
  Lambda      ── business logic, 15-min ceiling, scales to zero
    │
  DynamoDB    ── single-digit ms, on-demand capacity
    │
  (S3 for static assets, served via the same distribution)

No servers, no patching, no idle cost, scales automatically.
```

```
Stopping origin bypass:

S3 origin   → Origin Access Control + Block Public Access
ALB origin  → CloudFront adds a secret custom header;
              WAF rule on the ALB drops requests lacking it
              (and/or SG restricted to the CloudFront managed prefix list)
```

## Related Topics
- CDN and edge caching
- Cache invalidation and TTL
- API rate limiting and throttling
- TLS termination
- Serverless architecture

## Cards

```anki
START
Basic
CloudFront: You want CloudFront in front of S3 but the bucket must never be publicly accessible. What connects them?
Back: Origin Access Control (OAC) — CloudFront gets a bucket-policy grant while Block Public Access stays on. OAI is the legacy version of the same idea.
<!--ID: 1788139020065-->
END

START
Basic
CloudFront: Only paying subscribers should be able to download a set of videos. What feature?
Back: Signed cookies (multiple files) or signed URLs (a single file). Both grant time-limited access without making the content public.
<!--ID: 1788139020071-->
END

START
Basic
CloudFront: What's the Region requirement for its TLS certificate?
Back: The ACM certificate must live in us-east-1, regardless of where the origin or the rest of the stack is deployed.
<!--ID: 1788139020079-->
END

START
Basic
CloudFront: You deployed new static assets but users still see the old ones. Two fixes?
Back: Create an invalidation to purge the cached objects, or (better, and free) use versioned filenames so the URL itself changes.
<!--ID: 1788139020086-->
END

START
Basic
CloudFront: Does CloudFront help a fully dynamic, uncacheable API?
Back: Yes — requests still ride the AWS backbone from the edge instead of the public internet, cutting latency. And it's where you attach WAF and Shield.
<!--ID: 1788139020093-->
END

START
Basic
API Gateway: How do you stop one customer from overwhelming your API?
Back: Throttling with usage plans and API keys — per-client rate and burst limits, plus account-level throttling.
<!--ID: 1788139020100-->
END

START
Basic
API Gateway: When is HTTP API the right choice over REST API?
Back: When you want lower cost and latency and don't need REST API's extras (request/response transformation, API keys/usage plans, WAF integration, private endpoints).
<!--ID: 1788139020107-->
END

START
Basic
CloudFront: How do you prevent users from bypassing CloudFront and hitting the ALB directly?
Back: Have CloudFront inject a secret custom header and configure WAF on the ALB to drop requests without it — optionally also restricting the ALB security group to CloudFront's managed prefix list.
<!--ID: 1788139020114-->
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
