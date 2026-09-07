---
tags: [aws, saa-c03, iac, cloudformation, automation, domain-2]
category: aws
related: [aws-monitoring-governance, aws-organizations, aws-ec2-autoscaling, aws-serverless-containers]
---
TARGET DECK: Study::AWS::Operations

## Description
CloudFormation (CFN) is AWS's **infrastructure as code** service: you declare desired state in a YAML or JSON **template**, and CFN creates a **stack** of real resources to match. It's free (you pay only for what it provisions), and it's the answer to "repeatable," "version-controlled," "consistent across environments," and "automatically roll back on failure."

**Template anatomy.** Only `Resources` is mandatory.
- `Parameters` — inputs supplied at deploy time (with types, defaults, `AllowedValues`).
- `Mappings` — static lookup tables, classically Region → AMI ID.
- `Conditions` — create a resource only when something is true (`prod` vs `test`).
- `Resources` — the actual infrastructure. **Logical resources** are what you declare in the template; CFN creates matching **physical resources** in AWS and tracks the link between them.
- `Outputs` — values to return, and the only thing exportable to other stacks.
- `Transform` — invokes macros; `AWS::Serverless` is SAM.

**Intrinsic functions** are the exam's favourite detail:
- `!Ref` — returns a parameter's value, or a resource's **default identifier** (usually its physical ID; for an EC2 instance, the instance ID).
- `!GetAtt` — returns a **specific attribute** of a resource (`!GetAtt MyALB.DNSName`).
- `!Sub` — string substitution with variables.
- `!FindInMap`, `!If`, `!Join`, `!Select`, `!ImportValue`.

**Pseudo parameters** are supplied by AWS itself: `AWS::Region`, `AWS::AccountId`, `AWS::StackName`, `AWS::Partition`. Using them is what makes a template **portable** — hardcoding a Region or AMI is what makes it non-portable.

**Ordering and signalling.** CFN parallelizes resource creation and infers order from references; `DependsOn` forces explicit ordering when no reference exists. But "resource created" ≠ "application ready" — an EC2 instance is `CREATE_COMPLETE` the moment it launches, long before bootstrapping finishes. **`CreationPolicy` + `cfn-signal`** makes CFN wait for the instance to report success, and fail the stack if it never does. **`cfn-init`** performs desired-state configuration inside the instance (packages, files, services) from the template's `Metadata`; **`cfn-hup`** watches for template changes and re-runs `cfn-init` without replacing the instance.

**Multi-stack patterns.** **Nested stacks** treat other templates as resources of one parent — used when the pieces share a lifecycle and are deployed together. **Cross-stack references** (`Export` in Outputs, `!ImportValue` in the consumer) share values between **independent** stacks with different lifecycles — and an exported value cannot be deleted or changed while another stack imports it. **StackSets** deploy one template across **many accounts and Regions** at once.

**Update and delete safety.** **Change sets** preview what an update will do — critically, whether a resource will be **replaced** (some property changes force replacement, destroying data) — before you execute. **`DeletionPolicy`** (`Retain`, `Snapshot`, `Delete`) protects data when a resource leaves the stack. **Stack roles** let CFN assume a role so operators can deploy infrastructure without holding the permissions themselves. **Custom resources** let a Lambda extend CFN to things it doesn't natively support (e.g. emptying an S3 bucket before deletion).

## Examples
```yaml
Parameters:
  EnvType: { Type: String, AllowedValues: [prod, test], Default: test }
Conditions:
  IsProd: !Equals [!Ref EnvType, prod]
Mappings:
  RegionAMI:
    us-east-1: { AMI: ami-0abc }
    eu-west-1: { AMI: ami-0def }
Resources:
  Web:
    Type: AWS::EC2::Instance
    CreationPolicy:
      ResourceSignal: { Timeout: PT15M }        # wait for cfn-signal
    Properties:
      ImageId: !FindInMap [RegionAMI, !Ref "AWS::Region", AMI]   # portable
      InstanceType: !If [IsProd, m5.large, t3.micro]
  Bucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain                       # survives stack deletion
Outputs:
  Endpoint:
    Value: !GetAtt Web.PublicDnsName
    Export: { Name: !Sub "${AWS::StackName}-endpoint" }
```

```
Nested stacks vs cross-stack references:

NESTED                                CROSS-STACK
one parent, many child templates      independent stacks
shared lifecycle, deployed together   different lifecycles
reuse a template you own              share a VALUE (VPC id, subnet ids)
parent references child outputs       Export / !ImportValue
                                      exported value is LOCKED while imported
```

