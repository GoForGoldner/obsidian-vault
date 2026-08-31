---
tags: [aws, saa-c03, storage, hybrid, domain-3, domain-4]
category: aws
related: [aws-s3, aws-ec2-autoscaling, aws-hybrid-connectivity, aws-disaster-recovery]
---
TARGET DECK: Study::AWS::Storage

## Description
Beyond S3, the exam tests **block vs file vs object** and which service fits each.

**EBS (block)** — a virtual hard drive attached to one EC2 instance. **AZ-scoped**: an EBS volume can only attach to an instance in the same AZ. To move it, snapshot to S3 and restore in the target AZ/Region. Volume types:
- **gp3** — general purpose SSD, baseline 3,000 IOPS, and IOPS/throughput are **provisioned independently of size** (gp2 tied IOPS to size — gp3 is the modern default and cheaper).
- **io1/io2** — provisioned IOPS SSD, up to 256,000 IOPS, **io2 Block Express** for the highest tiers. For latency-sensitive databases. Only io1/io2 support **Multi-Attach** (one volume, several instances in the same AZ — and it needs a cluster-aware filesystem).
- **st1** — throughput-optimized HDD, big sequential reads (log processing, data warehouse). Cannot be a boot volume.
- **sc1** — cold HDD, cheapest, infrequent access. Cannot be a boot volume.

**Instance Store** — physical disk on the host. Fastest possible IOPS, but **ephemeral**: stopping or terminating the instance loses the data. The answer for caches, scratch, and buffers; never for persistent data.

**EFS (file, NFS)** — shared filesystem, **mountable by thousands of EC2 instances across multiple AZs simultaneously**. Linux only. Elastic, pay per GB used. This is the answer whenever **many instances need shared read-write access to the same files** (a CMS, shared uploads, a web farm). Has an Infrequent Access tier plus lifecycle management for cost.

**FSx** — managed third-party filesystems:
- **FSx for Windows File Server** — SMB, Active Directory integration, NTFS. The answer for **Windows** shared storage.
- **FSx for Lustre** — extreme-performance HPC/ML, integrates with S3. The answer for **high-performance computing / large-scale analytics**.
- **FSx for NetApp ONTAP** — multi-protocol (NFS+SMB+iSCSI), for lifting NetApp workloads.
- **FSx for OpenZFS** — ZFS workloads.

**Hybrid and migration**:
- **AWS Storage Gateway** — keeps on-prem apps working while backing onto S3. **File Gateway** (NFS/SMB → S3), **Volume Gateway** (iSCSI block, cached or stored), **Tape Gateway** (virtual tape library replacing physical tapes). The answer for "keep the on-prem app unchanged but move storage to AWS."
- **AWS DataSync** — **online** bulk transfer/sync between on-prem (NFS/SMB) and AWS, over network, with scheduling and validation. The answer for "migrate/replicate large datasets over the network."
- **AWS Snow Family** — **offline** shipping. **Snowcone** (up to 8 TB), **Snowball Edge** (~80 TB, with compute), **Snowmobile** (exabytes, a truck). The answer when the dataset is huge **and bandwidth is limited** — the giveaway is a stated slow link and a deadline.

The DataSync-vs-Snowball decision is arithmetic: if transferring over the available link takes longer than shipping, ship it.

## Examples
```
Block / file / object:

EBS      one instance, one AZ, a disk                 → OS, databases
Instance one instance, ephemeral, fastest             → cache, scratch, buffer
EFS      MANY instances, multi-AZ, NFS, Linux         → shared app files
FSx Win  MANY instances, SMB + Active Directory       → Windows shares
S3       HTTP objects, unlimited, not mountable       → backups, media, data lake
```

```
Transfer decision:

100 TB over a 1 Gbps link  ≈ 10+ days at perfect utilization  → Snowball
10 TB over a 10 Gbps link  ≈ hours                            → DataSync
Ongoing sync, on-prem ↔ AWS, scheduled                        → DataSync
Keep the on-prem app, back it with S3 transparently           → Storage Gateway
Replace a physical tape library                               → Tape Gateway
```

```
EBS volume picker:

Default, cost-effective, tunable IOPS      → gp3
Latency-sensitive DB needing >16,000 IOPS  → io2 / io2 Block Express
Big sequential throughput (logs, ETL)      → st1   (no boot volume)
Cheapest, rarely touched                   → sc1   (no boot volume)
Shared block across instances in one AZ    → io1/io2 Multi-Attach + cluster FS
```

## Related Topics
- Block vs file vs object storage
- IOPS vs throughput
- NFS and SMB protocols
- Data migration strategies
- Snapshots and backup

## Cards

```anki
START
Basic
Storage: Twenty EC2 instances across three AZs must read and write the same files. EBS or EFS?
Back: EFS — a shared NFS filesystem mountable by thousands of instances across AZs. EBS attaches to one instance in one AZ.
"Shared access from many instances" is the EFS signature.
<!--ID: 1788139021170-->
END

START
Basic
Storage: Why can't you just attach one EBS volume to instances in two AZs?
Back: EBS is AZ-scoped. To move it you snapshot to S3 and restore in the other AZ. (Multi-Attach exists but is io1/io2, same-AZ only, and needs a cluster-aware filesystem.)
<!--ID: 1788139021177-->
END

START
Basic
Storage: A Windows application needs an SMB share integrated with Active Directory. Which service?
Back: FSx for Windows File Server. EFS is NFS/Linux only — a common distractor pairing.
<!--ID: 1788139021184-->
END

START
Basic
Storage: The workload is HPC / ML training needing sub-millisecond access to data staged from S3. Which filesystem?
Back: FSx for Lustre — purpose-built for high-performance computing and natively linked to S3.
<!--ID: 1788139021190-->
END

START
Basic
Storage: 200 TB must reach AWS in two weeks over a saturated 500 Mbps link. DataSync or Snowball?
Back: Snowball (offline shipping). Do the arithmetic — 200 TB over 500 Mbps takes over a month. When the link can't make the deadline, ship the data.
<!--ID: 1788139021197-->
END

START
Basic
Storage: On-prem apps write to an NFS share and must keep working, but storage should live in S3. What?
Back: AWS Storage Gateway — File Gateway. The app keeps its NFS/SMB mount; data lands in S3 behind it.
<!--ID: 1788139021203-->
END

START
Basic
Storage: Why is instance store wrong for a database's data directory?
Back: It's ephemeral — stopping or terminating the instance destroys it, and it can't be snapshotted. Use EBS for persistence; instance store is for cache/scratch.
<!--ID: 1788139021209-->
END

START
Basic
Storage: What changed between gp2 and gp3 that matters for cost?
Back: gp2 tied IOPS to volume size, forcing you to over-provision capacity to get performance. gp3 provisions IOPS and throughput independently — and is ~20% cheaper per GB.
<!--ID: 1788139021215-->
END

START
Basic
Storage: The company wants to retire its physical tape backup infrastructure without changing its backup software. What?
Back: Storage Gateway — Tape Gateway. It presents a virtual tape library over iSCSI, so the existing software keeps working while tapes land in S3/Glacier.
<!--ID: 1788139021221-->
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
