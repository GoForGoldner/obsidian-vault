---
epoch: 1781611976854
modelKey: "deepseek-v4-flash|deepseek"
topic: "Spring Boot Query Method Naming"



tags:
  - copilot-conversation
---

**user**: help me understand this card and naming queries in spring boot. prob make more cards too: Common prefixes are findBy, countBy, existsBy, and deleteBy.
You can chain operators like And, Or, Between, LessThan, GreaterThan, Containing, In, and OrderBy.
Example: List<User> findByAgeGreaterThanAndNameContainingOrderByNameAsc(int age, String name);.
[Timestamp: 2026/06/16 08:12:56]

**ai**: The `findBy`, `countBy`, `existsBy`, `deleteBy` prefixes are the core of Spring Data JPA’s **query derivation** — you declare a method signature, and Spring generates the SQL automatically.  

- `findBy` – returns a collection or optional.  
- `countBy` – returns `long`.  
- `existsBy` – returns `boolean`.  
- `deleteBy` – returns `void` or `int` (number of deleted rows).  

The method name after the prefix is a chain of property expressions and operators. For example:  
`findByAgeGreaterThanAndNameContainingOrderByNameAsc(age, name)` →  
`WHERE age > ?1 AND name LIKE '%' || ?2 || '%' ORDER BY name ASC`.

Key operators: `And`, `Or`, `Between`, `LessThan`, `GreaterThan`, `Containing`, `In`, `OrderBy`, `IsNull`, `NotNull`, `StartingWith`, `EndingWith`, `After`, `Before`, etc.

---

I’ve captured this concept in a new note [[spring-data-query-methods]] with three Anki cards to reinforce the patterns.

**Added [[spring-data-query-methods]].**
[Timestamp: 2026/06/16 08:13:13]

**user**: put the file in the chat window
[Timestamp: 2026/06/16 08:15:12]

**ai**: Here's the note I created:

```markdown
---
tags: [spring, jpa, query-methods]
category: spring-data
related: [jpa-repositories, derived-queries]
---

## Description
Spring Data JPA derives SQL queries from method names using a set of reserved prefixes and operators. Prefixes like `findBy`, `countBy`, `existsBy`, and `deleteBy` define the operation type. Property expressions and chainable operators (`And`, `Or`, `Between`, `LessThan`, `Containing`, `OrderBy`, etc.) compose the rest of the query. This eliminates the need to write custom JPQL or native queries for common cases.

## Examples
- `List<User> findByAgeGreaterThanAndNameContainingOrderByNameAsc(int age, String name)` → `WHERE age > ? AND name LIKE '%' || ? || '%' ORDER BY name ASC`
- `boolean existsByEmail(String email)` → generates `SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END FROM User WHERE email = ?`
- `int deleteByStatus(String status)` → `DELETE FROM User WHERE status = ?`

## Related Topics
- Spring Data Repository interfaces (JpaRepository, CrudRepository)
- JPQL / @Query annotation
- Specification / Criteria API for dynamic queries
- Method naming conventions in Spring Data

## Cards

START
Recognition
You see this method: boolean existsByEmail(String email)
What does it return when no user with that email exists?
Back: false (Spring generates a SELECT COUNT query and maps to boolean)
END

START
Template
Write a Spring Data method to find all users older than 18 whose name starts with "A", ordered by registration date descending.
Back: List<User> findByAgeGreaterThanAndNameStartingWithOrderByRegistrationDateDesc(int age, String prefix)
END

START
Gotcha
Is deleteBy transactional by default? What happens if it's called inside a transaction without a @Modifying annotation?
Back: deleteBy requires @Transactional and @Modifying. Without @Modifying, Spring Data throws an exception because the derived delete still expects a modifying query to be marked.
END
```
[Timestamp: 2026/06/16 08:15:20]

**user**: explain this step by step: findByAgeGreaterThanAndNameContainingOrderByNameAsc
[Timestamp: 2026/06/16 08:17:39]

**ai**: Here's how Spring Data JPA parses `findByAgeGreaterThanAndNameContainingOrderByNameAsc` step by step:

---

### 1. Strip the prefix → `findBy`
- Recognizes `findBy` → this is a **select** query returning a collection (or `Optional`).  
- Other prefixes (`countBy`, `existsBy`, `deleteBy`) would change the return type and SQL.

### 2. Split on `And`, `Or`, `OrderBy`
- The parser looks for these logical keywords first, then breaks the rest into property expressions.

**Parts after `findBy`:**
1. `AgeGreaterThan`
2. `And` (separator)
3. `NameContaining`
4. `OrderByNameAsc`

### 3. Decompose each property expression
Each part like `AgeGreaterThan` is a **property name** + **operator**.  
Spring Data uses a **property traversal algorithm**:

- Walk the entity’s fields (camelCase).  
- Try the longest possible match for a property name, then look for an operator keyword after it.

| Part                | Property     | Operator       | Meaning                         |
|---------------------|--------------|----------------|----------------------------------|
| `AgeGreaterThan`    | `age`        | `GreaterThan`  | `WHERE age > :param1`           |
| `NameContaining`    | `name`       | `Containing`   | `WHERE name LIKE '%' || :param2 || '%'` |
| `OrderByNameAsc`    | `name`       | `OrderBy` + `Asc` | `ORDER BY name ASC`           |

### 4. Map method parameters to placeholders
The method signature:
```java
List<User> findByAgeGreaterThanAndNameContainingOrderByNameAsc(int age, String name);
```
- First parameter `int age` → maps to `GreaterThan` in first clause.
- Second parameter `String name` → maps to `Containing` in second clause.
- `OrderBy` does not consume a parameter; it's a sorting instruction.

### 5. Generate SQL
```sql
SELECT * FROM user
WHERE age > ?
  AND name LIKE '%' || ? || '%'
ORDER BY name ASC
```

### 6. (Optional) `Asc` / `Desc` on each sort property
You could chain multiple `OrderBy` properties:  
`OrderByNameAscOrderByAgeDesc` → `ORDER BY name ASC, age DESC`.

---

That’s the full pipeline: prefix → split on `And`/`Or` → property + operator → parameter binding → SQL.

Want me to add a card specifically for this parsing process?
[Timestamp: 2026/06/16 08:17:49]