---
tags: [design-pattern, creational]
category: patterns
related: [dependency-injection-pattern, object-pool-pattern]
---

## Description
A pattern that ensures only one instance of a class exists across the entire application. Uses a private constructor and a static access method. Lazily constructed on first access.

## Benefits
- Global access to a shared resource (DB pool, logger, config)
- Lazy initialization saves resources if never used
- Can implement interfaces (unlike static classes)

## Downsides
- Global mutable state makes testing hard
- Hides dependencies (classes secretly depend on it)
- Thread-safety requires extra work (locking or eager init)


## Examples
```java
class DatabasePool {
    private static DatabasePool instance;

    private DatabasePool() {
        // expensive init - connect to DB
    }

    public static synchronized DatabasePool getInstance() {
        if (instance == null) {
            instance = new DatabasePool();  // lazy - created on first call
        }
        return instance;
    }
}

// Thread-safe alternative (preferred in Java):
class DatabasePool {
    private static final DatabasePool INSTANCE = new DatabasePool();
    private DatabasePool() {}
    public static DatabasePool getInstance() { return INSTANCE; }
}
```

## Related Topics
- [[dependency-injection-pattern|Dependency Injection]]
- [[object-pool-pattern|Object Pool Pattern]]
- Static Class
- Thread Safety

## Cards

```anki
START
Basic
What is the Singleton pattern and when do you use it?
Back: One instance globally, private constructor, static access. Lazy-constructed on first call. Use for expensive shared resources (DB connection pools, loggers). Gotcha in multithreaded code: use locking or Lazy<T> to prevent double creation.
<!--ID: 1773439958697-->
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
