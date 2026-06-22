---
tags: [design-pattern, architectural]
category: patterns
related: [command-pattern, message-queue]
---

## Description
A pattern that stores all changes to application state as a sequence of events instead of just storing the current state. You can rebuild state by replaying events.

## Benefits
- Full audit trail of everything that happened
- Can rebuild state to any point in time
- Supports undo and temporal queries

## Downsides
- Storage grows over time (every event is kept)
- Querying current state requires replaying events (or maintaining projections)
- More complex than CRUD


## Examples
```java
// Instead of storing current state:
// account.balance = 150

// Store events:
List<Event> events = List.of(
    new Deposited(100),   // balance: 100
    new Deposited(100),   // balance: 200
    new Withdrew(50)      // balance: 150
);

// Rebuild state by replaying
int balance = 0;
for (Event e : events) {
    balance = e.apply(balance);
}
// balance = 150

// Undo last event? Remove it and replay.
// Audit? Read the event log.
// Time travel? Replay up to any point.
```

## Related Topics
- [[command-pattern|Command Pattern]]
- [[message-queue|Message Queue]]
- [[event-sourcing-pattern|CQRS]]
- [[event-sourcing-pattern|Audit Log]]

## Cards

```anki
START
Basic
In Event Sourcing, what do you store instead of current state, and how do you get current state?
Back: You store an append-only log of events (e.g. `Deposited(100)`, `Withdrew(50)`), not the current value.<br>Current state is derived by replaying the events; snapshots/projections avoid replaying from the beginning every time.
<!--ID: 1782144297913-->
END

START
Basic
What are the main costs of Event Sourcing, and how are they mitigated?
Back: The event log grows forever, and reconstructing current state requires replay.<br>Mitigate replay cost with periodic SNAPSHOTS and read-side PROJECTIONS (materialized views) that subscribe to events.<br>It's more complex than CRUD — use it when audit, temporal queries, or undo really matter.
<!--ID: 1782144297916-->
END

START
Basic
How do Event Sourcing and CQRS fit together?
Back: They're independent patterns that pair well: ES is the write-side store (append events); CQRS's read side builds query-optimized projections from those events.<br>You can use either without the other. See [[cqrs]].
<!--ID: 1782144297919-->
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
