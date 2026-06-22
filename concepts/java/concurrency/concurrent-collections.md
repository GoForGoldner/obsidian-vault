---
tags: [java, concurrency, collections, threads]
category: java
related: [executor-service, completable-future, atomics-and-volatile, race-conditions, thread]
---

## Description
The `java.util.concurrent` collections are purpose-built for multi-threaded access,
unlike the plain Collections Framework types (see [[collections-framework]]) which are
not thread-safe. The exam contrasts three tiers: (1) raw collections + fail-fast
iterators, (2) `Collections.synchronizedXxx` wrappers (coarse lock, manual sync during
iteration), and (3) true concurrent collections (`ConcurrentHashMap`,
`CopyOnWriteArrayList`, `BlockingQueue`) with finer-grained or lock-free strategies.

A fail-fast iterator on `ArrayList`/`HashMap` throws `ConcurrentModificationException`
if the collection is structurally modified during iteration (it watches a `modCount`).
Concurrent collections instead give *weakly consistent* iterators that never throw CME
— they reflect some state during iteration and tolerate concurrent writes. The big
gotcha: `ConcurrentHashMap` forbids `null` keys and values (an ambiguous `null` could
mean "absent" or "present-with-null" under concurrency).

## Examples

`ConcurrentHashMap` — atomic update methods avoid check-then-act races:

```java
import java.util.concurrent.*;

ConcurrentHashMap<String,Integer> counts = new ConcurrentHashMap<>();

counts.merge("a", 1, Integer::sum);             // atomic increment-or-init
counts.computeIfAbsent("b", k -> expensive(k)); // computed at most once
counts.compute("a", (k,v) -> v == null ? 1 : v + 1);

counts.put("x", null);   // throws NullPointerException — no null keys OR values
```

| Method | Atomic? | What it does |
|---|---|---|
| `merge(k, v, fn)` | yes | If absent set `v`, else `fn(old, v)` |
| `computeIfAbsent(k, fn)` | yes | Compute + store only if key missing |
| `compute(k, fn)` | yes | Recompute value from current (or `null`) |
| `putIfAbsent(k, v)` | yes | Insert only if absent; returns prior value |

`CopyOnWriteArrayList` — every write copies the backing array; iterators see an
immutable snapshot. Excellent for read-heavy / rarely-written data (e.g. listener lists):

```java
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
list.add("a");
for (String s : list) {  // iterates over a SNAPSHOT
    list.add("b");       // safe: no CME, but iterator won't see "b"
}
```

`BlockingQueue` — the backbone of producer/consumer:

```java
BlockingQueue<Task> q = new LinkedBlockingQueue<>();   // optionally bounded
// ArrayBlockingQueue is always bounded (fixed capacity)

q.put(task);                          // BLOCKS if full
Task t = q.take();                    // BLOCKS until an item is available
q.offer(task, 1, TimeUnit.SECONDS);   // wait up to timeout, returns boolean
Task p = q.poll(1, TimeUnit.SECONDS); // wait up to timeout, may return null
```

Contrast with the synchronized wrapper — coarse single lock, **manual** sync to iterate:

```java
List<String> sync = Collections.synchronizedList(new ArrayList<>());
synchronized (sync) {                 // REQUIRED, or risk CME / corruption
    for (String s : sync) { /* ... */ }
}
```

## Related Topics
- [[executor-service]]
- [[completable-future]]
- [[atomics-and-volatile]]
- [[collections-framework]] — the non-thread-safe base types
- [[race-conditions]] — what these collections prevent
- [[thread]]
- `ConcurrentLinkedQueue`, `ConcurrentSkipListMap` (sorted concurrent map)

## Cards

```anki
START
Basic
You put `map.put("k", null)` into a ConcurrentHashMap. Result?
Back: `NullPointerException` — `ConcurrentHashMap` allows no `null` keys or values.<br>A `null` would be ambiguous: "key absent" vs "present mapped to null" under concurrent access.<br>(Plain `HashMap` allows both — this is a CHM-specific trap.)
<!--ID: 1781902680118-->
END

START
Basic
Iterating a normal `ArrayList` while another thread (or the same loop) modifies it — what happens?
Back: `ConcurrentModificationException` from the fail-fast iterator.<br>It compares `modCount` to an expected value and throws on structural change.<br>It's a best-effort safety check, not a guarantee — never rely on it for correctness.
<!--ID: 1781902680125-->
END

START
Basic
How do concurrent collections' iterators differ from fail-fast ones?
Back: They are *weakly consistent*: never throw `ConcurrentModificationException`.<br>They reflect the collection's state at some point and tolerate concurrent modification.<br>You may or may not see elements added after the iterator was created.
<!--ID: 1781902680132-->
END

START
Basic
You need an atomic "increment this key's count, or set to 1 if absent" on a ConcurrentHashMap. API?
Back: `map.merge(key, 1, Integer::sum)`.<br>Or `compute(key, (k,v) -> v == null ? 1 : v + 1)`.<br>These are atomic; a plain `get` + `put` is a check-then-act race.
<!--ID: 1781902680139-->
END

START
Basic
When is `CopyOnWriteArrayList` the right choice, and what's its cost?
Back: Read-heavy, write-rare data (e.g. event-listener lists).<br>Every mutation copies the whole backing array — writes are O(n) and expensive.<br>Iterators see an immutable snapshot, so no CME even while others write.
<!--ID: 1781902680146-->
END

START
Basic
`BlockingQueue`: `put`/`take` vs `offer`/`poll`?
Back: `put` blocks if full; `take` blocks until an element exists.<br>`offer(e, t, unit)` / `poll(t, unit)` wait up to a timeout, returning a `boolean` / possibly `null`.<br>This blocking is what makes producer/consumer work without busy-waiting.
<!--ID: 1781902680152-->
END

START
Basic
Difference between `Collections.synchronizedList(...)` and a true concurrent collection?
Back: `synchronizedList` wraps every method in one lock (coarse); you must `synchronized(list){}` manually to iterate safely.<br>Concurrent collections use fine-grained / lock-free strategies and weakly-consistent iterators (no external sync needed).<br>Concurrent types scale far better under contention.
<!--ID: 1781902680160-->
END

START
Basic
`ArrayBlockingQueue` vs `LinkedBlockingQueue` capacity behavior?
Back: `ArrayBlockingQueue` is always bounded (fixed capacity set at construction).<br>`LinkedBlockingQueue` is optionally bounded — unbounded by default.<br>A bounded queue gives natural back-pressure on producers.
<!--ID: 1781902680166-->
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
