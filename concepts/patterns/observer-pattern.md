---
tags: [design-pattern, behavioral]
category: patterns
related: [event-sourcing-pattern, mediator-pattern]
---

## Description
A pattern where an object (the subject) maintains a list of dependents (observers) and notifies them automatically when its state changes. Basically a pub/sub system where things subscribe to events and get notified when something happens.

## Benefits
- Loose coupling between subject and observers
- Easy to add new subscribers without changing existing code
- Dynamic registration/deregistration at runtime

## Downsides
- Memory leaks if observers aren't deregistered
- Unexpected cascading updates
- Harder to trace execution flow


## Examples
```java
interface Observer {
    void update(String event);
}

class EventBus {
    private List<Observer> observers = new ArrayList<>();

    void subscribe(Observer o)   { observers.add(o); }
    void unsubscribe(Observer o) { observers.remove(o); }

    void notify(String event) {
        for (Observer o : observers) o.update(event);
    }
}

class EmailService implements Observer {
    public void update(String event) {
        System.out.println("Sending email for: " + event);
    }
}

EventBus bus = new EventBus();
bus.subscribe(new EmailService());
bus.notify("ORDER_PLACED");  // EmailService gets called
```

## Related Topics
- [[event-sourcing-pattern|Event Sourcing]]
- [[mediator-pattern|Mediator Pattern]]
- [[observer-pattern|Pub/Sub]]
- [[observer-pattern|Event-Driven Architecture]]

## Cards

```anki
START
Basic
You see: one object changes and multiple others need to react. What pattern?
Back: Observer - subject maintains a list of observers and notifies all on state change. Direct coupling (subject knows observers). Pub/Sub adds a broker in between for full decoupling. Gotcha: memory leaks if observers don't unsubscribe.
<!--ID: 1773439958663-->
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
