---
tags: [aws, saa-c03, resiliency, dr, domain-2, domain-4]
category: aws
related: [aws-route-53, aws-rds-aurora, aws-s3, aws-global-infrastructure, aws-storage-services]
---
TARGET DECK: Study::AWS::Operations

## Description
Two numbers define every DR question:
- **RPO (Recovery Point Objective)** — how much **data** you can afford to lose, measured backwards from the failure. Driven by **backup/replication frequency**.
- **RTO (Recovery Time Objective)** — how long you can afford to be **down**. Driven by **how much is already running**.

The four strategies, cheapest/slowest to most expensive/fastest:

| Strategy | RTO | RPO | What's running | Cost |
|---|---|---|---|---|
| **Backup & Restore** | Hours | Hours | Nothing — just backups | $ |
| **Pilot Light** | 10s of minutes | Minutes | **Core data replicating**, servers off | $$ |
| **Warm Standby** | Minutes | Seconds | **Full stack, scaled down** | $$$ |
| **Multi-Site Active/Active** | **Near zero** | **Near zero** | **Full stack, full scale, serving** | $$$$ |

Distinguishing the middle two is the exam's favourite: **Pilot Light** keeps only the *data layer* live (a replicating database) with application servers stopped or non-existent — you must provision and start them, so recovery takes tens of minutes. **Warm Standby** has a **complete but under-scaled environment already running and able to serve traffic** — you just scale it up and shift DNS, so recovery is minutes.

Read the question for the cost/speed tension: if it says "lowest cost" and tolerates hours, it's Backup & Restore. If it says "minimize downtime regardless of cost," it's Active/Active. Most realistic questions land on Pilot Light or Warm Standby.

Supporting services: **AWS Backup** (centralized, policy-driven backup across EBS, RDS, DynamoDB, EFS, FSx, Storage Gateway — plus cross-Region/cross-account copy and **Backup Vault Lock** for immutability), **Route 53 failover routing** with health checks, **S3 Cross-Region Replication**, **RDS cross-Region read replicas** (promote on failure), **Aurora Global Database** (sub-second RPO, sub-minute RTO), **DynamoDB Global Tables**, and **CloudFormation** to rebuild infrastructure quickly.

Well-Architected also stresses: **test the plan**, and design so components fail independently.

## Examples
```
Reading the requirement:

"Can lose a day of data, restore within 24 hours,
 cheapest possible"                              → Backup & Restore
"Database must stay current; can wait ~30 min
 for the app tier to come up"                    → Pilot Light
"Under 10 minutes downtime, some cost OK"        → Warm Standby
"Zero downtime, users must not notice"           → Multi-Site Active/Active
"RPO seconds, RTO under a minute, global"        → Aurora Global Database
```

```
Pilot Light vs Warm Standby — the concrete difference:

PILOT LIGHT (DR Region)              WARM STANDBY (DR Region)
  RDS read replica  ● running          RDS read replica   ● running
  App servers       ○ AMI only         App servers        ● running (1 small instance)
  Load balancer     ○ not created      Load balancer      ● running, healthy
  ─ recovery ─                         ─ recovery ─
  provision LB + launch fleet          scale the ASG up
  promote DB, shift DNS                promote DB, shift DNS
  = tens of minutes                    = minutes

Warm standby CAN serve traffic right now, just not at full load. That's the test.
```

## Related Topics
- RPO and RTO
- High availability vs disaster recovery
- Cross-Region replication
- Failover and DNS TTL
- Chaos testing / DR drills

## Cards

```anki
START
Basic
DR: What's the difference between RPO and RTO in one line each?
Back: RPO = how much DATA you can lose (set by backup/replication frequency). RTO = how long you can be DOWN (set by how much is already running).
<!--ID: 1788139020179-->
END

START
Basic
DR: A DR site has a replicating database but no running app servers. Which strategy?
Back: Pilot Light — only the core data layer is live; you must provision and launch the application tier, so RTO is tens of minutes.
<!--ID: 1788139020186-->
END

START
Basic
DR: The DR environment is a complete stack running at reduced capacity, able to serve traffic today. Which strategy?
Back: Warm Standby. The tell is that it's functional right now and just needs scaling up — Pilot Light isn't serving anything.
<!--ID: 1788139020191-->
END

START
Basic
DR: The requirement is "lowest possible cost" and downtime of up to 24 hours is acceptable. Which strategy?
Back: Backup & Restore — nothing runs in the DR Region, you just restore from backups/snapshots. Cheapest, slowest.
<!--ID: 1788139020197-->
END

START
Basic
DR: Which strategy gives near-zero RTO and RPO, and what's the catch?
Back: Multi-Site Active/Active — both Regions serve live traffic. The catch is roughly double the infrastructure cost, plus data-consistency complexity across Regions.
<!--ID: 1788139020202-->
END

START
Basic
DR: You need RPO measured in seconds and RTO under a minute for a global relational workload. What service?
Back: Aurora Global Database — sub-second cross-Region replication lag, RTO under a minute. Standard cross-Region read replicas promote far more slowly.
<!--ID: 1788139020206-->
END

START
Basic
DR: How do you centrally manage backups across EBS, RDS, DynamoDB, and EFS with cross-Region copies?
Back: AWS Backup — policy-driven backup plans across services, with cross-Region and cross-account copy, and Vault Lock for immutable retention.
<!--ID: 1788139020211-->
END

START
Basic
DR: Failover completed but users still hit the dead Region. What was missed?
Back: DNS TTL. Route 53 records need a low TTL (~60s) or resolvers keep serving the cached old endpoint long after the health check flipped.
<!--ID: 1788139020215-->
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
