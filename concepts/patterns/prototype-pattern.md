---
tags: [design-pattern, creational]
category: patterns
related: [builder-pattern, singleton-pattern]
---

## Description
A creational pattern where you create new objects by cloning an existing object (the prototype) instead of constructing from scratch.

## Benefits
- Avoids expensive object creation (just clone)
- Create variations of an object without knowing its concrete class

## Downsides
- Deep copy vs shallow copy can cause subtle bugs
- Objects with circular references are tricky to clone


## Examples
```java
class Enemy implements Cloneable {
    String type;
    int health;
    Weapon weapon;  // reference type - shallow copy shares this!

    public Enemy clone() {
        try {
            Enemy copy = (Enemy) super.clone();
            copy.weapon = this.weapon.clone(); // deep copy the reference
            return copy;
        } catch (CloneNotSupportedException e) { throw new RuntimeException(e); }
    }
}

// Clone and tweak instead of building from scratch
Enemy prototype = new Enemy("orc", 100, new Sword());
Enemy enemy1 = prototype.clone();
Enemy enemy2 = prototype.clone();
enemy2.health = 50;  // customize the clone
```

## Related Topics
- [[builder-pattern|Builder Pattern]]
- Factory Pattern
- Clone/Deep Copy
- Shallow vs Deep Copy

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
