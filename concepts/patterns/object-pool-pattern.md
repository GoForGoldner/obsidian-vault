---
tags: [design-pattern, creational]
category: patterns
related: [singleton-pattern, prototype-pattern]
---

## Description
A pattern that pre-creates and reuses a pool of objects instead of creating and destroying them on demand. Used when object creation is expensive (like database connections or threads).

## Benefits
- Avoids repeated expensive object creation
- Bounded resource usage (pool has a max size)
- Faster access to pre-initialized objects

## Downsides
- Pool sizing is tricky (too small = bottleneck, too large = waste)
- Objects must be properly reset before reuse (stale state bugs)
- Adds management complexity


## Examples
```java
class ConnectionPool {
    private Queue<Connection> available = new LinkedList<>();

    ConnectionPool(int size) {
        for (int i = 0; i < size; i++)
            available.add(createExpensiveConnection()); // pre-create
    }

    Connection borrow() {
        return available.poll();   // take from pool
    }

    void release(Connection conn) {
        conn.reset();              // clean state before returning!
        available.add(conn);       // return to pool
    }
}
```

## Related Topics
- [[singleton-pattern|Singleton Pattern]]
- Database Connection Pooling
- [[thread|Thread Pool]]
- Resource Management

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
