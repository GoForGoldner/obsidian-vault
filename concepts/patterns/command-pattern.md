---
tags: [design-pattern, behavioral]
category: patterns
related: [event-sourcing-pattern, mediator-pattern, chain-of-responsibility-pattern]
---

## Description
A pattern that encapsulates a request or operation into a single object. Operations become first-class objects that can be stored, queued, and replayed.

## Benefits
- Supports undo/redo by storing command history
- Operations can be queued, logged, or scheduled
- Works well with event sourcing

## Downsides
- Lots of small command classes
- Can overcomplicate simple operations


## Examples
```java
interface Command {
    void execute();
    void undo();
}

class AddTextCommand implements Command {
    private Document doc;
    private String text;

    void execute() { doc.append(text); }
    void undo()    { doc.removeLast(text.length()); }
}

// Invoker maintains history
Stack<Command> history = new Stack<>();
Command cmd = new AddTextCommand(doc, "hello");
cmd.execute();
history.push(cmd);

// Undo
history.pop().undo();
```

## Related Topics
- [[event-sourcing-pattern|Event Sourcing]]
- [[mediator-pattern|Mediator Pattern]]
- [[command-pattern|Undo/Redo]]
- [[event-sourcing-pattern|CQRS]]

## Cards

```anki
START
Basic
You see: need to queue operations, support undo/redo, or log every action. What pattern?
Back: Command - encapsulate each operation as an object with Execute() and Undo(). Store in a stack for undo, replay for event sourcing.
<!--ID: 1773439958601-->
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
