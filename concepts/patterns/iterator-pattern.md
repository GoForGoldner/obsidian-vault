---
tags: [design-pattern, behavioral]
category: patterns
related: [visitor-pattern, command-pattern]
---

## Description
A pattern for accessing elements of a collection sequentially without exposing the underlying representation. The collection provides an iterator object that knows how to traverse its elements.

## Benefits
- Uniform interface for traversing different collection types
- Multiple iterators can traverse the same collection independently
- Collection internals stay hidden

## Downsides
- Overhead for simple collections where a for loop works fine
- Custom iterators add boilerplate


## Examples
```java
// Java's Iterator interface
class NumberCollection implements Iterable<Integer> {
    private int[] items;

    public Iterator<Integer> iterator() {
        return new Iterator<>() {
            int index = 0;
            public boolean hasNext() { return index < items.length; }
            public Integer next()    { return items[index++]; }
        };
    }
}

// Usage - you don't know or care about the internal structure
for (int num : new NumberCollection()) {
    System.out.println(num);
}
```

## Related Topics
- [[visitor-pattern|Visitor Pattern]]
- [[iterator-pattern|IEnumerable]]
- [[iterator-pattern|Generators/Yield]]
- [[iterator-pattern|LINQ]]

## Cards

```anki
START
Basic
What is the Iterator pattern?
Back: Traverse a collection's elements sequentially without exposing how it's stored internally. Interface: hasNext() and next(). Enables for-each loops over any data structure. Multiple iterators can independently traverse the same collection simultaneously.
<!--ID: 1773439958629-->
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
