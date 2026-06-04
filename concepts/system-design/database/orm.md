---
tags: [database, backend]
category: system-design
related: [sql, repository-pattern]
---

## Description
Object-Relational Mapping. A tool that lets you interact with a database using objects in your programming language instead of writing raw SQL. Classes map to tables, properties map to columns, and the ORM generates SQL for you. Examples: Hibernate (Java), Entity Framework (C#), Prisma (JS/TS).

## Benefits
- Write less SQL, more productive
- Database-agnostic (switch from MySQL to Postgres easier)
- Handles common patterns (migrations, relationships) out of the box

## Downsides
- N+1 query problem (lazy loading fires too many queries)
- Generated SQL can be inefficient for complex queries
- Hides what's actually happening at the DB level


## Examples
```java
// Without ORM (raw SQL)
ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE id = 1");
User user = new User(rs.getString("name"), rs.getInt("age"));

// With ORM (JPA/Hibernate)
@Entity
class User {
    @Id long id;
    String name;
    int age;
}
User user = entityManager.find(User.class, 1L); // ORM generates the SQL

// N+1 problem:
List<Order> orders = orderRepo.findAll();     // 1 query
for (Order o : orders) o.getItems();          // N queries! (lazy loading)
// Fix: @Query("SELECT o FROM Order o JOIN FETCH o.items")
```

## Related Topics
- [[sql|SQL]]
- [[repository-pattern|Repository Pattern]]
- [[orm|Database Migrations]]
- [[orm|N+1 Query Problem]]
- [[iterator-pattern|LINQ]]

## Cards

```anki
START
Basic
What is an ORM and what's the main gotcha?
Back: Object-Relational Mapping - maps classes to tables, generates SQL from code. Main gotcha: N+1 query problem (loading a list then lazy-loading each item's children = 1 + N queries). Fix with eager loading (JOIN FETCH in JPA, .include() in Rails). Use raw SQL for complex/performance-critical queries.
<!--ID: 1773439958535-->
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
