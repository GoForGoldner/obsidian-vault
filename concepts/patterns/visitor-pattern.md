---
tags: [design-pattern, behavioral]
category: patterns
related: [iterator-pattern, command-pattern]
---

## Description
A pattern that lets you add new operations to existing object structures without modifying their classes. Each element "accepts" a visitor and calls the right method on it.

## Benefits
- Add new operations without changing existing types
- Related operations are grouped in one visitor class
- Useful for stable type hierarchies with frequent new operations

## Downsides
- Adding a new element type forces changes to all visitors
- Breaks encapsulation (visitors access element internals)
- Can get complex with deep hierarchies


## Examples
```java
interface ASTVisitor {
    void visit(IfNode node);
    void visit(ForNode node);
    void visit(AssignNode node);
}

interface ASTNode {
    void accept(ASTVisitor v);
}

class IfNode implements ASTNode {
    public void accept(ASTVisitor v) { v.visit(this); } // double dispatch
}

// Add new operations without touching node classes
class TypeChecker implements ASTVisitor {
    public void visit(IfNode n)     { /* type check if */ }
    public void visit(ForNode n)    { /* type check for */ }
    public void visit(AssignNode n) { /* type check assign */ }
}

class CodeGenerator implements ASTVisitor { ... } // another operation, no node changes
```

## Related Topics
- [[iterator-pattern|Iterator Pattern]]
- [[command-pattern|Command Pattern]]
- [[visitor-pattern|Double Dispatch]]
- [[visitor-pattern|Abstract Syntax Tree]]

## Cards

```anki
START
Basic
You see: stable class hierarchy but you keep adding new operations across all types. What pattern?
Back: Visitor - define a visitor with a Visit method per type. New operations = new visitors, no class changes. Tradeoff: easy to add operations, hard to add new types. Uses double dispatch.
<!--ID: 1773439958739-->
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
