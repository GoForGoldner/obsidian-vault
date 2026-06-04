---
tags: [java, data-structures, queue]
category: java
related: [collections-framework, java-list, java-set-and-map]
---

## Description
A `Queue` models "first in, first out" processing, while a `Deque` generalizes the same idea to both ends so one structure can behave as a queue, stack, or double-ended work list. Java exposes most queue operations in two forms: a throwing form (`add`, `remove`, `element`) and a special-value form (`offer`, `poll`, `peek`). That distinction matters because some queue implementations are capacity-restricted, so failure is part of normal control flow. In everyday Java, `ArrayDeque` is the best default implementation for queue and stack behavior, while `PriorityQueue` is the specialized choice for "give me the next best element" rather than "give me the oldest element".

## Examples
### Queue two-tier API
| Operation | Throws on failure | Returns special value |
| --- | --- | --- |
| Insert | `boolean add(E e)` | `boolean offer(E e)` |
| Remove head | `E remove()` | `E poll()` |
| Inspect head | `E element()` | `E peek()` |

### Full `Deque` front/back API
| Intent | Front method | Back method | Special-value variant |
| --- | --- | --- | --- |
| Insert | `addFirst(E e)` | `addLast(E e)` | `offerFirst(E e)`, `offerLast(E e)` |
| Remove | `removeFirst()` | `removeLast()` | `pollFirst()`, `pollLast()` |
| Peek | `getFirst()` | `getLast()` | `peekFirst()`, `peekLast()` |

### `ArrayDeque` as queue, stack, and deque
```java
Deque<String> dq = new ArrayDeque<>();

// Queue (FIFO)
dq.offerLast("job-1");
dq.offerLast("job-2");
String first = dq.pollFirst();       // job-1

// Stack (LIFO)
dq.push("top");                     // same as addFirst("top")
String top = dq.pop();               // same as removeFirst()

// True deque behavior
dq.offerFirst("front");
dq.offerLast("back");
String last = dq.pollLast();
```

### `PriorityQueue` with a custom `Comparator`
```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(30);
minHeap.offer(10);
minHeap.offer(20);
int smallest = minHeap.poll();       // 10

PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
maxHeap.offer(30);
maxHeap.offer(10);
maxHeap.offer(20);
int largest = maxHeap.poll();        // 30
```

### Reverse traversal with `descendingIterator()`
```java
Deque<String> history = new ArrayDeque<>(List.of("A", "B", "C"));
Iterator<String> rev = history.descendingIterator();
while (rev.hasNext()) {
    System.out.println(rev.next());  // C, B, A
}
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
Back: `add`, `remove`, and `element` throw exceptions on failure, while `offer`, `poll`, and `peek` return a special value such as `false` or `null`.<br>Prefer `offer`/`poll`/`peek` in most code because failure is usually normal control flow.
END

START
Basic
Why should you use `ArrayDeque` instead of `Stack` or `LinkedList` for stack/queue usage?
Back: `ArrayDeque` avoids legacy `Stack` synchronization overhead and avoids `LinkedList`'s per-node allocation cost.<br>It is usually faster, uses less memory, and provides the full `Deque` API.<br>It is the best default for stack and queue behavior.
END

START
Basic
How does `Deque` serve as both a queue and a stack?
Back: As a queue, use `offerLast()` to enqueue and `pollFirst()` to dequeue for FIFO behavior.<br>As a stack, use `push()` and `pop()` for LIFO behavior; these are equivalent to `addFirst()` and `removeFirst()`.
END

START
Basic
When do you use `PriorityQueue` instead of a normal `Queue`?
Back: Use `PriorityQueue` when removal order should be based on priority rather than insertion time.<br>Java's default `PriorityQueue` is a min-heap, so `poll()` returns the smallest element according to natural ordering or a comparator.
END

START
Basic
What are all 6 `Deque` insertion/removal method pairs?
Back: Front insert: `addFirst` / `offerFirst`.<br>Back insert: `addLast` / `offerLast`.<br>Front remove: `removeFirst` / `pollFirst`.<br>Back remove: `removeLast` / `pollLast`.<br>Front peek: `getFirst` / `peekFirst`.<br>Back peek: `getLast` / `peekLast`.<br>`add`/`remove`/`get` throw, while `offer`/`poll`/`peek` return special values.
END

START
Basic
How do you create a max-heap `PriorityQueue` in Java?
Back: Use `PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());`.<br>You can also pass a custom comparator like `new PriorityQueue<>((a, b) -> Integer.compare(b, a))`.<br>Without a comparator, `PriorityQueue` is a min-heap.
END

START
Basic
What does `Deque.descendingIterator()` return?
Back: It returns an `Iterator<E>` that traverses the deque from tail to head without removing elements unless you explicitly call `remove()`.<br>It is useful for reverse-order processing of an `ArrayDeque` or `LinkedList`.
END

START
Basic
What stack methods does `Deque` provide?
Back: `push(e)` means `addFirst(e)`, `pop()` means `removeFirst()`, and `peek()` means `peekFirst()`.<br>These are the standard LIFO stack operations.<br>The legacy `Stack` class should generally be avoided in favor of `ArrayDeque`.
END

START
Basic
What does `LinkedList` uniquely implement that `ArrayDeque` does not?
Back: `LinkedList` implements both `List` and `Deque`, so it supports positional methods like `get(index)`, `add(index, e)`, and `remove(index)` in addition to deque operations.<br>`ArrayDeque` only implements `Deque`.<br>But positional access on `LinkedList` is O(n), so this is rarely a performance advantage.
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
