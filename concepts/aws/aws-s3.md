---
tags: [aws, saa-c03, storage, cost, security, domain-1, domain-3, domain-4]
category: aws
related: [aws-storage-services, aws-kms-encryption, aws-cost-optimization, aws-iam]
---
TARGET DECK: Study::AWS::Storage

## Description
S3 is **object storage** — flat namespace of buckets and keys, effectively unlimited, 11 nines of durability, accessed over HTTP. It is not a filesystem: you cannot mount it, and you cannot modify part of an object (every write replaces the whole object). Max object size 5 TB; anything over 5 GB requires **multipart upload**.

**Storage classes** are pure Domain-4 material. The decision hinges on **access frequency** and **retrieval time tolerance**:

| Class | Use when | Retrieval | Min duration |
|---|---|---|---|
| **Standard** | Frequently accessed | ms | — |
| **Intelligent-Tiering** | **Access pattern unknown/changing** | ms | — |
| **Standard-IA** | Infrequent but needs instant access | ms | 30 days |
| **One Zone-IA** | Infrequent + **reproducible** (single AZ) | ms | 30 days |
| **Glacier Instant Retrieval** | Archive, still needs ms access | ms | 90 days |
| **Glacier Flexible Retrieval** | Archive, minutes to hours OK | 1 min – 12 hr | 90 days |
| **Glacier Deep Archive** | Long-term compliance, cheapest | **12 hours** | 180 days |

Two traps: **Intelligent-Tiering is the answer whenever the access pattern is unpredictable** (it auto-moves objects, small monitoring fee, no retrieval charges), and **One Zone-IA is only acceptable for data you can regenerate** — it lives in a single AZ.

**Lifecycle policies** automate transitions ("Standard → Standard-IA after 30 days → Glacier after 90 → delete after 7 years"). Nearly every "reduce storage cost over time" answer is a lifecycle policy.

**Encryption**: **SSE-S3** (AWS-managed keys, default, zero effort), **SSE-KMS** (your KMS key — gives you an **audit trail in CloudTrail** and key rotation control; the answer when the question wants key control or auditing, but watch KMS request throttling on high-volume workloads), **SSE-C** (you supply the key each request), and **client-side**. All new buckets encrypt by default with SSE-S3.

**Access control**: bucket policies (resource-based, the usual answer for cross-account), IAM policies, **Block Public Access** (on by default, the fix for "bucket is publicly exposed"), and **presigned URLs** — time-limited URLs that grant temporary access to a private object without changing any permission. Presigned URLs are the answer for "let a user download/upload one private file temporarily."

**Versioning** protects against accidental deletion and overwrite (a delete creates a *delete marker*). **MFA Delete** adds a second factor for permanent deletion. **Object Lock** (WORM) enforces write-once-read-many for **regulatory compliance** — the answer for "records must be immutable for 7 years."

**Replication**: **CRR** (cross-Region — DR, latency, compliance) and **SRR** (same-Region — log aggregation, prod→test). Both **require versioning on both buckets** and are **asynchronous**. Replication is **not retroactive** — existing objects need S3 Batch Replication.

**Transfer Acceleration** routes uploads through the nearest edge location onto the AWS backbone — for slow long-distance uploads. **Requester Pays** shifts data transfer cost to the requester — for sharing large datasets.

## Examples
```
Lifecycle policy for logs — the classic cost answer:

Day 0    S3 Standard              (actively queried)
Day 30   → Standard-IA            (occasional investigation)
Day 90   → Glacier Flexible       (rarely touched)
Day 365  → Glacier Deep Archive   (compliance retention only)
Day 2555 → Expire (delete)        (7-year retention met)
```

```
Encryption picker:

"Simplest, AWS handles everything"           → SSE-S3
"We must control/rotate the key and audit
 every use of it in CloudTrail"              → SSE-KMS
"Keys never leave our premises"              → SSE-C or client-side
"Millions of objects/sec, KMS is throttling" → SSE-S3 (or S3 Bucket Keys to cut KMS calls)
```

```
Access patterns:

"Let this one user download a private file for 1 hour"  → Presigned URL
"Another AWS account needs read on the bucket"          → Bucket policy
"Bucket accidentally public — lock it down"             → Block Public Access
"Serve to the world cheaply and fast"                   → CloudFront + OAC (bucket stays private)
"Data must be immutable for 7 years (SEC 17a-4)"        → Object Lock, compliance mode
```

## Related Topics
- Object vs block vs file storage
- Data lifecycle management
- Encryption at rest and key management
- WORM / regulatory retention
- Cross-Region replication and DR

## Cards

```anki
START
Basic
S3: The access pattern for a dataset is unpredictable and changes month to month. Which storage class?
Back: S3 Intelligent-Tiering — it moves objects between tiers automatically for a small monitoring fee, with no retrieval charges.
"Unknown or changing access pattern" is its signature phrase.
<!--ID: 1788139021010-->
END

START
Basic
S3: When is One Zone-IA acceptable, and when is it a trap?
Back: Acceptable only for reproducible data (thumbnails, derived files, secondary copies). It's a trap for anything irreplaceable — it lives in a single AZ and an AZ loss destroys it.
<!--ID: 1788139021017-->
END

START
Basic
S3: A compliance rule says records must be retrievable but access can take up to 12 hours, kept 10 years. Which class?
Back: S3 Glacier Deep Archive — cheapest, ~12-hour retrieval, 180-day minimum. The stated tolerance for hours of delay is the tell.
<!--ID: 1788139021023-->
END

START
Basic
S3: You need to give one external user temporary access to a single private object. What do you NOT do?
Back: Don't make the bucket public and don't create an IAM user. Generate a presigned URL — time-limited, object-scoped, no permission changes.
<!--ID: 1788139021029-->
END

START
Basic
S3: When is SSE-KMS worth it over SSE-S3?
Back: When you need control over key rotation/policy, or an audit trail of every decrypt in CloudTrail. Cost: KMS API charges and possible throttling at very high request rates (mitigate with S3 Bucket Keys).
<!--ID: 1788139021035-->
END

START
Basic
S3: You enable cross-Region replication and the existing 2 TB doesn't appear in the destination. Why?
Back: Replication only applies to objects written AFTER it's enabled. Use S3 Batch Replication to backfill existing objects.
<!--ID: 1788139021041-->
END

START
Basic
S3: What are the two prerequisites for any S3 replication?
Back: Versioning enabled on BOTH source and destination buckets, plus an IAM role S3 can assume to replicate.
<!--ID: 1788139021047-->
END

START
Basic
S3: "Financial records must be immutable and undeletable for 7 years, even by admins." Which feature and mode?
Back: S3 Object Lock in COMPLIANCE mode — not even the root user can shorten or remove the retention. Governance mode allows privileged override, so it doesn't satisfy a hard regulatory requirement.
<!--ID: 1788139021052-->
END

START
Basic
S3: Users in Asia upload large files to a us-east-1 bucket and it's slow. Fix?
Back: S3 Transfer Acceleration — uploads enter at the nearest edge location and travel the AWS backbone instead of the public internet.
<!--ID: 1788139021057-->
END

START
Basic
S3: You want to serve S3 content via CloudFront but keep the bucket private. What connects them?
Back: Origin Access Control (OAC) — CloudFront gets a bucket-policy grant, and Block Public Access stays on. (OAI is the legacy predecessor.)
<!--ID: 1788139021061-->
END

START
Basic
S3: Versioning is on and someone deletes an object. What actually happened, and how do you undo it?
Back: S3 wrote a delete marker as the new current version; the old version is intact. Delete the delete marker to restore it.
<!--ID: 1788139021066-->
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
