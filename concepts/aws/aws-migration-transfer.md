---
tags: [aws, saa-c03, migration, domain-2, domain-4]
category: aws
related: [aws-storage-services, aws-rds-aurora, aws-hybrid-connectivity, aws-serverless-containers]
---
TARGET DECK: Study::AWS::Operations

## Description
Migration questions describe a legacy on-prem estate and ask which service or strategy moves it. Two things to know: the **7 Rs** vocabulary, and the **service → job** mapping.

**The 7 Rs of migration**
- **Rehost** ("lift and shift") — move as-is to EC2. Fastest, no code change. → **AWS Application Migration Service (MGN)**.
- **Replatform** ("lift, tinker, and shift") — small optimizations, e.g. self-managed MySQL → RDS. Best effort/benefit ratio, and the exam's frequent sweet spot.
- **Refactor / Re-architect** — rewrite for cloud-native (monolith → microservices/serverless). Highest cost and benefit.
- **Repurchase** — swap to SaaS.
- **Relocate** — move VMware workloads wholesale → **VMware Cloud on AWS**.
- **Retain** — leave it on-prem for now.
- **Retire** — decommission.

**The services**
- **AWS Application Discovery Service** — inventories on-prem servers and their dependencies **before** you migrate. The answer for "we don't know what we have / plan the migration."
- **AWS Migration Hub** — single dashboard tracking migration progress across tools.
- **AWS Application Migration Service (MGN)** — the standard **rehost/lift-and-shift** tool; continuously replicates servers, cutover with minimal downtime.
- **AWS DMS (Database Migration Service)** — migrates databases with **minimal downtime** via ongoing replication (CDC). Source stays available throughout.
- **AWS SCT (Schema Conversion Tool)** — converts schema/stored procedures for **heterogeneous** migrations (Oracle → PostgreSQL). Pair with DMS.
- **AWS DataSync** — **online** bulk file transfer/sync (NFS/SMB ↔ S3/EFS/FSx), scheduled and validated.
- **AWS Snow Family** — **offline** shipping when bandwidth can't meet the deadline. Snowcone (8 TB) / Snowball Edge (~80 TB, with compute) / Snowmobile (exabytes).
- **AWS Transfer Family** — managed **SFTP/FTPS/FTP** endpoints in front of S3/EFS. The answer for "partners upload via SFTP and we can't change their process."

The recurring decision: **DataSync (online) vs Snowball (offline)** is arithmetic — compute the transfer time over the stated bandwidth and compare it to the deadline. **DMS vs Snowball for a database** — DMS when downtime must be minimal and the link is adequate.

## Examples
```
Service picker:

"We don't know what's running on-prem"          → Application Discovery Service
"Lift and shift 200 VMs to EC2"                 → Application Migration Service (MGN)
"Move Oracle to Aurora PostgreSQL"              → SCT + DMS
"Move MySQL to RDS MySQL, minimal downtime"     → DMS (homogeneous, no SCT needed)
"Sync 50 TB of NFS to S3 over the network"      → DataSync
"Move 400 TB with a 100 Mbps link, 3 weeks"     → Snowball (do the math)
"Partners must keep using SFTP"                 → Transfer Family
"Keep our VMware stack, run it on AWS"          → VMware Cloud on AWS (Relocate)
"Track overall migration progress"              → Migration Hub
```

```
The 7 Rs, ordered by effort:

Retire      ── delete it                        least effort
Retain      ── leave it
Relocate    ── VMware Cloud on AWS
Rehost      ── lift & shift to EC2 (MGN)
Replatform  ── MySQL → RDS, Tomcat → Beanstalk   ← common exam sweet spot
Repurchase  ── move to SaaS
Refactor    ── rewrite as serverless/microservices  most effort, most benefit
```

## Related Topics
- Lift and shift vs re-architecting
- Change data capture (CDC)
- Cutover strategies and rollback
- Bandwidth planning
- Hybrid architecture

## Cards

```anki
START
Basic
Migration: A company must migrate a production database with almost no downtime. Which service, and how does it manage that?
Back: AWS DMS — it does an initial load then keeps replicating changes (CDC) while the source stays live, so you cut over at the end.
<!--ID: 1788139020678-->
END

START
Basic
Migration: Oracle → Aurora PostgreSQL. Why isn't DMS alone enough?
Back: It's a heterogeneous migration — schema, data types, and stored procedures differ. Use the Schema Conversion Tool (SCT) first, then DMS for the data.
<!--ID: 1788139020684-->
END

START
Basic
Migration: 500 TB must reach AWS in one month over a 200 Mbps link. What do you use and why?
Back: AWS Snow Family (offline). 500 TB at 200 Mbps takes well over a year — when the arithmetic beats the deadline, ship disks.
<!--ID: 1788139020690-->
END

START
Basic
Migration: The team doesn't know which on-prem servers talk to which. What runs first?
Back: AWS Application Discovery Service — inventories servers and maps dependencies so you can plan migration waves.
<!--ID: 1788139020696-->
END

START
Basic
Migration: External partners upload files via SFTP and refuse to change. How do you land those files in S3?
Back: AWS Transfer Family — managed SFTP/FTPS/FTP endpoints backed by S3 or EFS, with no change to the partners' workflow.
<!--ID: 1788139020703-->
END

START
Basic
Migration: What does "replatform" mean, and why does the exam favour it?
Back: Lift-and-shift plus small optimizations — e.g. self-managed MySQL on EC2 → RDS. It captures most of the managed-service benefit for a fraction of a rewrite's cost.
<!--ID: 1788139020708-->
END

START
Basic
Migration: Which service is the standard answer for lift-and-shift of physical/virtual servers to EC2?
Back: AWS Application Migration Service (MGN) — continuous block-level replication with a low-downtime cutover.
<!--ID: 1788139020715-->
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
