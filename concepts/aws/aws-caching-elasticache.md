---
tags: [aws, saa-c03, caching, performance, domain-3]
category: aws
related: [aws-dynamodb, aws-rds-aurora, caching-stradegies, distributed-cache, aws-hybrid-connectivity]
---
TARGET DECK: Study::AWS::Databases

## Description
Caching appears across all four domains — as a performance answer, a cost answer (fewer database reads), and a scaling answer. AWS gives you four distinct caching layers, and the exam tests which layer the problem belongs to.

**Amazon ElastiCache** — managed in-memory datastore, two engines:

| | **Redis** | **Memcached** |
|---|---|---|
| Data structures | Lists, sets, sorted sets, hashes | Strings only |
| Persistence | **Yes** (snapshots, AOF) | No |
| Replication / HA | **Yes** — Multi-AZ, automatic failover | No |
| Multi-threaded | No (mostly) | **Yes** |
| Pub/Sub, transactions, Lua | Yes | No |
| Scale | Sharding via cluster mode | Simple horizontal partitioning |

The rule: **if the question mentions persistence, high availability, replication, sorted sets, leaderboards, or pub/sub → Redis.** Memcached is only correct for a simple, pure, disposable cache where you want multi-threaded scale-out and don't care about losing it.

**DAX** — DynamoDB-only, microsecond reads, no application code changes.

**CloudFront** — caches at the *edge*, close to users. Not a database cache: it fronts HTTP content (S3 objects, ALB responses, API Gateway). The answer for "global users, static or cacheable content, reduce origin load."

**API Gateway caching** — caches API responses at the API layer.

Two application-level patterns the exam expects you to name:
- **Lazy loading (cache-aside)** — read cache; on miss, read the DB and populate. Only requested data is cached, but every miss costs a round trip and data can go stale.
- **Write-through** — write to cache and DB together. Cache is always fresh, but you cache data nobody reads and writes get slower.

**TTL** is the usual answer to "cached data is stale."

Classic exam pattern: **session state in ElastiCache Redis** to make an application stateless so it can scale horizontally behind an ALB — a strictly better answer than ALB sticky sessions.

## Examples
```
Which caching layer:

"Static images slow for global users"          → CloudFront (edge)
"Same expensive SQL query hammering RDS"       → ElastiCache (cache-aside)
"DynamoDB reads need microseconds"             → DAX
"Users lose sessions when instances scale in"  → ElastiCache Redis for session state
"Real-time gaming leaderboard, top 100"        → Redis sorted sets
"Repeated identical API responses"             → API Gateway caching
```

```
Lazy loading (cache-aside) — the default pattern:

  read(key):
      v = cache.get(key)
      if v is None:              # cache miss
          v = db.query(key)
          cache.set(key, v, ttl=300)
      return v

  Pro: only cache what's asked for; cache failure isn't fatal
  Con: every miss = 3 trips; data can be stale until TTL expires
```

```
Redis vs Memcached — read the requirement words:

"must survive a node failure"      → Redis (replication + Multi-AZ failover)
"leaderboard / ranked set"         → Redis (sorted sets)
"pub/sub messaging"                → Redis
"persist the cache across restart" → Redis
"simple, largest possible cache,
 multi-threaded, loss is fine"     → Memcached
```

## Related Topics
- Cache-aside vs write-through vs write-behind
- Cache invalidation and TTL
- Session state externalization
- CDN and edge caching
- In-memory data structures

## Cards

```anki
START
Basic
ElastiCache: The requirement mentions a leaderboard with ranked scores. Redis or Memcached — and what's the giveaway?
Back: Redis — sorted sets. Memcached stores strings only, with no data structures to rank with.
<!--ID: 1788139020009-->
END

START
Basic
ElastiCache: The cache must survive a node failure without data loss. Which engine?
Back: Redis — it supports replication, Multi-AZ, and automatic failover, plus persistence. Memcached has none of these.
<!--ID: 1788139020016-->
END

START
Basic
ElastiCache: When is Memcached actually the right answer?
Back: A simple, disposable, pure key-value cache where you want multi-threaded performance and horizontal scale-out, and losing the cache is harmless.
Rare on the exam — most scenarios name a Redis-only feature.
<!--ID: 1788139020024-->
END

START
Basic
Caching: Describe lazy loading and its main downside.
Back: Read the cache; on a miss, query the DB and populate the cache. Downside: every miss costs three trips, and cached data goes stale until its TTL expires.
<!--ID: 1788139020031-->
END

START
Basic
Caching: When would you choose write-through over lazy loading?
Back: When stale data is unacceptable — writing to cache and DB together keeps the cache always fresh. Cost: slower writes and caching data nobody may ever read.
<!--ID: 1788139020037-->
END

START
Basic
Caching: Users are logged out when the ASG scales in. What's the architecturally correct fix?
Back: Move session state into ElastiCache Redis so the app becomes stateless and any instance can serve any request. Sticky sessions only mask the problem.
<!--ID: 1788139020042-->
END

START
Basic
Caching: The origin is an ALB and global users see slow page loads for mostly-cacheable content. Which layer?
Back: CloudFront — caches at edge locations near users. ElastiCache would sit next to the origin and not help with the geographic latency.
<!--ID: 1788139020048-->
END

START
Basic
Caching: Why is DAX preferred over ElastiCache in front of DynamoDB?
Back: DAX is API-compatible with DynamoDB, so it needs no cache-aside logic in your code, and it delivers microsecond reads. ElastiCache would require you to write and maintain the caching layer.
<!--ID: 1788139020056-->
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
