---
tags: [design-pattern, architectural]
category: patterns
related: [dependency-injection-pattern, orm]
---

## Description
An abstraction layer between your business logic and data access. Instead of querying the database directly in your services, you go through a repository that handles all the data operations.

## Benefits
- Easy to swap data sources (SQL to NoSQL, real to mock)
- Business logic stays clean of persistence details
- Makes unit testing straightforward

## Downsides
- Extra layer of abstraction that can feel like boilerplate
- Can be overkill for simple CRUD apps


## Examples
```java
interface UserRepository {
    User findById(int id);
    List<User> findAll();
    void save(User user);
    void delete(int id);
}

class SqlUserRepository implements UserRepository {
    public User findById(int id) {
        return jdbc.query("SELECT * FROM users WHERE id = ?", id);
    }
    // ... other methods hit the real database
}

class FakeUserRepository implements UserRepository {
    private Map<Integer, User> store = new HashMap<>();
    public User findById(int id) { return store.get(id); }
    // ... in-memory for unit tests
}

// Service doesn't know which one it's using
class UserService {
    private UserRepository repo;
    UserService(UserRepository repo) { this.repo = repo; }
}
```

## Related Topics
- [[dependency-injection-pattern|Dependency Injection]]
- [[orm|ORM]]
- Unit of Work
- [[dependency-inversion|SOLID Principles]]
- [[mock-vs-stub|Mock vs Stub]]

## Cards

```anki
START
Basic
You see: business logic tightly coupled to database queries. What pattern?
Back: Repository - abstract data access behind an interface (GetById, GetAll, Add, Update, Delete). Services call the repository, not the DB directly. Swap real repo for a mock in tests.
<!--ID: 1773439958689-->
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
