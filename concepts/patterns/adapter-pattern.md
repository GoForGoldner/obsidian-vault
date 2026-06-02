---
tags: [design-pattern, structural]
category: patterns
related: [bridge-pattern, decorator-pattern]
---

## Description
A pattern that converts one interface into another interface that the client expects. Acts as a wrapper/translator between two incompatible systems.

## Benefits
- Reuse legacy code or third party libraries without modifying them
- Gets around incompatible interfaces cleanly

## Downsides
- Extra layer of indirection
- Can get messy if you need lots of adapters


## Examples
```java
// Third-party logger with incompatible interface
class SlackLogger {
    void sendMessage(String channel, String msg) { ... }
}

// Your app's expected interface
interface Logger {
    void log(String message);
}

// Adapter bridges the gap
class SlackLoggerAdapter implements Logger {
    private SlackLogger slack;
    SlackLoggerAdapter(SlackLogger slack) { this.slack = slack; }

    public void log(String message) {
        slack.sendMessage("#logs", message);  // translate the call
    }
}
```

## Related Topics
- [[bridge-pattern|Bridge Pattern]]
- [[decorator-pattern|Decorator Pattern]]
- [[adapter-pattern|Facade Pattern]]
- [[adapter-pattern|Wrapper]]

## Cards

```anki
START
Basic
You see: two classes need to work together but have incompatible interfaces. What pattern?
Back: Adapter - wrap one class to translate its interface to what the other expects. Common when integrating third-party libraries or legacy code.
<!--ID: 1773439958572-->
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