```
Why CreationPolicy exists:

  without it:  RunInstances returns -> CFN says CREATE_COMPLETE
               ...but userdata is still installing Apache. Stack "succeeded"
               while the app is broken.

  with it:     CFN waits for  cfn-signal -e $? --stack .. --resource Web
               Instance must report success within the timeout, or the
               stack fails and rolls back. This is the correct answer to
               "how do we make sure the stack only succeeds when the app is up?"
```

## Related Topics
- Infrastructure as code
- Declarative vs imperative provisioning
- Immutable infrastructure
- Terraform comparison
- Configuration drift

## Cards

```anki
START
Basic
CloudFormation: What is the difference between a logical and a physical resource?
Back: The logical resource is what you declare in the template; the physical resource is the real thing CloudFormation creates in AWS. CFN maintains the mapping between them, which is how it knows what to update or delete.
Tags: cantrill::cloudformation
<!--ID: 1788209676507-->
END

START
Basic
CloudFormation: When do you use !GetAtt instead of !Ref?
Back: !Ref returns a resource's default identifier (usually its physical ID). !GetAtt returns a SPECIFIC attribute — e.g. !GetAtt MyALB.DNSName. If you need anything other than the default id, it's !GetAtt.
Tags: cantrill::cloudformation
<!--ID: 1788209676512-->
END

START
Basic
CloudFormation: A template hardcodes an AMI ID and fails when deployed to another Region. What are the two fixes?
Back: A Mappings section keyed by Region with !FindInMap, plus the !Ref "AWS::Region" pseudo parameter. Pseudo parameters are what make templates portable.
Tags: cantrill::cloudformation
<!--ID: 1788209676516-->
END

START
Basic
CloudFormation: An EC2 stack reports CREATE_COMPLETE but the application isn't running yet. What do you add?
Back: A CreationPolicy with a ResourceSignal, and cfn-signal in the instance's userdata. The stack then only succeeds when the instance reports its bootstrap finished — and fails if it times out.
Tags: cantrill::advanced-ec2
<!--ID: 1788209676520-->
END

START
Basic
CloudFormation: What's the difference between cfn-init and cfn-hup?
Back: cfn-init applies desired-state config (packages, files, services) from the template Metadata at launch. cfn-hup detects later template changes and re-runs cfn-init in place, without replacing the instance.
Tags: cantrill::cloudformation
<!--ID: 1788209676523-->
END

START
Basic
CloudFormation: When do you use DependsOn, given CFN already works out ordering?
Back: When two resources have no reference between them but still need an order. CFN infers dependencies only from !Ref and !GetAtt, so unrelated-looking resources are created in parallel.
Tags: cantrill::cloudformation
<!--ID: 1788209676528-->
END

START
Basic
CloudFormation: Nested stacks or cross-stack references — how do you choose?
Back: Nested when the templates share a lifecycle and deploy as one unit. Cross-stack (Export/!ImportValue) when independent stacks with different lifecycles need to share a value, such as a VPC id.
Tags: cantrill::cloudformation
<!--ID: 1788209676533-->
END

START
Basic
CloudFormation: You try to delete a stack and it fails because another stack imports one of its outputs. Why is this by design?
Back: An exported value is locked while anything imports it — CFN won't let you break a consumer. You must remove the import from the consuming stack first.
Tags: cantrill::cloudformation
<!--ID: 1788209676537-->
END

START
Basic
CloudFormation: You need to deploy one template to 30 accounts across 4 Regions. What feature?
Back: CloudFormation StackSets — a single operation deploys and updates the stack across many accounts and Regions, typically driven from an Organizations management account.
Tags: cantrill::cloudformation
<!--ID: 1788209676541-->
END

START
Basic
CloudFormation: What risk does a change set protect you from?
Back: It previews whether an update will REPLACE a resource rather than modify it in place. Some property changes force replacement, which destroys the existing resource and its data.
Tags: cantrill::cloudformation
<!--ID: 1788209676546-->
END

START
Basic
CloudFormation: How do you stop a stack deletion from destroying an RDS database or S3 bucket?
Back: DeletionPolicy on the resource — Retain keeps it, Snapshot takes a final snapshot first. Without it, the resource is deleted with the stack.
Tags: cantrill::cloudformation
<!--ID: 1788209676550-->
END

START
Basic
CloudFormation: An operator must deploy infrastructure they don't personally have permission to create. What feature allows this safely?
Back: A stack role — CloudFormation assumes an IAM role to make the changes, so the operator only needs permission to run the stack, not to create the resources directly.
Tags: cantrill::cloudformation
<!--ID: 1788209676554-->
END

START
Basic
CloudFormation: CFN doesn't natively support something you need during stack creation. What's the escape hatch?
Back: A custom resource backed by Lambda — CFN calls your function on create/update/delete. The classic use is emptying an S3 bucket so the stack can delete it.
Tags: cantrill::serverless-app
<!--ID: 1788209676559-->
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
