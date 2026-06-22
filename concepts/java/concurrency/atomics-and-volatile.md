---
tags: [java, concurrency, atomics, volatile, threads]
category: java
related: [executor-service, concurrent-collections, completable-future, race-conditions, locking-stradegies]
---

## Description
Three tools sit on the low-end of the concurrency toolbox, and the exam loves to test
exactly what each does NOT guarantee. `volatile` guarantees *visibility* (a write by
one thread is seen by others) and ordering, but NOT *atomicity* of compound operations.
The atomic classes (`AtomicInteger`, `AtomicLong`, `AtomicReference`) add lock-free
atomicity via CAS. `synchronized` gives both visibility and mutual exclusion but blocks.

The canonical trap: `count++` on a `volatile int` is still a race. `++` is read,
add, write — three steps — and `volatile` only makes each individual read/write
visible, not the whole sequence indivisible. Two threads can both read the same value
and each write back value+1, losing an increment (see [[race-conditions]]). To fix it,
use `AtomicInteger.incrementAndGet()`, a `synchronized` block, or a lock.

## Examples

`volatile` is for visibility, often a flag — not for counters:

```java
volatile boolean running = true;   // good: one thread writes, others see it promptly
// ...
while (running) { ... }            // other thread sets running=false -> loop exits

volatile int count = 0;
count++;                           // STILL A RACE: read-modify-write is 3 ops, not atomic
```

Atomic classes — lock-free, built on Compare-And-Swap (CAS):

```java
import java.util.concurrent.atomic.*;

AtomicInteger n = new AtomicInteger(0);
n.incrementAndGet();        // ++n  -> returns NEW value (1)
n.getAndIncrement();        // n++  -> returns OLD value (1), now holds 2
n.addAndGet(10);            // -> 12

// CAS: set only if current == expected; returns boolean
boolean ok = n.compareAndSet(12, 100);   // true, now 100

// derive new value from old, atomically (retries under contention)
n.updateAndGet(v -> v * 2);                  // 200
n.accumulateAndGet(5, (cur, x) -> cur + x);  // 205

AtomicReference<Node> head = new AtomicReference<>();
head.compareAndSet(null, new Node());        // lock-free stack push primitive
```

`LongAdder` — built for high write contention (counters, metrics):

```java
LongAdder hits = new LongAdder();
hits.increment();          // spreads contention across internal cells
long total = hits.sum();   // combine cells; read is approximate while updating
```

Choosing between the three:

| Tool | Visibility | Atomic compound op | Blocks? | Use when |
|---|---|---|---|---|
| `volatile` | yes | NO | no | Simple flag / single read-write field |
| Atomic class | yes | yes (single var, CAS) | no | Lock-free counter / reference |
| `synchronized` | yes | yes (multi-var) | yes | Multiple fields must change together |

## Related Topics
- [[race-conditions]] — why `count++` loses updates
- [[locking-stradegies]] — `synchronized` / `ReentrantLock` alternative
- [[executor-service]]
- [[concurrent-collections]]
- [[completable-future]]
- `StampedLock`, `ReentrantReadWriteLock`

## Cards

```anki
START
Basic
Is `count++` on a `volatile int` thread-safe? Why / why not?
Back: No — it's a race.<br>`++` is read-modify-write (3 steps); `volatile` only makes each individual read/write visible, not the trio atomic.<br>Two threads can read the same value and both write +1, losing one increment.
<!--ID: 1781902680057-->
END

START
Basic
What does `volatile` actually guarantee?
Back: Visibility and ordering: a write is promptly seen by other threads (no stale cached copies), with happens-before ordering.<br>It does NOT provide atomicity of compound operations.<br>Best for a single flag written by one thread and read by others.
<!--ID: 1781902680065-->
END

START
Basic
You need a lock-free thread-safe counter. What type and method?
Back: `AtomicInteger` (or `AtomicLong`) with `incrementAndGet()`.<br>It uses CAS under the hood — atomic without blocking.<br>`getAndIncrement()` returns the OLD value; `incrementAndGet()` returns the NEW one.
<!--ID: 1781902680072-->
END

START
Basic
What does `compareAndSet(expected, newValue)` do, and what does it return?
Back: Atomically sets the value to `newValue` ONLY if the current value equals `expected`.<br>Returns `boolean` (true if it succeeded).<br>This CAS primitive is the foundation of lock-free algorithms (retry on false).
<!--ID: 1781902680080-->
END

START
Basic
`incrementAndGet()` vs `getAndIncrement()`?
Back: `incrementAndGet()` = pre-increment `++n`: increments then returns the NEW value.<br>`getAndIncrement()` = post-increment `n++`: returns the OLD value then increments.<br>Mixing them up is a classic off-by-one bug.
<!--ID: 1781902680088-->
END

START
Basic
When prefer `LongAdder` over `AtomicLong`?
Back: Under HIGH write contention (many threads incrementing a hot counter/metric).<br>`LongAdder` spreads updates across internal cells, then `sum()`s them — less CAS contention.<br>Trade-off: `sum()` is approximate while updates are in flight, and it uses more memory.
<!--ID: 1781902680095-->
END

START
Basic
volatile vs atomic vs synchronized — pick the one-line distinction.
Back: `volatile`: visibility only, no atomic compound ops, non-blocking.<br>Atomic classes: lock-free atomic ops on a SINGLE variable (CAS).<br>`synchronized`: atomicity + visibility across MULTIPLE fields, but it blocks.
<!--ID: 1781902680102-->
END

START
Basic
You must update two related fields together so no thread sees a half-updated state. volatile or atomic enough?
Back: No — neither covers a multi-variable invariant.<br>`volatile`/atomics protect one field at a time; another thread can observe the gap between two updates.<br>Use `synchronized` or a `Lock` to make the pair of writes one critical section.
<!--ID: 1781902680109-->
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
