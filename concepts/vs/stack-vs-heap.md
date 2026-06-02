---
tags: [memory, comparison]
category: vs
related: [stack-and-heap, garbage-collection]
---

## Description
Stack is fast, ordered memory for local variables and function calls. automatically freed when a function returns. Heap is slower, unordered memory for dynamically allocated objects. must be freed manually or by garbage collection. Stack is small and fixed-size; heap is large but requires management.
## Examples
```java
void example() {
    int x = 5;                  // stack
    String name = "hello";      // reference on stack, object on heap
    int[] arr = new int[1000];  // reference on stack, array on heap
}
// x is gone. name and arr eligible for GC.
```

## Related Topics
- [[stack-and-heap|Stack and Heap]]
- [[garbage-collection|Garbage Collection]]
- [[garbage-collection|Memory Leaks]]
- Stack Overflow
- [[stack-and-heap|Value vs Reference Types]]

## Cards

```anki
START
Basic
What goes on the stack vs the heap?
Back: Stack: local variables, call frames, value types - fast (pointer move), auto-freed. Heap: dynamic objects, reference types - slower (needs GC), lives beyond function scope. Stack overflow = deep recursion. Memory leak = heap objects still referenced but unused.
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
