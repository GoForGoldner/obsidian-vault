---
tags: [aws, saa-c03, cost, domain-4]
category: aws
related: [aws-ec2-autoscaling, aws-s3, aws-organizations, aws-vpc, aws-monitoring-governance]
---
TARGET DECK: Study::AWS::Operations

## Description
Domain 4 is 20% of the exam. It splits into **choose the cheaper thing** and **see the spend**.

**The cost tools:**
- **AWS Cost Explorer** — visualize and **forecast** spend, filter by tag/service/account. "Analyze historical spend and forecast" → Cost Explorer.
- **AWS Budgets** — set thresholds and **alert (or act) when spend or usage exceeds them**. "Notify us before we exceed $10k" → Budgets.
- **Cost and Usage Report (CUR)** — the most granular, line-item billing data, delivered to S3 for analysis in Athena/QuickSight.
- **Cost allocation tags** — how you attribute spend to teams/projects. Must be activated in the billing console; without tags you cannot do chargeback.
- **Compute Optimizer** — right-sizing recommendations from real utilization.
- **Trusted Advisor** — flags idle/underutilized resources.

**The biggest lever the exam tests is data transfer pricing**, because it's counterintuitive:
- **Inbound to AWS: free.**
- **Outbound to the internet: expensive** — the main cost in most bills.
- **Within the same AZ using private IPs: free.**
- **Cross-AZ: charged both directions.**
- **Cross-Region: charged.**
- **S3/DynamoDB via a Gateway VPC endpoint: free**, and it also avoids NAT Gateway data-processing charges.
- **CloudFront to the internet is cheaper than direct S3/EC2 egress**, and CloudFront→origin is free from S3.

So the recurring cost answers are: **put a CloudFront distribution in front**, **add a gateway endpoint for S3**, **keep chatty traffic in one AZ**, and **stop routing S3 traffic through a NAT Gateway**.

**Compute savings:** Spot (up to 90%) for interruptible work, Savings Plans/RIs for steady baseline, right-size with Compute Optimizer, and shut down non-production out of hours (instance scheduler). **Serverless (Lambda/Fargate) removes idle cost entirely** — the answer when a workload runs rarely.

**Storage savings:** S3 lifecycle policies to IA/Glacier, Intelligent-Tiering for unknown patterns, delete unattached EBS volumes and old snapshots, gp2 → gp3, and EFS Infrequent Access.

## Examples
```
The data transfer cheat sheet:

Internet → AWS                    FREE
AWS → internet                    $$$   ← usually the biggest line item
Same AZ, private IP               FREE
Same Region, cross-AZ             $     (both directions)
Cross-Region                      $$
S3 ↔ EC2 via gateway endpoint     FREE  (and skips NAT processing charges)
S3 → CloudFront → users           cheaper than S3 → users directly
```

```
"Reduce our bill" answers, ranked by how often they're correct:

1. CloudFront in front of S3/ALB          → cheaper egress + fewer origin requests
2. S3 lifecycle → IA/Glacier              → the storage classic
3. Savings Plans / RIs for the baseline   → up to 72% on steady compute
4. Spot for batch/stateless               → up to 90%
5. Gateway VPC endpoint for S3            → kills NAT data-processing charges
6. Right-size via Compute Optimizer       → free recommendations
7. Auto Scaling / scheduled shutdown      → stop paying for idle
8. gp2 → gp3                              → ~20% cheaper, decoupled IOPS
```

```
Cost visibility stack:

  Cost Explorer  → "where did the money go, and where is it heading?"
  Budgets        → "tell me BEFORE we cross $10,000"
  CUR + Athena   → "line-item detail for chargeback"
  Cost allocation tags → the thing that makes all of the above per-team
```

## Related Topics
- Data transfer pricing
- Reserved capacity and commitment discounts
- Right-sizing
- Chargeback and showback
- Storage tiering

## Cards

```anki
START
Basic
Cost: Which direction of data transfer is free, and which is the usual biggest line item?
Back: Inbound to AWS is free. Outbound to the internet is expensive and typically dominates the bill.
This asymmetry drives most cost-optimization answers.
<!--ID: 1788139020123-->
END

START
Basic
Cost: EC2 instances in a private subnet pull large objects from S3 through a NAT Gateway. What's the fix?
Back: Add a Gateway VPC endpoint for S3 — traffic stays on the AWS network, is free, and skips NAT Gateway data-processing charges entirely.
<!--ID: 1788139020130-->
END

START
Basic
Cost: "Alert us before monthly spend exceeds $10,000." Cost Explorer or Budgets?
Back: AWS Budgets — it sets thresholds and alerts or acts. Cost Explorer visualizes and forecasts but doesn't alert.
<!--ID: 1788139020137-->
END

START
Basic
Cost: You need line-item billing detail to charge back to teams. Which two things do you need?
Back: The Cost and Usage Report (CUR) delivered to S3, plus activated cost allocation tags. Without tags you can't attribute spend to a team.
<!--ID: 1788139020144-->
END

START
Basic
Cost: A workload runs for 30 seconds, twice a day. Why is EC2 the wrong answer?
Back: You'd pay for an idle instance ~24 hours a day. Lambda bills per millisecond of execution and costs nothing when idle.
<!--ID: 1788139020151-->
END

START
Basic
Cost: Two chatty microservices are deployed in different AZs for HA. What's the hidden cost?
Back: Cross-AZ data transfer, charged in both directions. Traffic between instances in the same AZ over private IPs is free — a real HA-vs-cost tradeoff.
<!--ID: 1788139020158-->
END

START
Basic
Cost: How does putting CloudFront in front of S3 reduce cost, not just latency?
Back: CloudFront's per-GB egress is cheaper than S3's direct internet egress, S3→CloudFront transfer is free, and cache hits cut origin requests.
<!--ID: 1788139020165-->
END

START
Basic
Cost: Which service recommends right-sizing based on actual utilization rather than guesswork?
Back: AWS Compute Optimizer — it analyzes CloudWatch metrics and recommends instance types/sizes. Trusted Advisor also flags idle resources more broadly.
<!--ID: 1788139020171-->
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
