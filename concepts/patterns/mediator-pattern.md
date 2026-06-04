---
tags: [design-pattern, behavioral]
category: patterns
related: [observer-pattern, command-pattern]
---

## Description
A pattern that centralizes communication between objects into one mediator class. Instead of objects talking directly to each other (N-to-N), they all talk through the mediator (N-to-1-to-N).

## Benefits
- Reduces coupling between communicating objects
- Centralized control makes communication logic easier to follow

## Downsides
- Mediator can become a god class if it handles too much
- Single point of failure for all communication


## Examples
```java
interface ChatMediator {
    void sendMessage(String msg, User sender);
}

class ChatRoom implements ChatMediator {
    private List<User> users = new ArrayList<>();

    void addUser(User u) { users.add(u); }

    public void sendMessage(String msg, User sender) {
        for (User u : users) {
            if (u != sender) u.receive(msg);  // route to everyone else
        }
    }
}

class User {
    private ChatMediator mediator;
    void send(String msg)    { mediator.sendMessage(msg, this); }
    void receive(String msg) { System.out.println(msg); }
}
```

## Related Topics
- [[observer-pattern|Observer Pattern]]
- [[command-pattern|Command Pattern]]
- [[mediator-pattern|Event Bus]]
- [[mediator-pattern|MediatR Library]]

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
