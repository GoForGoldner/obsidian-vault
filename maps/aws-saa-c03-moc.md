---
tags: [aws, saa-c03, moc, study-plan]
category: aws
related: [aws-exam-decision-rules, aws-iam, aws-vpc, aws-s3]
---

# AWS Solutions Architect – Associate (SAA-C03) — Map & 7-Day Plan

## Exam facts (verified against the official AWS exam guide, v1.1, 2026-08-30)

**SAA-C03 is the current version.** There is no SAA-C04 — several high-ranking blogs claim one exists and was "released March 2024," but that is AI-generated SEO content. The live exam guide PDF at `d1.awsstatic.com` is titled SAA-C03, and AWS's own [coming-soon page](https://aws.amazon.com/certification/coming-soon/) lists no Solutions Architect update. Re-verify before booking if time has passed.

| | |
|---|---|
| Questions | 65 (50 scored + 15 unscored, unmarked) |
| Time | 130 minutes (**2:00 per question**) |
| Passing score | **720 / 1000** (scaled) |
| Cost | $150 USD |
| Format | Multiple choice (1 of 4) and multiple response (2+ of 5+) |
| Scoring | Compensatory — you don't need to pass each domain, only overall. **No penalty for guessing.** |

**Domain weightings — where the questions actually are:**

| Domain | Weight | ~Scored Qs | Core notes |
|---|---|---|---|
| 1 — Design **Secure** Architectures | **30%** | ~15 | [[aws-iam]], [[aws-kms-encryption]], [[aws-security-services]], [[aws-vpc]], [[aws-organizations]] |
| 2 — Design **Resilient** Architectures | **26%** | ~13 | [[aws-disaster-recovery]], [[aws-integration-messaging]], [[aws-elastic-load-balancing]], [[aws-route-53]], [[aws-rds-aurora]] |
| 3 — Design **High-Performing** Architectures | **24%** | ~12 | [[aws-storage-services]], [[aws-ec2-autoscaling]], [[aws-dynamodb]], [[aws-caching-elasticache]], [[aws-analytics-ingestion]] |
| 4 — Design **Cost-Optimized** Architectures | **20%** | ~10 | [[aws-cost-optimization]], [[aws-s3]], [[aws-storage-services]], [[aws-ec2-autoscaling]] |

Security is the single biggest domain. If you run out of time, do not let IAM, VPC, or encryption be the thing you skimped on.

## The notes

**Foundations**
- [[aws-global-infrastructure]] — Regions, AZs, edge, shared responsibility
- [[aws-iam]] — users, roles, policies, STS, cross-account, evaluation order
- [[aws-organizations]] — SCPs, Control Tower, consolidated billing, RAM

**Networking**
- [[aws-vpc]] — subnets, NAT, security groups vs NACLs, endpoints, peering, TGW
- [[aws-hybrid-connectivity]] — VPN, Direct Connect, PrivateLink, Global Accelerator
- [[aws-route-53]] — routing policies, alias vs CNAME, health checks
- [[aws-elastic-load-balancing]] — ALB vs NLB vs GWLB
- [[aws-cloudfront-api-gateway]] — CDN, OAC, signed URLs, API front door

**Compute**
- [[aws-ec2-autoscaling]] — families, purchasing options, placement groups, ASG
- [[aws-serverless-containers]] — Lambda, Fargate, ECS/EKS, Batch, Beanstalk, Step Functions

**Storage**
- [[aws-s3]] — storage classes, lifecycle, encryption, replication, Object Lock
- [[aws-storage-services]] — EBS, EFS, FSx, Storage Gateway, DataSync, Snow

**Databases**
- [[aws-rds-aurora]] — Multi-AZ vs read replicas, Aurora, RDS Proxy, DMS
- [[aws-dynamodb]] — keys, GSI vs LSI, capacity modes, DAX, Streams, Global Tables
- [[aws-caching-elasticache]] — Redis vs Memcached, caching patterns

**Integration & security**
- [[aws-integration-messaging]] — SQS, SNS, EventBridge, Kinesis, MQ
- [[aws-kms-encryption]] — KMS, CloudHSM, Secrets Manager, ACM
- [[aws-security-services]] — GuardDuty, Macie, Inspector, WAF, Shield, Cognito

**Operations, cost, resilience**
- [[aws-monitoring-governance]] — CloudWatch vs CloudTrail vs Config, X-Ray, SSM, CloudFormation
- [[aws-cost-optimization]] — Cost Explorer, Budgets, data transfer pricing
- [[aws-disaster-recovery]] — RPO/RTO and the four strategies
- [[aws-analytics-ingestion]] — Kinesis, Glue, Athena, Redshift, EMR
- [[aws-migration-transfer]] — 7 Rs, MGN, DMS, DataSync, Snow

**Review**
- [[aws-exam-decision-rules]] — the trigger-word → answer table. Read this last.

## What you already have that transfers

Your existing vault does more work here than it looks like. [[cap-theorem]], [[eventual-consistency]], [[load-balancing]], [[message-queue]], [[cqrs]], [[nat]], [[caching-stradegies]], [[database-indexes]], [[sql]], [[nosql]], and [[docker]] all map directly onto exam concepts — you're learning **AWS's product names for things you already understand**. The 34 case studies in `system-design/` mean the architectural reasoning is already there.

