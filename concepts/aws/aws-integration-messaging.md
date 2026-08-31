---
tags: [aws, saa-c03, integration, decoupling, domain-2, domain-3]
category: aws
related: [aws-serverless-containers, message-queue, kafka, aws-analytics-ingestion, cqrs]
---
TARGET DECK: Study::AWS::Integration

## Description
Decoupling is Domain 2's central theme. Four services, and the exam separates them by **delivery model** and **consumer count**.

**Amazon SQS** — a **queue**: one message, **one consumer**, pull-based. Messages persist up to 14 days (default 4). Two flavours:
- **Standard** — nearly unlimited throughput, **at-least-once** delivery, **best-effort ordering** (duplicates and reordering possible).
- **FIFO** — **exactly-once** processing and **strict ordering**, but capped throughput (300 msg/s, 3,000 batched). Name ends in `.fifo`.

Key SQS mechanics: **visibility timeout** (how long a received message is hidden from other consumers — if processing exceeds it, another consumer picks the message up and you get double-processing; the fix is to raise the timeout or extend it in-flight), **dead-letter queues** (after N failed receives, the message moves to a DLQ for inspection — the answer for "poison messages"), and **long polling** (reduces empty receives and cost).

**Amazon SNS** — **pub/sub**: one message, **many subscribers** (fan-out), push-based. Subscribers include SQS queues, Lambda, HTTP endpoints, email, SMS. **SNS + SQS fan-out** is the canonical pattern: publish once, several independent queues each get a copy and process at their own pace.

**Amazon EventBridge** — an **event bus** with **content-based filtering rules**, schema registry, **scheduled events (cron)**, and **SaaS/third-party integrations**. Choose EventBridge over SNS when you need to route on *event content*, integrate SaaS sources, or replay events.

**Amazon Kinesis Data Streams** — **real-time streaming** with **ordered, replayable** records retained 1–365 days, read by **multiple independent consumers** each at their own position. Unlike SQS, reading doesn't delete: this is the answer for **real-time analytics, clickstreams, IoT telemetry**, and anything needing **ordering plus multiple readers plus replay**.

**Amazon MQ** — managed ActiveMQ/RabbitMQ. Only correct when the question mentions **migrating an existing app using industry-standard protocols** (AMQP, MQTT, JMS, STOMP) that you don't want to rewrite for SQS/SNS.

The decoupling payoff the exam wants you to state: a queue between tiers absorbs traffic spikes, lets producer and consumer scale independently, and prevents a slow downstream from failing upstream requests. **Auto-scale consumers on queue depth** (`ApproximateNumberOfMessagesVisible`).

## Examples
```
Choosing:

One message → one worker, buffer spikes             → SQS
Strict order and no duplicates (payments)           → SQS FIFO
One event → several independent systems             → SNS (fan-out)
Fan-out where each consumer needs its own buffer    → SNS → multiple SQS queues
Route on event content / SaaS source / cron         → EventBridge
Real-time stream, replay, multiple readers, ordered → Kinesis Data Streams
Lift-and-shift of a JMS/AMQP app                    → Amazon MQ
```

```
SNS + SQS fan-out — the canonical pattern:

                      ┌─► SQS "billing"    ─► billing workers
  order placed ─► SNS ─┼─► SQS "inventory"  ─► inventory workers
                      └─► SQS "analytics"  ─► analytics workers

Each queue buffers independently. A slow analytics consumer never
blocks billing, and a failure only backs up its own queue.
```

```
Visibility timeout, the classic bug:

  t=0    consumer receives message, visibility timeout = 30s
  t=30   processing still running → message becomes visible again
  t=31   a SECOND consumer receives the same message  ← double-processing
  Fix:   raise the visibility timeout above worst-case processing time,
         or call ChangeMessageVisibility to extend it while working.
```

## Related Topics
- Queues vs pub/sub vs streams
- At-least-once vs exactly-once delivery
- Backpressure and load levelling
- Idempotency
- Event-driven architecture

## Cards

```anki
START
Basic
SQS vs SNS: One event must reach three independent systems. Which service, and why not SQS?
Back: SNS — pub/sub fan-out delivers a copy to every subscriber. An SQS message is consumed by exactly one consumer, so the other two would never see it.
<!--ID: 1788139020610-->
END

START
Basic
SQS: Messages are being processed twice. What's the first thing to check?
Back: The visibility timeout is shorter than actual processing time, so the message reappears mid-work. Raise it, or extend it in-flight with ChangeMessageVisibility.
<!--ID: 1788139020617-->
END

START
Basic
SQS: Payment events must be processed in order with no duplicates. Which queue type, and what do you give up?
Back: FIFO queue. You give up throughput — 300 messages/sec (3,000 batched) versus Standard's near-unlimited.
<!--ID: 1788139020624-->
END

START
Basic
SQS: A malformed message keeps failing and blocking the queue. What do you configure?
Back: A dead-letter queue with a maxReceiveCount — after N failed receives the poison message moves aside for inspection instead of retrying forever.
<!--ID: 1788139020630-->
END

START
Basic
Messaging: When do you choose Kinesis Data Streams over SQS?
Back: When you need ordering, replay, and multiple independent consumers reading the same records. SQS deletes on consume; Kinesis retains records 1–365 days and each consumer tracks its own position.
<!--ID: 1788139020637-->
END

START
Basic
Messaging: When is EventBridge the answer instead of SNS?
Back: When you need to route based on event CONTENT with filter rules, ingest from SaaS/third-party sources, or run scheduled (cron) events. SNS is a simpler topic-based broadcast.
<!--ID: 1788139020644-->
END

START
Basic
Messaging: A company is migrating an on-prem app that speaks AMQP and JMS and doesn't want to rewrite it. Which service?
Back: Amazon MQ — managed ActiveMQ/RabbitMQ supporting industry-standard protocols. SQS/SNS would require rewriting the messaging code.
<!--ID: 1788139020650-->
END

START
Basic
Decoupling: How should you auto-scale the workers consuming an SQS queue?
Back: Target-track on queue depth (ApproximateNumberOfMessagesVisible), or backlog-per-instance — not CPU. Idle workers waiting on a deep queue show low CPU.
<!--ID: 1788139020657-->
END

START
Basic
Decoupling: The web tier fails during traffic spikes because the processing tier can't keep up. What's the architectural fix and why does it work?
Back: Put an SQS queue between them. The queue absorbs the spike, the web tier returns immediately, and consumers scale independently and drain at their own rate.
<!--ID: 1788139020665-->
END

START
Basic
Messaging: SNS fan-out delivers straight to three Lambdas, but one downstream system is often down. What do you change?
Back: Insert SQS queues between SNS and each consumer. The queue buffers and retries while that consumer is unavailable, instead of losing the notification.
<!--ID: 1788139020671-->
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
