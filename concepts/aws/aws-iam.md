---
tags: [aws, saa-c03, security, iam, domain-1]
category: aws
related: [aws-organizations, aws-kms-encryption, aws-global-infrastructure, aws-security-services]
---
TARGET DECK: Study::AWS::Foundations

## Description
IAM controls **who** (principal) can do **what** (action) to **which** resource, under **what conditions**. It is global, free, and the single heaviest topic on the exam — Domain 1 is 30% of scored content and IAM is most of it.

The four primitives: **Users** (long-lived humans/credentials), **Groups** (collections of users; cannot be nested and cannot be a principal), **Roles** (temporary credentials assumed by anyone — an EC2 instance, a Lambda function, a user in another account, a federated identity), and **Policies** (JSON documents granting/denying permissions).

The exam's favourite answer is almost always **"use an IAM role"** — never access keys on an instance, never a shared user, never keys in code or environment variables. Roles issue short-lived credentials via **STS** (`AssumeRole`) that rotate automatically.

Policy evaluation is the other constant: **explicit Deny > explicit Allow > implicit Deny (default)**. Nothing is permitted unless something allows it, and a single Deny anywhere in the chain wins outright.

Two policy families matter. **Identity-based** policies attach to a user/group/role and say "this principal can do X." **Resource-based** policies attach to the resource (S3 bucket policy, SQS queue policy, KMS key policy) and say "this principal may touch me" — crucially, resource-based policies name a `Principal`, identity-based ones do not. **Cross-account access needs both sides to agree** (except where a resource policy alone suffices, like an S3 bucket policy granting another account).

Guardrails that only ever *subtract*: **Permission boundaries** (max permissions an identity policy can grant) and **SCPs** from Organizations. Neither grants anything on its own — effective permissions are the intersection.

## Examples
Anatomy of a policy statement — the five fields the exam tests:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::reports/*",
    "Condition": {"IpAddress": {"aws:SourceIp": "10.0.0.0/16"}}
  }]
}
```

Role assumption, the pattern behind nearly every "cross-account" answer:
```
Account A (dev)                       Account B (prod)
  User: tyler                           Role: ProdReadOnly
    │                                     ├─ Trust policy:  "Principal: arn:aws:iam::A:user/tyler"   <-- WHO may assume
    │  sts:AssumeRole ──────────────────► └─ Permission policy: "Allow s3:GetObject"                 <-- WHAT they then get
    │
    └── receives temporary creds (15 min – 12 hr), auto-expiring

BOTH are required: A's policy must allow sts:AssumeRole, B's trust policy must name A.
```

Effective permissions are an intersection, not a union:
```
SCP allows:                {S3, EC2, RDS}
Permission boundary:       {S3, EC2}
Identity policy grants:    {S3, DynamoDB}
                           ────────────────
Effective:                 {S3}          <-- DynamoDB blocked by boundary, RDS never granted
```

## Related Topics
- AWS STS and temporary credentials
- Service control policies (SCPs)
- Principle of least privilege
- Federation, SAML, and IAM Identity Center
- Resource-based vs identity-based policies

## Cards

```anki
START
Basic
IAM: An application on EC2 needs S3 access. The options include "store access keys in the AMI" and "attach an IAM role." Why is the role always right?
Back: Roles deliver short-lived, auto-rotating credentials via STS. Access keys are long-lived, get baked into images, leak into git, and must be rotated by hand.
"Store credentials anywhere" is a distractor by construction.
<!--ID: 1788139020536-->
END

START
Basic
IAM: State the policy evaluation order, and what it means when two policies conflict.
Back: Explicit Deny > explicit Allow > implicit Deny (the default).
One Deny anywhere wins outright — you cannot out-Allow a Deny.
<!--ID: 1788139020544-->
END

START
Basic
IAM: What does a resource-based policy have that an identity-based policy does not?
Back: A `Principal` field — it names WHO may act on it. Identity policies are already attached to the principal, so they omit it.
This is the fastest way to tell the two apart in an exam JSON snippet.
<!--ID: 1788139020551-->
END

START
Basic
IAM: For cross-account access via AssumeRole, what must be true on BOTH sides?
Back: The target account's role needs a trust policy naming the source principal; the source principal needs an identity policy allowing `sts:AssumeRole`.
One side alone silently fails — a very common distractor.
<!--ID: 1788139020558-->
END

START
Basic
IAM: When do you use a permission boundary instead of just writing a tighter identity policy?
Back: When you're delegating permission-granting — letting a dev team create their own roles, but capping what those roles can ever receive.
Boundaries only subtract; they never grant.
<!--ID: 1788139020579-->
END

START
Basic
IAM: A company already has 5,000 employees in on-prem Active Directory and wants AWS console access. What do you NOT do?
Back: Do not create 5,000 IAM users. Federate — IAM Identity Center (or SAML 2.0 to IAM roles) — so AD stays the source of truth and users assume roles.
"Create an IAM user for each" is always wrong at scale.
<!--ID: 1788139020588-->
END

START
Basic
IAM: A user is in a group that Allows S3, and an SCP on their account denies S3. What can they do?
Back: Nothing in S3. Effective permissions are the intersection of SCP ∩ boundary ∩ identity policy — and an SCP Deny is absolute.
<!--ID: 1788139020595-->
END

START
Basic
IAM: Why is an IAM group never the answer to "how does the Lambda function get access?"
Back: Groups can't be a principal — nothing assumes a group. Only roles issue credentials to services.
Groups exist purely to attach policies to human users.
<!--ID: 1788139020602-->
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
