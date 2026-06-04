---
tags: [java, data-structures, list]
category: java
related: [collections-framework, java-iterators, java-queue-deque]
---

## Description
A `List` is an ordered collection with stable positional access, so it is the right abstraction when index matters as much as membership. `ArrayList` stores elements in a resizable array, which makes reads fast and cache-friendly; `LinkedList` stores nodes, which only helps when you truly spend most of your time inserting or removing at the ends. In practice, `ArrayList` is the default choice and `LinkedList` is a niche deque-shaped tool rather than a general-purpose list.

## Examples
| Method | Why you use it | Main gotcha |
| --- | --- | --- |
| `get(index)` | Read by position | Fast on `ArrayList`, linear on `LinkedList` |
| `set(index, e)` | Replace existing element | Does not change size |
| `add(index, e)` | Insert at a position | Shifts later elements |
| `remove(index)` | Remove by position | On `List<Integer>`, can be confused with `remove(Object)` |
| `subList(from, to)` | Work on a window of the list | Returns a live view, not a copy |
| `indexOf(o)` | Find first matching element | Uses `equals`, returns `-1` if missing |
| `sort(cmp)` | Reorder in place | Mutates the list |
| `replaceAll(op)` | Bulk transform elements | Mutates each element positionally |

```java
List<String> names = new ArrayList<>(List.of("Ada", "Linus", "Grace"));
names.add(1, "Ken");          // [Ada, Ken, Linus, Grace]
names.subList(1, 3).clear();   // [Ada, Grace] because subList is a live view
```

## Related Topics
- [[collections-framework]]
- [[java-iterators]]
- [[java-queue-deque]]

## Cards

```anki
START
Basic
When should you use `LinkedList` over `ArrayList`?
Back: Almost never. `ArrayList` gives O(1) random access and much better cache locality. `LinkedList` mainly helps when you frequently insert or remove at BOTH ends because it also implements `Deque`. For stack or queue usage, prefer `ArrayDeque` over `LinkedList` anyway.
END

START
Basic
What's the gotcha with `remove()` on a `List<Integer>`?
Back: `remove(2)` calls `remove(int index)`, not `remove(Object)`. To remove the Integer value `2`, call `remove(Integer.valueOf(2))`. The overload ambiguity comes from autoboxing, and the two overloads even return different types: removed element vs `boolean`.
END

START
Basic
Why is `Iterator.remove()` safe during iteration but `Collection.remove()` is not?
Back: Calling `Collection.remove()` inside a for-each loop causes `ConcurrentModificationException` because the iterator sees an unexpected structural change. `Iterator.remove()` is safe because it updates the collection through the iterator's own state, removing the last element returned by `next()`.
END

START
Basic
What's the `subList()` trap on a `List`?
Back: `subList()` returns a live view backed by the original list, not an independent copy. Changes to the sublist affect the original list and vice versa. Use `new ArrayList<>(list.subList(...))` when you need an isolated slice.
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
