---
tags: [memory-management, runtime]
category: patterns
related: [stack-and-heap, process]
---

## Description
Automatic memory management that reclaims memory occupied by objects no longer reachable by the program. The runtime periodically finds and cleans up unused objects on the heap.

## Benefits
- No manual memory management (no free/delete calls)
- Prevents most memory leaks and dangling pointers
- Simpler code compared to manual memory management

## Downsides
- GC pauses can cause latency spikes
- Less control over when memory is freed
- Uses extra CPU for tracking object references


## Examples
```java
void process() {
    // obj is allocated on the heap
    Object obj = new Object();
    doSomething(obj);
}   // obj goes out of scope - eligible for GC

// Memory leak: static list keeps references forever
static List<Object> leaky = new ArrayList<>();
void leakyMethod() {
    leaky.add(new byte[1024 * 1024]);  // GC can't free this - still referenced
}
```

## Related Topics
- [[stack-and-heap|Stack and Heap]]
- [[garbage-collection|Memory Leaks]]
- [[garbage-collection|Reference Counting]]
- [[garbage-collection|Mark-and-Sweep]]
- [[garbage-collection|Dispose Pattern]]

## Cards

```anki
START
Basic
What is garbage collection and can you still get memory leaks with it?
Back: Runtime automatically frees heap objects no longer reachable. Mark-and-Sweep: pause, mark all reachable objects from roots, sweep unmarked. Yes, you can still leak — if objects are technically reachable but unused (static collections, unclosed event handlers, closures capturing references). GC can't read your intent, only your references.
<!--ID: 1773439958623-->
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
