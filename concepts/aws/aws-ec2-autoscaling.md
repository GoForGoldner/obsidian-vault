---
tags: [aws, saa-c03, compute, cost, domain-2, domain-3, domain-4]
category: aws
related: [aws-elastic-load-balancing, aws-serverless-containers, aws-cost-optimization, aws-storage-services]
---
TARGET DECK: Study::AWS::Compute

## Description
EC2 is virtual machines. The exam tests three things: **instance family selection**, **purchasing options** (a huge slice of Domain 4), and **Auto Scaling**.

**Purchasing options** — the cost-optimization workhorse:

| Option | Discount | Commitment | Use when |
|---|---|---|---|
| **On-Demand** | 0% | none | Short, unpredictable, can't be interrupted |
| **Reserved Instances (RI)** | up to 72% | 1 or 3 yr, specific instance type | Steady-state, known workload |
| **Savings Plans** | up to 72% | 1 or 3 yr, **$/hour** commitment | Steady-state but you want flexibility across instance family/Region/even Lambda & Fargate |
| **Spot Instances** | up to 90% | none, **2-min interruption notice** | Fault-tolerant, stateless, batch, CI, big data |
| **Dedicated Hosts** | — | physical server | **Licensing bound to physical cores/sockets** (BYOL) |
| **Dedicated Instances** | — | isolated hardware | Regulatory isolation, no license/socket visibility |

Two traps: **Spot is never the answer for a stateful database or anything that can't be interrupted**, and **Dedicated Hosts vs Dedicated Instances** is decided by *licensing* — if the question mentions per-socket/per-core BYOL licenses, it's Dedicated **Hosts**.

**Instance families**: `T` burstable (cheap, dev), `M` general purpose, `C` compute optimized (CPU-bound, HPC), `R`/`X` memory optimized (in-memory DBs, caches), `I`/`D` storage optimized (high local IOPS, NoSQL), `P`/`G`/`Inf` accelerated (ML/GPU).

**Placement groups** shape physical placement: **Cluster** (same rack — lowest latency, highest throughput, HPC; but rack failure takes all of it), **Spread** (each instance on distinct hardware — max 7 per AZ, for critical individual instances), **Partition** (groups on separate racks — for HDFS/Cassandra/Kafka, which are partition-aware).

**Auto Scaling Groups (ASG)** maintain a desired count between min and max across multiple AZs, replacing unhealthy instances. Scaling policies: **target tracking** (keep average CPU at 50% — the simplest and usually correct answer), **step scaling**, **simple scaling**, and **scheduled scaling** (for *predictable* time-based load — "traffic spikes every weekday at 9am"). **Predictive scaling** uses ML on historical patterns.

Two ASG details the exam loves: set the ASG's health check type to **ELB**, not just EC2, so an app-level failure (not just a hardware failure) triggers replacement; and use a **cooldown / warm-up** period to stop thrashing.

## Examples
```
Purchasing decision tree:

Can the workload be interrupted?         → yes → Spot (up to 90% off)
Steady 24/7 baseline for a year+?        → yes → Savings Plans (flexible) or RI (rigid, slightly cheaper)
Bring-your-own license per physical core?→ yes → Dedicated Hosts
Spiky, short, unpredictable?             → On-Demand

Common real design: RI/Savings Plan for the baseline
                  + On-Demand for normal peaks
                  + Spot for the batch tier
```

```
Placement groups:

Cluster    [inst][inst][inst]  one rack      → lowest latency (HPC), worst blast radius
Spread     [inst] [inst] [inst]  distinct HW → max 7/AZ, for a few critical instances
Partition  [p1: inst,inst] [p2: inst,inst]   → HDFS/Cassandra/Kafka, rack-aware
```

```
ASG that actually self-heals:

  min=2  desired=4  max=10
  spans subnets in us-east-1a and us-east-1b     ← multi-AZ or it isn't HA
  health check type = ELB                        ← EC2-only misses app hangs
  target tracking: keep average CPU at 50%
  scheduled action: desired=8 at 08:45 weekdays  ← predictable spike
```

## Related Topics
- Horizontal vs vertical scaling
- Spot interruption handling
- Reserved capacity and commitment discounts
- Blast radius and failure domains
- Stateless application design

## Cards

```anki
START
Basic
EC2: A batch image-processing job runs nightly, is stateless, and can restart. Which purchasing option?
Back: Spot Instances — up to 90% off. Fault-tolerant + interruptible is exactly the Spot profile.
<!--ID: 1788139020268-->
END

START
Basic
EC2: When do you choose Savings Plans over Reserved Instances?
Back: When you want the discount but not the lock-in to a specific instance type/Region. Savings Plans commit to $/hour and even cover Fargate and Lambda.
RIs are marginally cheaper but rigid.
<!--ID: 1788139020274-->
END

START
Basic
EC2: The company has Oracle licenses tied to physical sockets. Dedicated Hosts or Dedicated Instances?
Back: Dedicated Hosts — only Hosts give you visibility into sockets/cores for BYOL compliance. "Per-socket/per-core licensing" is the tell.
<!--ID: 1788139020279-->
END

START
Basic
EC2: An HPC job needs the lowest possible inter-node network latency. Which placement group, and what's the risk?
Back: Cluster placement group — same rack, highest throughput. The risk: a single rack failure takes down every instance in it.
<!--ID: 1788139020286-->
END

START
Basic
EC2: You're running Cassandra and need failures to hit only one replica set. Which placement group?
Back: Partition — instances are grouped onto separate racks, and Cassandra/HDFS/Kafka are partition-aware, so a rack failure loses only one partition.
<!--ID: 1788139020292-->
END

START
Basic
EC2: Instances are running but the app has hung; the ASG never replaces them. What's misconfigured?
Back: The ASG health check type is EC2 (hardware only). Set it to ELB so failing application health checks trigger replacement.
<!--ID: 1788139020298-->
END

START
Basic
EC2: Traffic reliably spikes every weekday at 9am and the app takes 5 minutes to warm up. Which scaling policy?
Back: Scheduled scaling — scale out BEFORE the known spike. Reactive target tracking would lag behind the surge.
<!--ID: 1788139020303-->
END

START
Basic
EC2: Which instance family for an in-memory database like Redis or SAP HANA?
Back: R or X (memory optimized). C is compute-optimized (CPU-bound), I is storage-optimized (local IOPS).
<!--ID: 1788139020308-->
END

START
Basic
EC2: Why is "use Spot Instances" wrong for the database tier even though it's cheapest?
Back: Spot can be reclaimed with 2 minutes' notice. Stateful, non-interruptible workloads lose data or availability.
Spot is for stateless/fault-tolerant tiers only.
<!--ID: 1788139020314-->
END

START
Basic
EC2: What does target tracking scaling actually ask you for, and why is it usually the right answer?
Back: A single metric target (e.g. keep average CPU at 50%) — AWS computes the rest. Simple scaling and step scaling need hand-tuned thresholds and are easier to get wrong.
<!--ID: 1788139020320-->
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
