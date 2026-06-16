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