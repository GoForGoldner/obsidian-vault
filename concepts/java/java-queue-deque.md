---
tags: [java, data-structures, queue]
category: java
related: [collections-framework, java-list, java-set-and-map]
---

## Description
A `Queue` models FIFO processing, while a `Deque` generalizes that model to both ends so the same structure can act as a queue or a stack. The API is deliberately split into throwing and non-throwing forms because some queues are capacity-restricted and failure can be expected rather than exceptional. In day-to-day Java, `ArrayDeque` is the best default implementation because it is faster and leaner than `LinkedList`, while `PriorityQueue` is the special case you choose when "next" means highest priority rather than oldest insertion.

## Examples
### Queue two-tier API

| Operation | Throws on failure | Returns special value |
| --- | --- | --- |
| Insert | `add(e)` | `offer(e)` returns `false` |
| Remove head | `remove()` | `poll()` returns `null` |
| Inspect head | `element()` | `peek()` returns `null` |

### Deque stack equivalents

| Stack idea | Deque method | Equivalent end-based form |
| --- | --- | --- |
| Push | `push(e)` | `addFirst(e)` |
| Pop | `pop()` | `removeFirst()` |
| Peek | `peek()` | `peekFirst()` |

```java
Deque<String> dq = new ArrayDeque<>();
dq.offerLast("job-1");
dq.offerLast("job-2");
String first = dq.pollFirst(); // queue behavior

dq.push("top");
String top = dq.pop();         // stack behavior
```

## Related Topics
- [[collections-framework]]
- [[java-list]]
- [[java-set-and-map]]

## Cards

```anki
START
Basic
What's the difference between `Queue`'s throwing methods and null-returning methods?
Back: `add`, `remove`, and `element` throw exceptions on failure (`IllegalStateException` or `NoSuchElementException`). `offer`, `poll`, and `peek` return `false` or `null` instead. Prefer `offer`/`poll`/`peek` in most code because failure is usually part of normal control flow, not something worth handling with exceptions.
END

START
Basic
Why should you use `ArrayDeque` instead of `Stack` or `LinkedList` for stack/queue usage?
Back: `ArrayDeque` is usually faster because it avoids per-node allocation, uses less memory because it stores data in a contiguous array, and avoids the legacy synchronization overhead of `Stack` (which extends `Vector`). `LinkedList` pays for a node object per element. `ArrayDeque` is the best default for both stack and queue behavior.
END

START
Basic
How does `Deque` serve as both a queue and a stack?
Back: As a queue (FIFO), use `offerLast()` to enqueue and `pollFirst()` to dequeue. As a stack (LIFO), use `push()`/`pop()`, which are equivalent to `addFirst()`/`removeFirst()`. `Deque` unifies both mental models, which is why `ArrayDeque` replaces both `LinkedList`-as-queue and legacy `Stack`.
END

START
Basic
When do you use `PriorityQueue` instead of a normal `Queue`?
Back: Use `PriorityQueue` when retrieval order should be determined by priority rather than arrival time. Java's `PriorityQueue` is a min-heap by default, so `poll()` returns the smallest element according to natural ordering or a comparator. It is the right tool for schedulers, top-K problems, and repeatedly taking the current best candidate.
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
