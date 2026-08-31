---
tags: [aws, saa-c03, monitoring, governance, domain-1, domain-2]
category: aws
related: [aws-security-services, aws-cost-optimization, aws-ec2-autoscaling, aws-organizations]
---
TARGET DECK: Study::AWS::Operations

## Description
The "who did what, is it healthy, is it compliant" trio — and the exam tests the distinction between them relentlessly.

- **CloudWatch** = **metrics, logs, alarms, dashboards**. "Is it healthy? Alert me." Metrics are 5-minute by default; **detailed monitoring** gives 1-minute. **Memory and disk usage are NOT default EC2 metrics** — they require the **CloudWatch agent**, which is a favourite exam gotcha. **CloudWatch Logs** centralizes application logs (needs the agent on EC2). **CloudWatch Alarms** trigger scaling, SNS notifications, or EC2 actions. **EventBridge** (formerly CloudWatch Events) reacts to events and schedules cron.
- **CloudTrail** = **API audit log**. "**Who** called **what** API, **when**, from **which IP**?" Retains 90 days of management-event history by default; send to S3 for longer, and enable an **organization trail** plus **log file validation** for tamper evidence. Any question about accountability, forensics, or "who deleted the bucket" → CloudTrail.
- **AWS Config** = **resource configuration history and compliance**. "Was this resource **compliant** with our rules, and **what changed** over time?" Config **rules** evaluate resources continuously (e.g. "no unencrypted EBS volumes," "no security group open to 0.0.0.0/0 on port 22") and can auto-remediate.

The three-way memory hook: **CloudWatch = performance. CloudTrail = who. Config = what it looked like and whether that was allowed.**

Also:
- **AWS X-Ray** — **distributed tracing**. The answer for "find the bottleneck across microservices" or "trace a request through Lambda → API Gateway → DynamoDB."
- **AWS Systems Manager (SSM)** — operational hub: **Session Manager** (shell access to instances **without SSH, bastion hosts, or open port 22** — a very common right answer), **Patch Manager**, **Run Command**, **Parameter Store**, and Inventory.
- **AWS Trusted Advisor** — automated best-practice checks across cost, performance, security, fault tolerance, and service limits. Full checks need Business/Enterprise support.
- **AWS CloudFormation** — **infrastructure as code**, declarative templates, free, with stack rollback and **StackSets** for multi-account/multi-Region deployment. "Repeatable, version-controlled infrastructure" → CloudFormation.
- **AWS Health Dashboard** — AWS-side events affecting your account.
- **AWS Compute Optimizer** — right-sizing recommendations from actual utilization.

## Examples
```
Which service answers the question:

"CPU is above 80%, page someone"                  → CloudWatch alarm → SNS
"Memory usage on our EC2 fleet"                   → CloudWatch AGENT (not default)
"Who deleted the production S3 bucket?"           → CloudTrail
"Which security groups allow 0.0.0.0/0 on 22?"    → AWS Config rule
"Prove this instance was encrypted last Tuesday"  → AWS Config (configuration history)
"Which microservice is adding 400ms of latency?"  → X-Ray
"Shell into a private instance with no bastion"   → Systems Manager Session Manager
"Patch 500 instances on a schedule"               → SSM Patch Manager
"Deploy the same stack to 20 accounts"            → CloudFormation StackSets
"Are we wasting money / near a service limit?"    → Trusted Advisor
"Are our instances oversized?"                    → Compute Optimizer
```

```
Why Session Manager keeps being the answer:

  Old way:  user → SSH over :22 → bastion in public subnet → private instance
            needs: open port, key management, a bastion to patch and pay for

  SSM way:  user → SSM API (IAM-authenticated) → agent on instance
            needs: SSM agent + instance role. NO open inbound ports at all,
            and every session is logged to CloudTrail/S3.
```

## Related Topics
- Observability: metrics, logs, traces
- Audit logging and forensics
- Compliance as code
- Infrastructure as code
- Bastion hosts and secure access

## Cards

```anki
START
Basic
Monitoring: "Who deleted the production database?" CloudWatch, CloudTrail, or Config?
Back: CloudTrail — it records API calls: who, what, when, from which IP. CloudWatch tracks performance; Config tracks resource state.
<!--ID: 1788139020723-->
END

START
Basic
Monitoring: You need to know whether any EBS volume has ever been unencrypted, and be alerted if one appears. Which service?
Back: AWS Config — configuration history plus continuously evaluated Config rules, with optional auto-remediation.
<!--ID: 1788139020730-->
END

START
Basic
CloudWatch: Why doesn't your EC2 memory-utilization alarm work out of the box?
Back: Memory and disk usage aren't hypervisor-visible, so they aren't default EC2 metrics. You must install the CloudWatch agent to publish them as custom metrics.
<!--ID: 1788139020737-->
END

START
Basic
Monitoring: A request through five microservices is slow and nobody knows which hop. Which service?
Back: AWS X-Ray — distributed tracing that shows latency per segment across the whole request path.
<!--ID: 1788139020743-->
END

START
Basic
Systems Manager: Admins need shell access to instances in private subnets. The options include a bastion host. What's better and why?
Back: SSM Session Manager — no open inbound ports, no SSH keys, no bastion to run and patch, and every session is IAM-controlled and logged.
<!--ID: 1788139020750-->
END

START
Basic
Governance: The same 3-tier stack must be deployed identically into 20 accounts across 4 Regions. What?
Back: CloudFormation StackSets — deploys and updates one template across many accounts and Regions from a single operation.
<!--ID: 1788139020757-->
END

START
Basic
Monitoring: What's the default CloudWatch metric interval for EC2, and how do you improve it?
Back: 5 minutes by default; enable detailed monitoring for 1-minute granularity (at extra cost). Matters when scaling must react fast.
<!--ID: 1788139020764-->
END

START
Basic
Governance: How long does CloudTrail retain event history by default, and what do you do for a 7-year audit requirement?
Back: 90 days of management events in Event history. For longer, create a trail delivering to S3, with lifecycle to Glacier and log file validation enabled.
<!--ID: 1788139020771-->
END

START
Basic
Governance: Which service tells you you're approaching a service quota or wasting money on idle resources?
Back: AWS Trusted Advisor — automated checks across cost, performance, security, fault tolerance, and service limits (full set needs Business/Enterprise support).
<!--ID: 1788139020778-->
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
