---
tags: [aws, saa-c03, networking, security, domain-1, domain-3]
category: aws
related: [aws-hybrid-connectivity, aws-elastic-load-balancing, aws-route-53, nat, aws-iam]
---
TARGET DECK: Study::AWS::Networking

## Description
A **VPC** is a logically isolated virtual network in one Region, defined by a CIDR block (`/16` to `/28`). It is carved into **subnets**, and **a subnet lives in exactly one AZ** — which is why "make it highly available" always translates to "use subnets in at least two AZs."

A subnet is **public** if its route table has a route to an **Internet Gateway (IGW)**; that's the only thing that makes it public. Instances there also need a public IP or Elastic IP. A **private** subnet routes outbound internet traffic through a **NAT Gateway** that sits in a *public* subnet — NAT lets private instances reach out but blocks anything reaching in.

**NAT Gateway vs NAT instance** is a guaranteed exam question: NAT Gateway is AWS-managed, scales to 45 Gbps, is AZ-scoped (so put one per AZ for HA, though a single shared one is cheaper), and cannot have a security group. A NAT instance is a self-managed EC2, cheaper at tiny scale, but a single point of failure you must patch.

**Security Groups vs NACLs** is the other guaranteed question:

| | Security Group | NACL |
|---|---|---|
| Attaches to | ENI / instance | Subnet |
| State | **Stateful** — return traffic auto-allowed | **Stateless** — must allow return traffic explicitly |
| Rules | Allow only | Allow **and Deny** |
| Evaluation | All rules together | In numbered order, first match wins |
| Default | Deny all in, allow all out | Default NACL allows all |

Because NACLs are the only place you can write a **Deny**, "block this specific malicious IP" is always a NACL, never a security group.

**VPC Endpoints** keep traffic to AWS services off the public internet. **Gateway endpoints** (free — S3 and DynamoDB only) are route-table entries. **Interface endpoints / PrivateLink** (hourly + per-GB cost) put an ENI with a private IP in your subnet, and work for nearly every other service, including services you expose to other accounts.

**VPC Peering** is one-to-one, non-transitive, and requires non-overlapping CIDRs. **Transit Gateway** is the hub-and-spoke fix when you have many VPCs — it *is* transitive and replaces an O(n²) peering mesh.

## Examples
```
VPC 10.0.0.0/16  (Region us-east-1)
│
├── AZ us-east-1a
│    ├── Public  subnet 10.0.1.0/24   → route 0.0.0.0/0 → IGW      [ALB, NAT GW]
│    └── Private subnet 10.0.11.0/24  → route 0.0.0.0/0 → NAT GW   [app servers]
│
├── AZ us-east-1b
│    ├── Public  subnet 10.0.2.0/24   → route 0.0.0.0/0 → IGW
│    └── Private subnet 10.0.12.0/24  → route 0.0.0.0/0 → NAT GW
│
└── Isolated subnets 10.0.21.0/24     → NO 0.0.0.0/0 route         [RDS]
     └── Gateway endpoint → S3        (stays on the AWS backbone, free)
```

Stateful vs stateless, made concrete — a web server on port 443:
```
Security Group (stateful):
  Inbound:  allow tcp/443 from 0.0.0.0/0
  Outbound: (nothing needed — the response is automatically allowed)

NACL (stateless):
  Inbound  rule 100: allow tcp/443 from 0.0.0.0/0
  Outbound rule 100: allow tcp/1024-65535 to 0.0.0.0/0   <-- REQUIRED, ephemeral ports
                     forget this and every response is silently dropped
```

AWS reserves **5 IPs per subnet** (`.0` network, `.1` router, `.2` DNS, `.3` future, `.255` broadcast), so a `/24` gives you 251 usable, not 256.

## Related Topics
- NAT and private addressing
- Stateful vs stateless firewalls
- CIDR notation and subnetting
- Network segmentation / defense in depth
- Transit Gateway and hub-and-spoke topologies

## Cards

```anki
START
Basic
VPC: What single thing makes a subnet "public"?
Back: A route to an Internet Gateway (0.0.0.0/0 → igw) in its route table. Nothing else — not the name, not the CIDR.
Instances also need a public or Elastic IP to be reachable.
<!--ID: 1788139021228-->
END

START
Basic
VPC: Private instances need to download OS patches from the internet. What do you add, and where does it go?
Back: A NAT Gateway — placed in a PUBLIC subnet, with the private subnet's route table sending 0.0.0.0/0 to it.
Outbound-only: nothing on the internet can initiate a connection inward.
<!--ID: 1788139021233-->
END

START
Basic
VPC: "Block traffic from one specific malicious IP." Security group or NACL — and why is there only one answer?
Back: NACL. Security groups support Allow rules only; a NACL is the only place you can write an explicit Deny.
<!--ID: 1788139021239-->
END

START
Basic
VPC: You allow inbound 443 on a NACL and traffic still fails. What did you forget?
Back: The outbound rule for ephemeral ports (1024–65535). NACLs are stateless — return traffic needs its own explicit rule.
Security groups are stateful and don't have this problem.
<!--ID: 1788139021247-->
END

START
Basic
VPC: When is a Gateway endpoint the answer instead of an Interface endpoint?
Back: Only for S3 and DynamoDB — and it's free, so prefer it there. Everything else needs an Interface endpoint (PrivateLink), which costs hourly + per-GB.
"Reduce NAT gateway data charges for S3 traffic" → Gateway endpoint.
<!--ID: 1788139021254-->
END

START
Basic
VPC: Three VPCs are peered A↔B and B↔C. Can A reach C?
Back: No. VPC peering is non-transitive. Either peer A↔C directly, or replace the mesh with a Transit Gateway, which IS transitive.
<!--ID: 1788139021261-->
END

START
Basic
VPC: Why does "highly available" always force you to think about subnets?
Back: A subnet exists in exactly one AZ. Multi-AZ therefore always means multiple subnets — one per AZ — and that constrains ALB, ASG, and RDS Multi-AZ placement.
<!--ID: 1788139021268-->
END

START
Basic
VPC: How many usable IPs in a /24 subnet, and why isn't it 256?
Back: 251. AWS reserves 5 per subnet: network address, VPC router, DNS, one for future use, and broadcast.
<!--ID: 1788139021275-->
END

START
Basic
VPC: A NAT Gateway in one AZ serves private subnets in three AZs. What's the tradeoff?
Back: Cheaper (one gateway) but the AZ's failure cuts internet access for all three, and you pay cross-AZ data transfer.
One NAT GW per AZ is the HA answer; one shared is the cost-optimized answer.
<!--ID: 1788139021283-->
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
