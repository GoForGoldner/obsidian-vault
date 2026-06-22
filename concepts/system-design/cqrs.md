---
tags: [system-design, architecture, cqrs]
category: system-design
related: [event-sourcing-pattern, message-queue]
---

## Description
CQRS (Command Query Responsibility Segregation) splits the **write model** (commands that change state) from the **read model** (queries that return data). A command mutates state and returns only success/failure — never data; a query returns data and never mutates state. The two sides can use different models, schemas, or even different databases tuned for their job (normalized for writes, denormalized for reads). The biggest misconception: CQRS does **not** require two databases or any specific storage — separate code paths/models are enough. CQRS is independent of Event Sourcing; they pair well (ES on the write side feeding read-side projections) but neither requires the other.

## Examples
```
Command side (writes)            Query side (reads)
-----------------------          -----------------------
PlaceOrderCommand        --->     OrderSummaryView (denormalized)
  validates, mutates,            optimized for fast reads,
  returns OK / failure           returns data, never mutates

       \                                 ^
        \  (optional) emits events       |  projections subscribe
         \-----------------> Event log ---/   to events and update views
```

## Related Topics
- [[event-sourcing-pattern]]
- [[message-queue]]

## Cards

```anki
START
Basic
What does CQRS actually separate, and what does a "command" return vs a "query"?
Back: It separates the write model (commands) from the read model (queries).<br>A command changes state and returns only success/failure (no data); a query returns data and never mutates state.
<!--ID: 1782144297879-->
END

START
Basic
You're told a system "uses CQRS." Does that mean it must have two separate databases?
Back: No. CQRS only mandates separate write (command) and read (query) models/code paths.<br>They can share one database — separate schemas, views, or even just separate interfaces satisfy it. Two stores is an option, not a requirement.
<!--ID: 1782144297882-->
END

START
Basic
When does Event Sourcing naturally fit onto the write side of a CQRS system?
Back: When the command side appends events (e.g. `OrderPlaced`) instead of updating a current-state table, and read-side projections subscribe to those events to build denormalized query models.<br>Either pattern can be used without the other — see [[event-sourcing-pattern]].
<!--ID: 1782144297885-->
END

START
Basic
What's the main cost/risk CQRS introduces?
Back: Two models to keep in sync — the read side is often eventually consistent (it lags the write side), so reads can briefly return stale data.<br>It adds complexity, so reserve CQRS for areas where read and write workloads genuinely diverge.
<!--ID: 1782144297888-->
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
