---
tags: [aws, saa-c03, fundamentals, resiliency]
category: aws
related: [aws-iam, aws-vpc, aws-disaster-recovery, aws-route-53]
---
TARGET DECK: Study::AWS::Foundations

## Description
AWS is organized as **Regions** (independent geographic areas, e.g. `us-east-1`) containing **Availability Zones** (AZs — one or more discrete datacenters, isolated power/cooling/networking, connected to each other by low-latency private fibre). Regions are fully isolated from each other: nothing replicates across Regions unless you explicitly configure it. AZs within a Region are close enough for synchronous replication (single-digit ms). Separately, **Edge Locations / Points of Presence** (400+) serve CloudFront, Route 53, and Global Accelerator — they are *not* AZs and run no general compute.

The single most exam-relevant consequence: **AZ redundancy buys you high availability; Region redundancy buys you disaster recovery.** Almost every "resilient architecture" question is really asking which of those two you need, and the answer is usually the cheaper one (Multi-AZ) unless the question names a Region-wide outage or a legal/data-residency requirement.

The **shared responsibility model** splits duties: AWS is responsible for security **OF** the cloud (hardware, the hypervisor, the physical facilities, managed-service infrastructure); you are responsible for security **IN** the cloud (your data, IAM policies, OS patching on EC2, security group rules, encryption choices). The line moves with the service — on EC2 you patch the guest OS, on RDS AWS patches it, on Lambda there is no OS to patch.

Service scope matters for exam distractors. **Global**: IAM, Route 53, CloudFront, WAF (for CloudFront), Organizations. **Regional**: most things — S3, DynamoDB, Lambda, VPC. **Zonal (AZ-scoped)**: EC2 instances, EBS volumes, subnets.

## Examples
```
Region: us-east-1 (N. Virginia)
├── AZ us-east-1a ──┐
├── AZ us-east-1b ──┼── private fibre, <10ms, sync replication OK
└── AZ us-east-1c ──┘        (Multi-AZ RDS lives here)

Region: eu-west-1 (Ireland)        <-- fully isolated
└── async cross-Region replication only, explicit opt-in
        (this is your DR copy)

Edge Locations (400+, worldwide)   <-- CloudFront/Route 53/Global Accelerator
        no EC2, no EBS, caching + DNS + anycast entry only
```

Shared responsibility, moving with the service:

| You manage | EC2 | RDS | Lambda |
|---|---|---|---|
| Guest OS patching | You | AWS | AWS |
| App code | You | n/a | You |
| Data + encryption choice | You | You | You |
| IAM permissions | You | You | You |
| Physical datacenter | AWS | AWS | AWS |

## Related Topics
- Availability Zones vs Regions
- Disaster recovery strategies (RPO/RTO)
- AWS Well-Architected Framework
- Edge computing / CDN
- Data residency and compliance

## Cards

```anki
START
Basic
AWS Global Infrastructure: A question says "must survive the loss of a data center." AZ-redundant or Region-redundant?
Back: Multi-AZ is enough. A data center ≈ an AZ. Reach for multi-Region only when the question names a Region-wide outage or data-residency law — it costs far more.
<!--ID: 1788139020426-->
END

START
Basic
AWS Global Infrastructure: Why can RDS Multi-AZ replicate synchronously but cross-Region replication is always asynchronous?
Back: AZs sit on private fibre within one metro (single-digit ms), so a sync write round-trip is affordable. Regions are continents apart — sync writes would gate every transaction on that latency.
<!--ID: 1788139020434-->
END

START
Basic
AWS Global Infrastructure: Under the shared responsibility model, who patches the OS — and what makes the answer change?
Back: The service model, not the service. EC2 → you patch the guest OS. RDS → AWS patches it. Lambda → no OS exists to patch.
The more managed the service, the more of the stack AWS owns.
<!--ID: 1788139020442-->
END

START
Basic
AWS Global Infrastructure: Which four things stay YOUR responsibility no matter how managed the service is?
Back: Your data, who can access it (IAM), whether it's encrypted, and your network rules (security groups).
AWS never decides those for you.
<!--ID: 1788139020449-->
END

START
Basic
AWS Global Infrastructure: Name the services that are GLOBAL, not Regional — and why it matters on the exam.
Back: IAM, Route 53, CloudFront, Organizations, WAF-for-CloudFront.
Distractors often ask you to "replicate IAM to another Region" — meaningless, it's already global.
<!--ID: 1788139020457-->
END

START
Basic
AWS Global Infrastructure: An Edge Location and an Availability Zone — what's the functional difference?
Back: An AZ runs your compute and storage (EC2, EBS, subnets). An Edge Location only caches and terminates connections (CloudFront, Route 53, Global Accelerator) — no general compute.
<!--ID: 1788139020465-->
END

START
Basic
AWS Global Infrastructure: Which resources are AZ-scoped, so placing them wrong creates a single point of failure?
Back: EC2 instances, EBS volumes, and subnets. A subnet lives in exactly one AZ — so "multi-AZ" always means multiple subnets.
<!--ID: 1788139020472-->
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
