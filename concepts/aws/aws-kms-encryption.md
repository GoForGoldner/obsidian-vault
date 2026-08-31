---
tags: [aws, saa-c03, security, encryption, domain-1]
category: aws
related: [aws-iam, aws-s3, aws-security-services, tls(transport layer security)]
---
TARGET DECK: Study::AWS::Security

## Description
Domain 1 is 30% of the exam and encryption is a large slice of it. The framing: **encryption at rest** (data on disk) vs **encryption in transit** (data on the wire).

**AWS KMS** — managed keys for encryption at rest across nearly every AWS service. Keys never leave KMS unencrypted. Three key types:
- **AWS-owned** — invisible, free, no control.
- **AWS-managed** (`aws/s3`, `aws/ebs`) — free, auto-rotated annually, you can't edit the policy.
- **Customer-managed (CMK)** — you control the **key policy**, rotation, and can disable/schedule deletion. The answer whenever the question wants **key control, custom rotation, cross-account key sharing, or an audit trail**.

Two KMS facts the exam leans on: every KMS key is **Regional** — to use encrypted data in another Region you must re-encrypt with a key there (this is why **copying an encrypted snapshot cross-Region requires specifying a destination-Region key**). And access needs **both** an IAM policy *and* the **key policy** to allow it — the key policy is the ultimate authority on a KMS key.

**AWS CloudHSM** — a **single-tenant, FIPS 140-2 Level 3 dedicated hardware security module** where **AWS has no access to your keys**. The answer only when the question demands dedicated hardware, full key custody, or FIPS 140-2 Level 3.

**Secrets Manager vs SSM Parameter Store** — a guaranteed question:

| | **Secrets Manager** | **Parameter Store** |
|---|---|---|
| Cost | Per secret/month | **Free** (standard tier) |
| **Automatic rotation** | **Yes, built-in** (Lambda) | No native rotation |
| Native RDS integration | Yes | No |
| Best for | DB credentials, API keys needing rotation | Config values, non-rotating secrets |

If the question says **"automatically rotate database credentials"** → **Secrets Manager**. If it says "store configuration cheaply" → Parameter Store.

**ACM (AWS Certificate Manager)** — free public TLS certificates with **automatic renewal**, for encryption *in transit*. Integrates with ALB, CloudFront, API Gateway — but **not** directly on EC2. **CloudFront requires the certificate be in `us-east-1`**, regardless of where the rest of the stack lives.

EBS volumes, RDS instances, and S3 buckets can all be encrypted at rest with KMS transparently — with one gotcha: **you cannot encrypt an existing unencrypted RDS instance in place.** You snapshot it, copy the snapshot with encryption enabled, and restore.

## Examples
```
Which key service:

"AWS manages everything, we just want it encrypted"   → SSE-S3 / AWS-managed key
"We control rotation and need CloudTrail audit"       → Customer-managed KMS key
"Dedicated hardware, FIPS 140-2 Level 3, AWS
 must not be able to access our keys"                 → CloudHSM
"Rotate the RDS password every 30 days automatically" → Secrets Manager
"Store a non-secret config string for free"           → Parameter Store
"Free TLS cert on our ALB, auto-renewed"              → ACM
```

```
Encrypting an existing unencrypted RDS instance:

  ✗ Toggle "encryption" on the running instance      ← not possible
  ✓ 1. Take a snapshot
    2. COPY the snapshot, checking "enable encryption" + KMS key
    3. Restore a NEW instance from the encrypted copy
    4. Cut over

Same shape for an unencrypted EBS volume: snapshot → encrypted copy → new volume.
```

```
Two doors on every KMS key:

  Caller ──► IAM policy      (does this principal have kms:Decrypt?)
        └──► KMS key policy  (does this KEY allow this principal?)

  BOTH must allow. The key policy is authoritative — an admin with
  full IAM access still can't use a key whose policy excludes them.
```

## Related Topics
- Encryption at rest vs in transit
- Key rotation and key custody
- FIPS compliance levels
- Envelope encryption
- TLS certificates

## Cards

```anki
START
Basic
KMS: When do you need a customer-managed key instead of an AWS-managed one?
Back: When you need control over the key policy, custom rotation schedules, cross-account key sharing, or the ability to disable/delete the key.
AWS-managed keys are free but uneditable.
<!--ID: 1788139020835-->
END

START
Basic
KMS: Why can't you copy an encrypted EBS snapshot to another Region without extra steps?
Back: KMS keys are Regional. The copy must be re-encrypted with a KMS key that exists in the destination Region — you specify it during the copy.
<!--ID: 1788139020842-->
END

START
Basic
KMS: An admin with full IAM permissions gets AccessDenied using a KMS key. Why?
Back: The KMS key policy doesn't allow them. Access needs BOTH the IAM policy and the key policy — and the key policy is the authoritative one.
<!--ID: 1788139020848-->
END

START
Basic
Encryption: The requirement is FIPS 140-2 Level 3 with dedicated hardware and AWS having no access to the keys. KMS or CloudHSM?
Back: CloudHSM — single-tenant dedicated HSM under your sole control. KMS is multi-tenant (FIPS 140-2 Level 3 validated HSMs, but AWS-operated).
<!--ID: 1788139020855-->
END

START
Basic
Secrets: "Database credentials must rotate automatically every 30 days." Secrets Manager or Parameter Store?
Back: Secrets Manager — native automatic rotation via Lambda, with built-in RDS integration. Parameter Store has no native rotation.
<!--ID: 1788139020862-->
END

START
Basic
Secrets: When is Parameter Store the better answer despite having fewer features?
Back: When you're storing plain configuration or non-rotating values and cost matters — the standard tier is free, while Secrets Manager bills per secret per month.
<!--ID: 1788139020869-->
END

START
Basic
ACM: A CloudFront distribution needs a TLS certificate. What's the Region gotcha?
Back: The ACM certificate MUST be in us-east-1 for CloudFront, no matter where the origin or the rest of the stack lives.
<!--ID: 1788139020876-->
END

START
Basic
Encryption: An existing RDS instance is unencrypted and must be encrypted. What's the procedure?
Back: You can't encrypt in place. Snapshot it, copy the snapshot with encryption enabled, restore a new instance from that copy, then cut over.
<!--ID: 1788139020884-->
END

START
Basic
ACM: Why can't you use an ACM public certificate directly on an EC2 instance?
Back: ACM public certs can only be deployed to integrated services — ALB/NLB, CloudFront, API Gateway. EC2 can't export the private key, so you'd need your own cert or ACM Private CA.
<!--ID: 1788139020891-->
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
