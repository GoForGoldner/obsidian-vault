---
tags: [design-pattern, architectural]
category: patterns
related: [dependency-inversion, repository-pattern, singleton-pattern]
---

## Description
A strategy where you pass dependencies into a class instead of the class creating them itself. Instead of `new`-ing up dependencies in the constructor, you pass them in through an interface.

## Benefits
- Easy to swap implementations (mock DB in tests, real DB in prod)
- Reduces coupling between classes
- Makes unit testing straightforward

## Downsides
- More boilerplate and wiring code
- Often requires a DI framework/container
- Can make it harder to trace where things come from


## Examples
```java
// Interface (abstraction)
interface UserRepository {
    User findById(int id);
}

// Real implementation
class SqlUserRepository implements UserRepository {
    public User findById(int id) { /* SQL query */ }
}

// Service depends on interface, not concrete class
class UserService {
    private UserRepository repo;
    UserService(UserRepository repo) { this.repo = repo; }  // injected

    User getUser(int id) { return repo.findById(id); }
}

// Production: new UserService(new SqlUserRepository())
// Testing:    new UserService(new MockUserRepository())
```

## Related Topics
- [[dependency-inversion|Dependency Inversion Principle]]
- [[repository-pattern|Repository Pattern]]
- [[singleton-pattern|Singleton Pattern]]
- [[dependency-injection-pattern|IoC Container]]
- [[dependency-inversion|SOLID Principles]]

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
