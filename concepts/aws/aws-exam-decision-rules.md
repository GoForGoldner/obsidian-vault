---
tags: [aws, saa-c03, exam-strategy, review]
category: aws
related: [aws-iam, aws-s3, aws-rds-aurora, aws-integration-messaging, aws-disaster-recovery, aws-cost-optimization]
---
TARGET DECK: Study::AWS::Exam Strategy

## Description
The SAA-C03 is a **discrimination test**, not a recall test. Most questions give four *technically workable* options and ask for the one that best fits a constraint buried in the wording. This note collects the decision rules and the trigger words that resolve them — it's the last thing to review before the exam.

**Universal heuristics**
1. **Managed beats self-managed.** If one option runs software on EC2 and another uses a managed service, the managed one is usually right.
2. **"Least operational overhead" → serverless.** This exact phrase appears constantly and points to Lambda, Fargate, S3, DynamoDB, SQS, Aurora Serverless.
3. **Roles beat keys.** Any option storing credentials is wrong.
4. **Multi-AZ beats multi-Region** unless the question names a Region failure or data residency.
5. **Managed scaling beats manual.** Auto Scaling over "add more instances."
6. **Eliminate on hard limits first.** Lambda >15 min, EFS is Linux-only, ALB can't do UDP, gateway endpoints are S3/DynamoDB only, LSIs can't be added later, CloudFront certs must be us-east-1.
7. **Beware absolute language** — "always," "never," and answers that require rewriting a working application are usually distractors.

**The high-frequency pairs**

| If the question says… | The answer is |
|---|---|
| Reduce read load on the database | Read replica |
| Survive an AZ failure automatically | Multi-AZ |
| Access pattern unknown/changing (S3) | Intelligent-Tiering |
| Retrieval in 12 hours is fine, cheapest | Glacier Deep Archive |
| Block a specific IP | NACL (only place with Deny) |
| Static IP in front of a load balancer | NLB or Global Accelerator |
| Path-based routing | ALB |
| UDP / non-HTTP | NLB |
| Block SQL injection / XSS | WAF |
| Detect compromised credentials | GuardDuty |
| Find PII in S3 | Macie |
| Who called this API? | CloudTrail |
| Is this resource compliant? | Config |
| Memory metric on EC2 | CloudWatch **agent** |
| Shell access, no bastion, no port 22 | SSM Session Manager |
| Rotate DB credentials automatically | Secrets Manager |
| Free config storage | Parameter Store |
| One event, many consumers | SNS |
| One message, one consumer, buffer spikes | SQS |
| Ordering + replay + many consumers | Kinesis Data Streams |
| Land a stream in S3, zero admin | Kinesis Firehose |
| Route on event content / cron / SaaS | EventBridge |
| Existing JMS/AMQP app | Amazon MQ |
| Existing Kafka | Amazon MSK |
| Microsecond DynamoDB reads | DAX |
| Leaderboard / pub-sub / persistence | ElastiCache **Redis** |
| Lambda exhausting DB connections | RDS Proxy |
| Ad-hoc SQL on S3, serverless | Athena |
| Reduce Athena cost | Parquet + compression + partitioning |
| Reduce NAT charges for S3 traffic | Gateway VPC endpoint |
| Reduce internet egress cost | CloudFront |
| Interruptible batch work | Spot |
| Steady baseline, want flexibility | Savings Plans |
| BYOL per physical socket | Dedicated **Hosts** |
| Set up hybrid link fast | Site-to-Site VPN |
| Consistent latency, large transfer | Direct Connect |
| DX **and** encryption | DX + VPN over it |
| Huge data, thin pipe, deadline | Snow Family |
| Minimal-downtime DB migration | DMS (+ SCT if heterogeneous) |
| Immutable records for N years | S3 Object Lock, compliance mode |
| Governed multi-account setup, fast | Control Tower |
| Share subnets across accounts | AWS RAM |
| Guardrail across all accounts | SCP |

**Exam-day mechanics.** 65 questions in 130 minutes ≈ **2 minutes each**. Read the **last sentence first** — it contains the actual ask and the constraint ("most cost-effective," "least operational overhead," "highest availability"). Then eliminate: two options are usually obviously wrong, and the real decision is between the remaining two, separated by exactly one constraint. **Flag and move on** — never burn 5 minutes on one question. Unanswered scores as wrong, so **guess on everything**.

## Examples
```
How a typical question is actually built:

  [Three paragraphs of scenario, mostly irrelevant]
  "...The solution must minimize operational overhead."   ← the ONLY thing that matters

  A) Run X on EC2 with a cron job          ← workable, but high overhead
  B) Use a managed serverless service      ← correct
  C) Something that violates a hard limit  ← eliminate on the limit
  D) Something that solves a different
     problem entirely                      ← eliminate immediately

Read the last sentence first. It picks between A and B.
```

```
The four constraint words and what they select for:

"most cost-effective"        → cheapest thing that still meets the stated requirement
                               (not the cheapest thing overall)
"least operational overhead" → managed / serverless
"highest availability"       → multi-AZ, and multi-Region only if stated
"minimal downtime"           → DMS, blue-green, warm standby, Multi-AZ failover
```

## Related Topics
- Test-taking strategy
- Well-Architected Framework pillars
- Managed vs self-managed tradeoffs

## Cards

```anki
START
Basic
SAA Strategy: What should you read first in a long scenario question, and why?
Back: The last sentence. It contains the actual ask and the deciding constraint — "most cost-effective," "least operational overhead," "highest availability." The scenario paragraphs are mostly noise.
<!--ID: 1788139020326-->
END

START
Basic
SAA Strategy: The phrase "least operational overhead" appears. What does it almost always select for?
Back: The managed/serverless option — Lambda, Fargate, S3, DynamoDB, SQS, Aurora Serverless — over anything you run and patch yourself on EC2.
<!--ID: 1788139020332-->
END

START
Basic
SAA Strategy: What does "most cost-effective" actually mean on this exam?
Back: The cheapest option that STILL MEETS every stated requirement — not the cheapest option overall. Distractors are usually cheaper but violate a requirement.
<!--ID: 1788139020338-->
END

START
Basic
SAA Strategy: What's your time budget per question, and what do you do when you exceed it?
Back: 130 min / 65 questions = 2 minutes each. Past that, pick your best guess, flag it, and move on. Unanswered scores as wrong, so never leave a blank.
<!--ID: 1788139020343-->
END

START
Basic
SAA Strategy: Name four hard service limits that let you eliminate an answer instantly.
Back: Lambda's 15-minute timeout, EFS being Linux/NFS only, ALB not handling UDP, and gateway VPC endpoints existing only for S3 and DynamoDB.
<!--ID: 1788139020350-->
END

START
Basic
SAA Strategy: An option involves storing AWS access keys somewhere. What do you do?
Back: Eliminate it. The correct answer is always an IAM role with temporary credentials — this holds for EC2, Lambda, ECS, and cross-account access.
<!--ID: 1788139020357-->
END

START
Basic
SAA Strategy: Two options both work and differ only in AZ vs Region scope. How do you choose?
Back: Choose Multi-AZ unless the question explicitly names a Region-wide outage, a data-residency law, or global user latency. Multi-Region costs far more and is over-engineering otherwise.
<!--ID: 1788139020362-->
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
