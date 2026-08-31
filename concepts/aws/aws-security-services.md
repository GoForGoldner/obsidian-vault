---
tags: [aws, saa-c03, security, domain-1]
category: aws
related: [aws-iam, aws-kms-encryption, aws-vpc, aws-monitoring-governance]
---
TARGET DECK: Study::AWS::Security

## Description
A pile of security services the exam tests almost purely as **name → job** matching. Learn the one-line job of each and most Domain 1 questions become trivial.

**Threat detection and findings**
- **GuardDuty** — intelligent **threat detection** from CloudTrail, VPC Flow Logs, and DNS logs. Detects crypto-mining, compromised credentials, port scans. No agents. "Detect malicious activity/unusual behaviour" → GuardDuty.
- **Amazon Macie** — discovers and classifies **sensitive data (PII)** in **S3**. "Find credit card numbers / PII in our buckets" → Macie.
- **Amazon Inspector** — automated **vulnerability scanning** of EC2, container images in ECR, and Lambda (CVEs, unintended network exposure). "Scan for software vulnerabilities" → Inspector.
- **AWS Security Hub** — **aggregates** findings from GuardDuty, Macie, Inspector, and Config into one dashboard, scored against standards (CIS, PCI DSS). "Single pane of glass for security posture" → Security Hub.
- **Amazon Detective** — **investigates** the root cause of findings by graphing relationships.

**Network protection**
- **AWS WAF** — Layer 7 web firewall on CloudFront, ALB, API Gateway, AppSync. Blocks **SQL injection, XSS**, bad bots, and does **rate limiting by IP**. "Block SQLi/XSS" → WAF.
- **AWS Shield Standard** — free, automatic, Layer 3/4 **DDoS** protection for everyone.
- **AWS Shield Advanced** — paid ($3k/mo): Layer 7 DDoS protection, 24/7 DDoS Response Team, and **cost protection against scaling charges during an attack**. "Guaranteed DDoS support + billing protection" → Shield Advanced.
- **AWS Network Firewall** — stateful managed firewall for a whole VPC.
- **AWS Firewall Manager** — centrally manages WAF/Shield/Network Firewall rules **across an Organization**.

**Identity for applications**
- **Amazon Cognito** — user sign-up/sign-in for **your app's end users**. **User Pools** = the user directory (authentication, MFA, social/SAML login). **Identity Pools** = exchange that identity for **temporary AWS credentials**. IAM is for *your* people and services; Cognito is for *your application's customers*.
- **AWS Directory Service** — managed Microsoft AD / AD Connector for joining Windows workloads to a directory.

**Compliance**
- **AWS Artifact** — self-service portal for AWS's **compliance reports** (SOC, PCI, ISO). "We need AWS's SOC 2 report for our auditor" → Artifact.
- **AWS Audit Manager** — continuously collects evidence for audits.

## Examples
```
Name → job, the fast table:

Unusual API calls / crypto-mining / compromised creds  → GuardDuty
PII sitting in S3 buckets                              → Macie
CVEs in EC2 / ECR images / Lambda                      → Inspector
One dashboard aggregating all of the above             → Security Hub
Root-cause investigation of a finding                  → Detective
SQL injection, XSS, bad bots, per-IP rate limit        → WAF
Layer 3/4 DDoS, free and automatic                     → Shield Standard
Layer 7 DDoS + response team + bill protection         → Shield Advanced
Same WAF rules across 50 accounts                      → Firewall Manager
Sign-up/sign-in for a mobile app's users               → Cognito User Pool
Give those users temporary AWS credentials             → Cognito Identity Pool
Auditor wants AWS's SOC 2 report                       → Artifact
```

```
The Cognito split, which the exam loves:

  Mobile user ─► [User Pool]  authenticate (username/pw, Google, SAML)
                     │ returns JWT
                     ▼
                [Identity Pool]  exchange JWT for temporary AWS creds via STS
                     │
                     ▼
                direct, scoped access to S3 / DynamoDB
```

## Related Topics
- Defense in depth
- Threat detection vs vulnerability management
- DDoS mitigation
- OAuth/OIDC and identity federation
- Compliance frameworks

## Cards

```anki
START
Basic
Security: Someone needs to find credit card numbers accidentally stored in S3. Which service?
Back: Amazon Macie — sensitive data discovery and classification for S3. GuardDuty detects threats; Macie classifies data.
<!--ID: 1788139021112-->
END

START
Basic
Security: Unusual API calls suggest an IAM credential is compromised. Which service detects this?
Back: GuardDuty — it analyzes CloudTrail, VPC Flow Logs, and DNS logs for malicious or anomalous behaviour, with no agents to install.
<!--ID: 1788139021117-->
END

START
Basic
Security: You need to know which EC2 instances are running software with known CVEs. Which service?
Back: Amazon Inspector — automated vulnerability scanning for EC2, ECR images, and Lambda.
<!--ID: 1788139021121-->
END

START
Basic
Security: The application is being hit with SQL injection attempts. What blocks them, and where does it attach?
Back: AWS WAF — attaches to CloudFront, ALB, API Gateway, or AppSync. Security groups and NACLs work at layers 3/4 and can't inspect the request payload.
<!--ID: 1788139021125-->
END

START
Basic
Security: What does Shield Advanced give you that Shield Standard doesn't?
Back: Layer 7 DDoS protection, 24/7 access to the DDoS Response Team, and cost protection for scaling charges incurred during an attack.
Standard is free, automatic, and Layer 3/4 only.
<!--ID: 1788139021130-->
END

START
Basic
Cognito: What's the difference between a User Pool and an Identity Pool?
Back: User Pool = the user directory that authenticates (returns a JWT). Identity Pool = exchanges that identity for temporary AWS credentials via STS so the user can call AWS services directly.
<!--ID: 1788139021142-->
END

START
Basic
Security: A mobile app needs sign-up, sign-in, and social login for a million end users. Why not IAM users?
Back: IAM is for your organization's people and workloads, and caps at 5,000 users. Cognito is purpose-built for application end users at any scale.
<!--ID: 1788139021149-->
END

START
Basic
Security: An auditor asks for AWS's SOC 2 and PCI compliance reports. Where do you get them?
Back: AWS Artifact — the self-service portal for AWS's own compliance documentation.
<!--ID: 1788139021153-->
END

START
Basic
Security: You have 40 accounts and need identical WAF rules enforced everywhere. Which service?
Back: AWS Firewall Manager — centrally deploys and enforces WAF, Shield, and Network Firewall policies across an Organization.
<!--ID: 1788139021158-->
END

START
Basic
Security: GuardDuty, Macie, Inspector, and Config all produce findings. What consolidates them?
Back: AWS Security Hub — aggregates findings into one dashboard and scores them against standards like CIS and PCI DSS.
<!--ID: 1788139021163-->
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
