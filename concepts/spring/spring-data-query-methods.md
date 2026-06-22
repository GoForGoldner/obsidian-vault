---
tags: [spring, jpa, query-methods]
category: spring
related: [spring-data-jpa, jpql-hql]
---

## Description
Spring Data JPA derives the query from the **method name**: you declare a signature on a repository interface and Spring parses the name into a query — no body, no `@Query`. The parser strips an introducing keyword (`findBy`, `readBy`, `getBy`, `queryBy`, `countBy`, `existsBy`, `deleteBy`/`removeBy`), then walks the rest as a chain of property expressions joined by `And`/`Or`, optionally ending in `OrderBy`. The subject of the method (between the prefix and `By`) can add limiting/distinct (`findFirst10`, `findDistinctBy`). Parameters bind to the operators **in order**. The two big traps: (1) **property-name ambiguity** — the parser greedily matches the longest field name, so use an underscore (`findByAddress_City`) to force the boundary; and (2) thinking derived `deleteBy` needs `@Modifying` — it does **not** (only `@Query`-based update/delete does).

## Examples
```java
public interface UserRepository extends JpaRepository<User, Long> {

    // prefix(findBy) + AgeGreaterThan(age > ?) + And + NameContaining(LIKE %?%) + OrderByNameAsc
    List<User> findByAgeGreaterThanAndNameContainingOrderByNameAsc(int age, String name);

    // existsBy → boolean,  countBy → long
    boolean existsByEmail(String email);
    long countByStatus(UserStatus status);

    // Limiting the result set: First / Top, optional number
    Optional<User> findFirstByOrderByCreatedAtDesc();        // newest single row
    List<User> findTop5ByStatusOrderByCreatedAtDesc(UserStatus status);

    // Distinct
    List<User> findDistinctByStatus(UserStatus status);

    // IgnoreCase (per-property or all clauses)
    List<User> findByNameIgnoreCase(String name);

    // Collection membership and null checks
    List<User> findByStatusIn(Collection<UserStatus> statuses);
    List<User> findByDeletedAtIsNull();

    // Dates: After / Before read better than GreaterThan / LessThan
    List<User> findByCreatedAtAfter(LocalDate cutoff);

    // Disambiguate nested property with an underscore (address.city)
    List<User> findByAddress_City(String city);

    // Pagination / sorting are passed as arguments, NOT baked into the name
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    List<User> findByStatus(UserStatus status, Sort sort);

    // Derived delete: NO @Modifying needed; wrap caller in @Transactional.
    // Returning long = bulk count; returning List<User> loads then deletes (fires callbacks).
    long deleteByStatus(UserStatus status);
    List<User> removeByStatus(UserStatus status);
}
```

| Need | Keyword(s) | Generated SQL fragment |
| --- | --- | --- |
| Equality | (property only) | `prop = ?` |
| Comparison | `GreaterThan`, `LessThanEqual`, `Between` | `prop > ?`, `prop <= ?`, `prop between ? and ?` |
| Dates | `After`, `Before` | `prop > ?`, `prop < ?` |
| Null | `IsNull`, `IsNotNull` | `prop is null` / `is not null` |
| String | `Containing`, `StartingWith`, `EndingWith`, `Like` | auto-wraps `%`, e.g. `like '%?%'` |
| Set | `In`, `NotIn` | `prop in (?)` |
| Boolean | `True`, `False` | `prop = true` |
| Case | `IgnoreCase` | `lower(prop) = lower(?)` |
| Sort | `OrderBy...Asc/Desc` | `order by prop asc` |
| Limit | `First`, `Top`, `FirstN`/`TopN` | provider `LIMIT` |
| Dedup | `Distinct` | `select distinct` |

**When to stop using derived names:** once the method name gets unreadable (multiple joins, fetches, projections, OR-heavy logic), switch to `@Query` JPQL — see [[jpql-hql]]. Rule of thumb: if you have to read the name twice to parse it, write the JPQL instead.

## Related Topics
- [[spring-data-jpa]]
- [[jpql-hql]]

## Cards

```anki
START
Basic
What does the introducing keyword (`findBy`/`countBy`/`existsBy`/`deleteBy`) of a derived method determine?
Back: The operation type and return shape.<br>`findBy`/`readBy`/`getBy`/`queryBy` → entities (`List`, `Optional`, `Page`...).<br>`countBy` → `long`. `existsBy` → `boolean`. `deleteBy`/`removeBy` → `long`/`void` (or the removed entities).
<!--ID: 1782144297838-->
END

START
Basic
How does Spring Data resolve which field `findByAddressCity` refers to, and how do you force the boundary?
Back: The parser greedily matches the LONGEST property name first (so it may pick `addressCity` if such a field exists).<br>Insert an underscore to force the split: `findByAddress_City` → traverse `address` then `city`.
<!--ID: 1782144297841-->
END

START
Basic
Does a derived `deleteByStatus(...)` method need `@Modifying`?
Back: No. Derived delete/remove methods are handled by Spring automatically (just wrap the caller in `@Transactional`).<br>`@Modifying` is only required for `@Query`-based update/delete JPQL.
<!--ID: 1782144297844-->
END

START
Basic
What's the difference between `deleteByStatus` returning `long` vs returning `List<User>`?
Back: Returning `long`/`void` issues a single bulk delete and gives the count.<br>Returning `List<User>` first LOADS the matching entities, then deletes them one-by-one — firing JPA lifecycle callbacks (`@PreRemove`) and cascades. Use the list form only when you need that behavior.
<!--ID: 1782144297847-->
END

START
Basic
How do you limit a derived query to the first/top N rows?
Back: Put `First` or `Top` (optionally with a number) in the subject: `findFirstByOrderByCreatedAtDesc()`, `findTop5ByStatusOrderByCreatedAtDesc(...)`.<br>`First` and `Top` are interchangeable; without a number they mean 1.
<!--ID: 1782144297850-->
END

START
Basic
Write a Spring Data method: users older than 18 whose name starts with "A", ordered by registration date descending.
Back: `List<User> findByAgeGreaterThanAndNameStartingWithOrderByRegistrationDateDesc(int age, String prefix)`.
<!--ID: 1782144297853-->
END

START
Basic
How do you add paging or sorting to a derived query method?
Back: Pass a `Pageable` (returns `Page`/`Slice`) or a `Sort` as a method argument — don't bake it into the name.<br>e.g. `Page<User> findByStatus(UserStatus status, Pageable pageable)`.
<!--ID: 1782144297856-->
END

START
Basic
For a case-insensitive `LIKE '%term%'` derived method, which keywords do you combine?
Back: `Containing` (auto-wraps the value in `%...%`) plus `IgnoreCase`: `findByNameContainingIgnoreCase(String term)`.<br>`StartingWith`/`EndingWith` anchor one side; `Containing` wraps both.
<!--ID: 1782144297860-->
END

START
Basic
For date fields, why prefer `After`/`Before` over `GreaterThan`/`LessThan`?
Back: They generate the same SQL (`>` / `<`) but read more naturally for temporal fields: `findByCreatedAtAfter(LocalDate cutoff)`.<br>Functionally equivalent — it's about readability/intent.
<!--ID: 1782144297863-->
END

START
Basic
When should you abandon a derived method name in favor of `@Query`?
Back: When the name becomes unreadable — multiple joins, `join fetch`, projections, or complex OR logic.<br>Switch to JPQL `@Query` (see [[jpql-hql]]); rule of thumb: if you must read the name twice to parse it, write the query.
<!--ID: 1782144297866-->
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
