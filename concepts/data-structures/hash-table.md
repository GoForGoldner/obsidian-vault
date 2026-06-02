---
tags: [data-structures]
category: data-structures
related: [bst(binary-search-tree)]
---

## Description
A data structure that maps keys to values using a hash function. The hash function converts the key into an array index where the value is stored. Average case O(1) for insert, lookup, update, and delete. Worst case O(n) when many keys hash to the same index (collisions).
## Examples
```java
Map<String, Integer> map = new HashMap<>();
map.put("alice", 90);    // O(1) insert
map.put("bob", 85);
map.get("alice");         // O(1) lookup -> 90
map.containsKey("bob");   // O(1) -> true
map.remove("bob");        // O(1) delete
```

## Related Topics
- [[bst(binary-search-tree)|BST]]
- [[hash-table|Hash Function]]
- [[hash-table|Collision Resolution]]
- [[hash-table|Hash Set]]

## Cards

```anki
START
Basic
What is a hash table and when do you use it over a BST?
Back: Maps keys to values via a hash function. O(1) average lookup. Use over BST when you need fast access and don't care about ordering. BST when you need sorted data.
<!--ID: 1773439958463-->
END

START
Basic
What is a hash collision and how is it resolved?
Back: Two keys hash to the same index. Chaining (linked list at each bucket) or Open Addressing (probe to next empty slot).
<!--ID: 1773439958471-->
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
