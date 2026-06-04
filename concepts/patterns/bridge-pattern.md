---
tags: [design-pattern, structural]
category: patterns
related: [adapter-pattern, stradegy-pattern]
---

## Description
A pattern that separates an abstraction from its implementation so the two can vary independently. Instead of one giant class hierarchy, you split it into two: the "what" (abstraction) and the "how" (implementation), connected by composition.

## Benefits
- Prevents class explosion when combining multiple dimensions of variation
- Abstraction and implementation can change independently

## Downsides
- Adds complexity for simple hierarchies
- Can be overkill if you only have one dimension of variation


## Examples
```java
// Abstraction
abstract class Shape {
    protected Renderer renderer;
    Shape(Renderer renderer) { this.renderer = renderer; }
    abstract void draw();
}

// Implementation
interface Renderer {
    void renderShape(String shape);
}

class Circle extends Shape {
    Circle(Renderer r) { super(r); }
    void draw() { renderer.renderShape("circle"); }
}

class VectorRenderer implements Renderer { ... }
class RasterRenderer implements Renderer { ... }

// Mix and match - no class explosion
new Circle(new VectorRenderer()).draw();
new Circle(new RasterRenderer()).draw();
```

## Related Topics
- [[adapter-pattern|Adapter Pattern]]
- [[stradegy-pattern|Strategy Pattern]]
- [[bridge-pattern|Composition over Inheritance]]
- [[dependency-injection-pattern|Dependency Injection]]

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
