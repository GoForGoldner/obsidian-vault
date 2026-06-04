---
tags: [java, data-structures, iterators]
category: java
related: [collections-framework, java-list, java-set-and-map]
---

## Description
`Iterator` is the low-level traversal contract for stepping through a collection one element at a time, with optional safe removal of the current element. `ListIterator` extends that model for lists by adding backward traversal, in-place replacement, and insertion at the cursor. Modern Java often replaces explicit loops with `forEach`, `stream`, and `removeIf`, while `Spliterator` exists to support bulk traversal and parallel stream splitting.

## Examples
| Capability | `Iterator` | `ListIterator` |
| --- | --- | --- |
| Forward traversal | `hasNext()`, `next()` | Yes |
| Backward traversal | No | `hasPrevious()`, `previous()` |
| Remove current element | `remove()` | Yes |
| Insert during traversal | No | `add(e)` |
| Replace last returned element | No | `set(e)` |
| Positional insight | No | `nextIndex()`, `previousIndex()` |

```java
List<String> items = new ArrayList<>(List.of("A", "C"));
ListIterator<String> it = items.listIterator();
it.next();
it.add("B");      // inserts at cursor position
// list is now [A, B, C]
```

## Related Topics
- [[collections-framework]]
- [[java-list]]
- [[java-set-and-map]]

## Cards

```anki
START
Basic
What can `ListIterator` do that `Iterator` cannot?
Back: `ListIterator` can traverse backward (`hasPrevious`/`previous`), insert at the cursor (`add(e)`), replace the last returned element (`set(e)`), and report position (`nextIndex`/`previousIndex`). You get it from `List.listIterator()`, so these features do not apply to `Set` or `Queue`.
END

START
Basic
What are the 3 key Java 8 default methods added to `Collection` and `Iterable`?
Back: `Iterable.forEach(Consumer)` enables lambda-based traversal, while `Collection.stream()` enables Stream pipelines and `Collection.removeIf(Predicate)` enables conditional bulk removal. These cover many cases where older Java code would have used an explicit iterator loop.
END

START
Basic
When should you still use an explicit `Iterator` instead of `forEach` or streams?
Back: Use an explicit `Iterator` when you need stateful step-by-step traversal or safe in-loop removal with `iterator.remove()`. `forEach` is great for side-effect-free visitation, and streams are great for transformations, but neither is as direct when the traversal itself controls mutation.
END

START
Basic
What is `Spliterator` for at a concept level?
Back: `Spliterator` is designed for partitionable traversal: it can advance through elements like an iterator, but it can also split work into chunks so the Stream API can process collections in parallel. Think of it as the traversal primitive behind parallel streams, not the tool you usually reach for first in everyday code.
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
