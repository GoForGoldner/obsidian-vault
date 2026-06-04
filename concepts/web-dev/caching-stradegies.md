---
tags: [web-dev, performance]
category: web-dev
related: [load-balancing, database-indexes]
---

## Description
Storing frequently accessed data in a fast layer (memory) to avoid expensive recomputation or database hits. Main strategies: Cache-Aside (app checks cache first, loads from DB on miss), Write-Through (write to cache and DB together), Write-Behind (write to cache, async write to DB), Read-Through (cache loads from DB on miss).

## Benefits
- Much faster reads (memory vs disk)
- Reduces database load
- Smooths out traffic spikes

## Downsides
- Stale data if cache isn't invalidated properly
- Cache invalidation is notoriously hard to get right
- Extra infrastructure (Redis, Memcached)


## Examples
```java
// Cache-Aside (most common)
User getUser(int id) {
    User cached = redis.get("user:" + id);     // check cache
    if (cached != null) return cached;          // cache hit

    User user = db.findById(id);               // cache miss → DB
    redis.set("user:" + id, user, TTL_5_MIN);  // store in cache
    return user;
}

// Write-Through: write to cache AND DB on every write
void updateUser(User u) {
    db.save(u);
    redis.set("user:" + u.getId(), u);  // always in sync, slower writes
}
```

## Related Topics
- [[caching-stradegies|Redis]]
- [[caching-stradegies|CDN]]
- [[database-indexes|Database Indexes]]
- [[eventual-consistency|Eventual Consistency]]
- [[caching-stradegies|TTL]]

## Cards

```anki
START
Basic
Why is cache invalidation considered the hardest problem, and how does TTL help?
Back: You must decide WHEN cached data is stale — too early wastes cache hits, too late serves wrong data. No perfect signal for "data changed." TTL (Time-To-Live) auto-expires entries after N seconds — a pragmatic compromise. For stronger consistency, invalidate on write (delete cache key when DB updates). Cache-Aside is most common: check cache → miss → load from DB → store in cache.
<!--ID: 1773439959045-->
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