**This reframes the whole week:** you are not learning distributed systems. You are learning a vocabulary and a set of limits. Optimize for recall speed and discrimination, not depth.

## Anki decks

The 205 cards sync into subdecks by service area, one deck per note:

| Deck | Cards |
|---|---|
| `Study::AWS::Foundations` | 22 |
| `Study::AWS::Networking` | 41 |
| `Study::AWS::Compute` | 19 |
| `Study::AWS::Storage` | 20 |
| `Study::AWS::Databases` | 27 |
| `Study::AWS::Integration` | 10 |
| `Study::AWS::Security` | 19 |
| `Study::AWS::Operations` | 40 |
| `Study::AWS::Exam Strategy` | 7 |

Study the subdeck that matches the day's reading, then review `Study::AWS` as a whole from Day 4 on so the cards interleave — mixing areas is what builds the discrimination the exam actually tests.

Any new AWS note needs its own `TARGET DECK:` line or its cards land in `Default`.

## The 7-day plan (~4–5 hrs/day, ~31 hrs)

Practice exams live at `Desktop/aws-saa-prep/practice-exam.html` — open in a browser, no install.

### Day 1 — Security foundations (Domain 1, the biggest)
- **2.0h** Read [[aws-global-infrastructure]], [[aws-iam]], [[aws-organizations]]. IAM twice.
- **1.0h** Sync new cards to Anki. Do the full new-card batch for those three notes.
- **1.0h** Practice Exam A, **Domain 1 only** (untimed). Expect to do badly — that's the point.
- **0.5h** Write down every service name you'd never heard of. That list is your real syllabus.

### Day 2 — Networking (the hardest single area from zero)
- **2.5h** [[aws-vpc]] then [[aws-hybrid-connectivity]], [[aws-route-53]], [[aws-elastic-load-balancing]].
- **0.5h** **Draw a 2-AZ VPC from memory on paper.** Public/private subnets, IGW, NAT, route tables, SGs. Redraw it until it's automatic — a large share of the exam assumes this diagram.
- **1.0h** Anki: all new networking cards + Day 1 reviews.
- **0.5h** Practice Exam A, networking questions.

### Day 3 — Compute & storage
- **2.0h** [[aws-ec2-autoscaling]], [[aws-serverless-containers]], [[aws-s3]], [[aws-storage-services]].
- **0.5h** Memorize two tables cold: **S3 storage classes** and **EBS volume types**. These are free marks.
- **1.0h** Anki (new + accumulating reviews).
- **1.0h** Practice Exam A, storage + compute sections.

### Day 4 — Databases, decoupling, security services
- **2.0h** [[aws-rds-aurora]], [[aws-dynamodb]], [[aws-caching-elasticache]], [[aws-integration-messaging]].
- **1.0h** [[aws-kms-encryption]], [[aws-security-services]].
- **1.0h** Anki.
- **0.5h** Say out loud, without notes: Multi-AZ vs read replica. SQS vs SNS vs Kinesis. GSI vs LSI. If you hesitate, reread.

### Day 5 — Operations, cost, DR + **first full timed exam**
- **1.5h** [[aws-monitoring-governance]], [[aws-cost-optimization]], [[aws-disaster-recovery]], [[aws-analytics-ingestion]], [[aws-migration-transfer]].
- **2.2h** **Practice Exam A, full 65 questions, timed at 130 minutes, no notes.** Simulate exam conditions.
- **1.0h** Review every wrong answer *and* every lucky guess. For each, write one line in your own words about why the right answer wins.

### Day 6 — Repair weak areas + **second timed exam**
- **1.0h** Reread only the notes covering Day 5's mistakes.
- **2.2h** **Practice Exam B, full, timed.**
- **1.0h** Review. Your score should be meaningfully higher. If it isn't, the problem is reading the question, not knowledge — reread [[aws-exam-decision-rules]].
- **0.5h** Anki: clear the review backlog.

### Day 7 — Consolidate
- **1.0h** [[aws-exam-decision-rules]] — the whole trigger-word table, twice.
- **1.0h** Practice Exam C (or redo A's wrong answers).
- **1.0h** Skim every note's `## Description` only. Not the cards, not the examples.
- **0.5h** Redraw the VPC diagram. Recite the four DR strategies with their RTOs.
- **Stop early.** Sleep matters more than the last hour.

## Honest calibration

AWS targets this exam at candidates with a year of hands-on experience, and typical prep is 80–120 hours. You have ~31 from zero. Read your practice-exam scores as the real signal:

| Timed practice score | What to do |
|---|---|
| **< 65%** | Don't sit it yet. Push the date out a week and drill weak domains. |
| **65–75%** | Borderline. One more week doubles your margin. |
| **> 80% consistently** | Book it. You're ready. |

Book the real exam for **day 8 or later**, never mid-plan — and give yourself the option to move it. Rescheduling is free up to 24 hours before; a failed attempt costs $150 and a 14-day wait.

## If you get one extra resource

The single highest-value addition is a commercial question bank with 500+ questions and written explanations (Tutorials Dojo or Stephane Maarek's practice sets, ~$15–20). The exam is a pattern-recognition test and volume of *exposure to question phrasing* is what moves scores. The notes here teach the content; a big bank teaches the test.
