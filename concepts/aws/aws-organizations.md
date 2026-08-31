---
tags: [aws, saa-c03, security, governance, domain-1]
category: aws
related: [aws-iam, aws-cost-optimization, aws-monitoring-governance]
---
TARGET DECK: Study::AWS::Foundations

## Description
**AWS Organizations** groups multiple AWS accounts under one management (payer) account, arranged into **Organizational Units (OUs)**. Accounts are the strongest isolation boundary AWS offers — stronger than IAM, VPCs, or tags — so "separate the environments" almost always means "separate accounts," not "separate VPCs."

Two headline benefits. **Consolidated billing**: one bill, and — the part the exam loves — volume discounts and Reserved Instance / Savings Plans commitments are **shared across every account in the org**, so an unused RI in one account automatically covers matching usage in another. **Service Control Policies (SCPs)**: org-wide guardrails attached to the root, an OU, or an account.

The critical SCP rule: **an SCP never grants permission — it only sets the ceiling.** A principal's effective permission is the intersection of the SCP and its IAM policy. An SCP also **does not apply to the management account**, which is why best practice is to keep the management account empty of workloads.

**AWS Control Tower** sits on top: it sets up a multi-account landing zone for you — Organizations, an audit and log-archive account, IAM Identity Center, and preventive (SCP) plus detective (Config) **guardrails**. When a question describes "quickly stand up a compliant, governed multi-account environment," Control Tower is the answer, not hand-rolled Organizations.

**AWS RAM (Resource Access Manager)** shares actual resources across accounts — most importantly VPC subnets, Transit Gateways, and Route 53 Resolver rules — so accounts share one network instead of building peering meshes.

## Examples
```
Root
 ├── Management account (payer)      <-- SCPs DO NOT apply here. Keep it empty.
 ├── OU: Security
 │     ├── Log Archive account        (CloudTrail org trail lands here)
 │     └── Audit account              (GuardDuty/Config aggregation)
 ├── OU: Production
 │     └── SCP: deny leaving the org, deny disabling CloudTrail,
 │              deny all Regions except us-east-1 / eu-west-1
 └── OU: Sandbox
       └── SCP: deny expensive instance families, deny prod data access
```

The intersection rule in practice:
```
SCP on OU:Production      = Deny  ec2:*  outside us-east-1
Developer's IAM policy    = Allow ec2:RunInstances  in every Region
                            ─────────────────────────────────────
Result: can launch ONLY in us-east-1.
The IAM Allow cannot widen past the SCP ceiling.
```

## Related Topics
- IAM policy evaluation
- Multi-account strategy and blast radius
- Consolidated billing and Reserved Instance sharing
- Landing zones
- Tag policies

## Cards

```anki
START
Basic
AWS Organizations: Why is a separate AWS account a stronger isolation boundary than a separate VPC?
Back: Account boundaries isolate IAM, billing, service quotas, and blast radius — not just networking. A VPC only separates the network.
This is why "isolate dev from prod" → separate accounts.
<!--ID: 1788139020786-->
END

START
Basic
AWS Organizations: An SCP allows S3 but the user has no IAM policy. What can they do?
Back: Nothing. SCPs never grant — they only cap. You still need an IAM Allow underneath.
Effective = SCP ∩ IAM policy.
<!--ID: 1788139020793-->
END

START
Basic
AWS Organizations: Which account do SCPs NOT apply to, and what's the design consequence?
Back: The management (payer) account. So you keep it empty of workloads — anything running there is ungoverned by your own guardrails.
<!--ID: 1788139020800-->
END

START
Basic
AWS Organizations: A company buys a Reserved Instance in the dev account but dev is idle. What happens under consolidated billing?
Back: The RI discount automatically applies to matching usage in any other account in the org. RIs and Savings Plans pool org-wide.
A classic cost-optimization answer.
<!--ID: 1788139020806-->
END

START
Basic
AWS Organizations: You see "quickly set up a governed, compliant multi-account environment with guardrails." Which service?
Back: AWS Control Tower — it provisions the landing zone (Organizations, log archive + audit accounts, Identity Center, preventive and detective guardrails) rather than making you assemble it.
<!--ID: 1788139020813-->
END

START
Basic
AWS Organizations: Ten accounts each need to run workloads in the same VPC subnets. Peering mesh or something better?
Back: AWS RAM — share the subnets from one central networking account. Avoids an O(n²) peering mesh and duplicate NAT gateways.
<!--ID: 1788139020820-->
END

START
Basic
AWS Organizations: How do you stop any account in the org from disabling CloudTrail — permanently, even for admins?
Back: An SCP denying `cloudtrail:StopLogging` / `DeleteTrail`, attached to the root or OU. Account-level admins cannot override an SCP.
<!--ID: 1788139020827-->
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
