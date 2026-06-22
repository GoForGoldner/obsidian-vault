---
tags: [spring, jpa, hql, jpql, database]
category: spring
related: [spring-data-jpa, spring-data-query-methods]
---

## Description
JPQL (Jakarta Persistence Query Language) is the query language you write inside `@Query`. HQL (Hibernate Query Language) is Hibernate's superset of JPQL — same syntax plus a few extras. The single most important idea: **JPQL/HQL queries operate on your entity classes and their Java fields, not on database tables and columns.** You write `select u from User u where u.emailAddress = :email` even if the table is `users` and the column is `email_addr`. Spring's `@Query` defaults to JPQL; set `nativeQuery = true` to drop down to raw SQL (which then *does* use table/column names and loses portability). Most JPQL bugs come from treating it like SQL: referencing table names, forgetting that joins traverse object paths, or hitting `LazyInitializationException` because you didn't `join fetch`.

## Examples
```java
public interface UserRepository extends JpaRepository<User, Long> {

    // Named parameter — JPQL refers to the entity (User) and field (u.email), not the table
    @Query("select u from User u where u.email = :email")
    Optional<User> findByEmailJpql(@Param("email") String email);

    // Positional parameters use ?1, ?2 (1-based)
    @Query("select u from User u where u.status = ?1 and u.age > ?2")
    List<User> search(UserStatus status, int age);

    // JOIN FETCH eagerly loads an association in one query → avoids N+1 / LazyInitializationException
    @Query("select u from User u left join fetch u.roles where u.id = :id")
    Optional<User> findWithRoles(@Param("id") Long id);

    // Implicit join by walking the object path (u.address.city), no explicit JOIN needed
    @Query("select u from User u where u.address.city = :city")
    List<User> findByCity(@Param("city") String city);

    // Constructor expression / DTO projection — must use the fully-qualified class name
    @Query("select new com.example.UserSummary(u.name, u.email) from User u")
    List<UserSummary> summaries();

    // LIKE with a parameter: you must CONCAT the wildcards, you cannot write %:term%
    @Query("select u from User u where u.name like concat('%', :term, '%')")
    List<User> nameContains(@Param("term") String term);

    // Aggregation with GROUP BY / HAVING
    @Query("select u.status, count(u) from User u group by u.status having count(u) > :min")
    List<Object[]> statusCounts(@Param("min") long min);

    // Bulk UPDATE/DELETE in JPQL REQUIRES @Modifying
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update User u set u.status = :status where u.lastLogin < :cutoff")
    int deactivateStale(@Param("status") UserStatus status, @Param("cutoff") LocalDate cutoff);

    // Native SQL: uses TABLE/COLUMN names, set nativeQuery = true
    @Query(value = "select * from users where email_addr = :email", nativeQuery = true)
    Optional<User> findByEmailNative(@Param("email") String email);

    // Pagination: pass a Pageable and return Page/Slice (don't put LIMIT in JPQL)
    @Query("select u from User u where u.status = :status")
    Page<User> findByStatus(@Param("status") UserStatus status, Pageable pageable);
}
```

| Concern | JPQL / HQL | Native SQL (`nativeQuery = true`) |
| --- | --- | --- |
| Operates on | Entities + fields (`User`, `u.email`) | Tables + columns (`users`, `email_addr`) |
| Portability | DB-independent | Tied to one dialect |
| Joins | Object paths / `join`, `join fetch` | SQL `JOIN` on FK columns |
| `count`/paging derivation | Spring auto-derives count query | Must supply `countQuery` for `Page` |
| When to use | 95% of custom queries | DB-specific features, tuned SQL |

**HQL extras over JPQL:** `select` is optional (`from User u` is valid HQL), more built-in functions, and richer support for things like `insert ... select`. In Spring you rarely need the HQL-only bits — write portable JPQL unless you specifically need Hibernate features.

## Related Topics
- [[spring-data-jpa]]
- [[spring-data-query-methods]]

## Cards

```anki
START
Basic
In JPQL/HQL, do you reference table+column names or entity+field names?
Back: Entity class names and Java field names, e.g. `select u from User u where u.email = :email` — even if the table is `users` and the column is `email_addr`.<br>Only `nativeQuery = true` (raw SQL) uses table/column names.
<!--ID: 1782144297799-->
END

START
Basic
What is HQL vs JPQL, and which does Spring `@Query` use by default?
Back: JPQL (Jakarta Persistence Query Language) is the JPA standard query language; HQL (Hibernate Query Language) is Hibernate's superset of it.<br>`@Query` defaults to JPQL; set `nativeQuery = true` to use raw SQL instead.
<!--ID: 1782144297802-->
END

START
Basic
Why and when do you use `join fetch` in a JPQL query?
Back: `select u from User u left join fetch u.roles where u.id = :id` loads the association in the SAME query.<br>Use it to avoid the N+1 problem and `LazyInitializationException` when you know you'll need a lazy association outside the transaction.
<!--ID: 1782144297805-->
END

START
Basic
JPQL parameters: difference between `:name` and `?1`?
Back: `:name` is a named parameter, bound with `@Param("name")`.<br>`?1` is a positional parameter (1-based), bound by argument order.<br>Prefer named parameters for readability.
<!--ID: 1782144297808-->
END

START
Basic
How do you do a `LIKE '%term%'` search with a bound parameter in JPQL?
Back: You cannot write `like %:term%`. Concatenate the wildcards: `where u.name like concat('%', :term, '%')`.<br>(Spring Data derived `Containing` does this wrapping for you automatically.)
<!--ID: 1782144297811-->
END

START
Basic
How do you return a DTO/projection directly from a JPQL query?
Back: Use a constructor expression with the fully-qualified class name: `select new com.example.UserSummary(u.name, u.email) from User u`.<br>The DTO must have a matching constructor.
<!--ID: 1782144297815-->
END

START
Basic
What annotation must a JPQL `update`/`delete` query have, and why?
Back: `@Modifying` (on top of `@Query`), because by default `@Query` expects a `select`.<br>Often pair it with `@Modifying(clearAutomatically = true, flushAutomatically = true)` so the persistence context isn't left stale after the bulk write, and wrap the caller in `@Transactional`.
<!--ID: 1782144297818-->
END

START
Basic
For a paginated `@Query`, how do you get a `Page` and what's the gotcha with native queries?
Back: Add a `Pageable` parameter and return `Page<T>`/`Slice<T>` — don't put `LIMIT` in the query.<br>For JPQL Spring auto-derives the count query; for `nativeQuery = true` you must supply a `countQuery` yourself.
<!--ID: 1782144297821-->
END

START
Basic
In JPQL, how do you filter on an associated entity's field without an explicit JOIN?
Back: Walk the object path: `select u from User u where u.address.city = :city`.<br>JPA generates the implicit join for you when you traverse a to-one association by path.
<!--ID: 1782144297825-->
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
