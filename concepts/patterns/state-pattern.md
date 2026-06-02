---
tags: [design-pattern, behavioral]
category: patterns
related: [stradegy-pattern, command-pattern]
---

## Description
A pattern where an object changes its behavior based on its internal state. Instead of giant if/else or switch blocks, each state is its own class that handles the behavior for that state.

## Benefits
- Clean state transitions without massive conditionals
- Easy to add new states without touching existing ones
- Each state class is focused and simple

## Downsides
- Lots of small state classes
- Can be overkill for objects with only a few states


## Examples
```java
interface VendingState {
    void insertMoney(VendingMachine m);
    void dispense(VendingMachine m);
}

class IdleState implements VendingState {
    public void insertMoney(VendingMachine m) { m.setState(new HasMoneyState()); }
    public void dispense(VendingMachine m)    { System.out.println("Insert money first"); }
}

class HasMoneyState implements VendingState {
    public void insertMoney(VendingMachine m) { System.out.println("Already has money"); }
    public void dispense(VendingMachine m)    { m.setState(new IdleState()); /* dispense */ }
}

class VendingMachine {
    private VendingState state = new IdleState();
    void setState(VendingState s) { state = s; }
    void insertMoney() { state.insertMoney(this); }
    void dispense()    { state.dispense(this); }
}
```

## Related Topics
- [[stradegy-pattern|Strategy Pattern]]
- [[state-pattern|Finite State Machines]]
- [[command-pattern|Command Pattern]]

## Cards

```anki
START
Basic
You see: object behavior changes based on internal state, lots of if/else checking state. What pattern?
Back: State - extract each state into its own class, object delegates to the current one. Adding new states doesn't touch existing code. Use State when transitions are internal; Strategy when the caller picks the behavior.
<!--ID: 1773439958711-->
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
