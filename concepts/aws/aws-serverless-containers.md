---
tags: [aws, saa-c03, compute, serverless, containers, domain-2, domain-3]
category: aws
related: [aws-ec2-autoscaling, aws-integration-messaging, docker, aws-cost-optimization]
---
TARGET DECK: Study::AWS::Compute

## Description
The "how much do you want to manage" spectrum: **EC2** (you manage the OS) → **ECS/EKS on EC2** (you manage the cluster instances) → **Fargate** (no servers, you define the task) → **Lambda** (no servers, no long-running process, per-invocation).

**AWS Lambda** — event-driven functions. Max **15-minute** timeout, up to 10 GB memory, 10 GB ephemeral `/tmp`. **Memory and CPU are allocated together**, so the way to speed up a CPU-bound Lambda is to *give it more memory*. Billed per ms of execution. **Cold starts** are the standard latency complaint; the fix is **provisioned concurrency**. To reach resources in a VPC (like RDS), attach the Lambda to the VPC — but then it needs a NAT gateway or endpoints for outbound AWS calls.

**Lambda's limits are the exam's favourite disqualifier.** Any job longer than 15 minutes cannot be Lambda — that points to Fargate, ECS, Batch, or Step Functions.

**Amazon ECS** — AWS's own container orchestrator; simpler, deeply integrated with IAM/ALB/CloudWatch. **Amazon EKS** — managed Kubernetes; the answer when the question mentions **Kubernetes specifically, portability, or existing k8s tooling/skills**. Both can run on **EC2 launch type** (you own and pay for the instances, can use Spot/RIs, get control over the host) or **Fargate launch type** (serverless, per-task billing, no host to patch).

**ECS task role vs execution role**: the *task* role grants permissions to your application code; the *execution* role lets the ECS agent pull the image from ECR and write logs. Confusing them is a classic distractor.

**AWS Batch** — managed batch computing for large-scale jobs, handles queuing and instance provisioning (often on Spot). The answer for "thousands of long-running batch jobs."

**AWS Elastic Beanstalk** — PaaS. You upload code, it provisions EC2/ALB/ASG for you. The answer for "developers want to deploy without learning infrastructure," while retaining full access to the resources underneath.

**AWS Step Functions** — orchestrates multi-step workflows as a state machine, with retries, error handling, parallel branches, and waits. The answer for "coordinate several Lambdas," "long-running workflow with human approval," or anything needing visual workflow state.

## Examples
```
Duration and shape decide the compute:

< 15 min, event-driven, spiky            → Lambda
> 15 min, containerized                  → Fargate / ECS / EKS
Thousands of queued batch jobs           → AWS Batch (often on Spot)
Existing Kubernetes manifests + skills   → EKS
Simple containers, all-in on AWS         → ECS
"Just deploy my code, handle the rest"   → Elastic Beanstalk
Coordinate steps, retries, wait states   → Step Functions
Steady 24/7 load, need OS control        → EC2 (+ Savings Plan)
```

```
Fargate vs EC2 launch type:

                 Fargate                   EC2 launch type
Patch the host?  No — AWS does             Yes, you do
Billing          per vCPU/GB per second    per instance-hour
Spot?            Fargate Spot exists       Full Spot/RI/Savings Plans
Best for         variable, bursty, small   dense steady load, GPU, cost floor
Daemon/agents    limited                   full control
```

```
Step Functions replacing a chain of Lambdas calling Lambdas:

  [Validate] → [Charge Card] → choice ─ success → [Ship]
                    │                  └ failure → [Notify] → [Refund]
                    └── retry 3x with exponential backoff (declarative, no code)
```

## Related Topics
- Serverless architecture and cold starts
- Container orchestration
- Event-driven design
- Microservices
- Workflow orchestration / sagas

## Cards

```anki
START
Basic
Lambda: A data transformation takes 45 minutes. Why can't it be Lambda, and what replaces it?
Back: Lambda's hard maximum is a 15-minute timeout. Use Fargate/ECS, AWS Batch, or split the work with Step Functions.
This limit is the exam's most common disqualifier.
<!--ID: 1788139021071-->
Tags: cantrill::containers-ecs
END

START
Basic
Lambda: A Lambda is CPU-bound and too slow. What's the counterintuitive tuning knob?
Back: Increase its MEMORY. Lambda allocates CPU proportionally to memory, so more memory = more CPU. It can even get cheaper, since it finishes faster.
<!--ID: 1788139021075-->
Tags: cantrill::serverless-app
END

START
Basic
Lambda: Users complain about latency on the first request after idle periods. Diagnosis and fix?
Back: Cold starts. Fix with provisioned concurrency, which keeps initialized execution environments warm.
<!--ID: 1788139021080-->
Tags: cantrill::serverless-app
END

START
Basic
Serverless: When does the exam want EKS instead of ECS?
Back: When the question names Kubernetes explicitly, or stresses portability / existing k8s manifests and team skills. Otherwise ECS is the simpler, better-integrated answer.
<!--ID: 1788139021084-->
Tags: cantrill::containers-ecs
END

START
Basic
Containers: What's the difference between an ECS task role and an execution role?
Back: Task role = permissions for YOUR application code (e.g. read S3). Execution role = permissions for the ECS AGENT to pull the image from ECR and push logs.
<!--ID: 1788139021088-->
Tags: cantrill::containers-ecs
END

START
Basic
Containers: When is the EC2 launch type better than Fargate?
Back: Dense, steady, predictable load where RIs/Savings Plans beat per-task pricing — or when you need GPU, host-level agents, or custom kernel settings.
Fargate wins for bursty, variable, small workloads.
<!--ID: 1788139021092-->
Tags: cantrill::ec2-basics
END

START
Basic
Serverless: "Developers should deploy a Java web app without managing infrastructure, but ops still needs access to the EC2 instances." Which service?
Back: Elastic Beanstalk — it provisions and manages EC2/ALB/ASG for you while leaving the underlying resources fully accessible.
<!--ID: 1788139021097-->
Tags: cantrill::ha-scaling
END

START
Basic
Step Functions: You see "coordinate multiple Lambdas with retries, branching, and a wait for human approval." Which service, and why not just chain Lambdas?
Back: Step Functions. Chained Lambdas mean hand-written retry/error logic, no visibility into workflow state, and each hop burns its own 15-min budget.
<!--ID: 1788139021102-->
Tags: cantrill::serverless-app
END

START
Basic
Lambda: You attach a Lambda to a VPC so it can reach RDS, and its S3 calls start timing out. Why?
Back: A VPC-attached Lambda loses default internet access. It needs a NAT gateway in a private subnet — or better, a VPC gateway endpoint for S3.
<!--ID: 1788139021107-->
Tags: cantrill::advanced-vpc
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
