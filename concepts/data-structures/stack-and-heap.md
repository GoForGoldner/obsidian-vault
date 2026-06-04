---
tags: [data-structures, memory]
category: data-structures
related: [garbage-collection, process]
---

## Description
The stack is used for local variables and function call frames. automatically freed when a function returns. The heap is used for dynamically allocated objects that need to live beyond the current function scope.

Memory leak: something allocated on the heap that's never freed.
Stack overflow: too many nested function calls (deep recursion) or very large local allocations.
## Examples
```java
void example() {
    int x = 5;                     // stack - freed when method returns
    int[] arr = new int[100];      // heap - lives until GC collects it
    String name = "hello";         // reference on stack, String object on heap
}

// Stack overflow - too much recursion
void infinite() { infinite(); }

// Memory leak - static list holds references forever
static List<Object> cache = new ArrayList<>();
void leak() { cache.add(new byte[1024 * 1024]); }
```

## Related Topics
- [[garbage-collection|Garbage Collection]]
- [[process|Process]]
- [[stack-vs-heap|Stack vs Heap]]
- [[stack-and-heap|Value vs Reference Types]]

## Cards
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
