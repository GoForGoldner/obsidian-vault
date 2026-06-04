---
tags: [java, data-structures, iterators]
category: java
related: [collections-framework, java-list, java-set-and-map]
---

## Description
`Iterator` is Java's low-level traversal cursor: it walks forward through a collection one element at a time and can safely remove the element most recently returned by `next()`. `ListIterator` extends that model specifically for lists by adding backward traversal, insertion at the cursor, in-place replacement, and index awareness. Modern Java often prefers `forEach`, `stream`, and `removeIf` for common traversal patterns, but explicit iterators still matter whenever the loop itself controls mutation or cursor position. `Spliterator` sits one level lower as the traversal primitive used by the Stream API, especially for splitting work in parallel pipelines.

## Examples
### `Iterator` vs `ListIterator`
| Capability | `Iterator<E>` | `ListIterator<E>` |
| --- | --- | --- |
| Forward traversal | `hasNext()`, `next()` | Yes |
| Backward traversal | No | `hasPrevious()`, `previous()` |
| Safe removal | `remove()` | Yes |
| Insert during traversal | No | `add(E e)` |
| Replace last returned element | No | `set(E e)` |
| Index insight | No | `nextIndex()`, `previousIndex()` |

### Safe removal with a plain `Iterator`
```java
List<String> items = new ArrayList<>(List.of("A", "", "B", ""));
Iterator<String> it = items.iterator();
while (it.hasNext()) {
    String value = it.next();
    if (value.isEmpty()) {
        it.remove();
    }
}
// items is now [A, B]
```

### `ListIterator` bidirectional traversal with `add` and `set`
```java
List<String> letters = new ArrayList<>(List.of("A", "C"));
ListIterator<String> li = letters.listIterator();
li.next();              // "A"
li.add("B");          // inserts between A and C
li.next();              // "C"
li.set("D");          // replace C with D
String prev = li.previous(); // "D"
// letters is now [A, B, D]
```

### Modern alternatives: `forEach`, `stream`, and `removeIf`
```java
List<String> names = new ArrayList<>(List.of("ada", "", "grace"));
names.forEach(System.out::println);
List<String> upper = names.stream().filter(s -> !s.isBlank()).map(String::toUpperCase).toList();
names.removeIf(String::isBlank);
```

### Brief `Spliterator` example
```java
List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);
Spliterator<Integer> left = nums.spliterator();
Spliterator<Integer> right = left.trySplit();
left.forEachRemaining(System.out::println);
if (right != null) {
    right.forEachRemaining(System.out::println);
}
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
Back: `ListIterator` can move backward with `hasPrevious()` and `previous()`, insert with `add(e)`, replace with `set(e)`, and report positions with `nextIndex()` and `previousIndex()`.<br>It is only available for `List`, not for `Set` or `Queue`.
END

START
Basic
What are the 3 key Java 8 default methods added to `Collection` and `Iterable`?
Back: `Iterable.forEach(Consumer)` added lambda-friendly traversal, `Collection.stream()` added Stream pipelines, and `Collection.removeIf(Predicate)` added conditional bulk removal.<br>These cover many loops that older Java code wrote manually.
END

START
Basic
When should you still use an explicit `Iterator` instead of `forEach` or streams?
Back: Use an explicit iterator when the loop needs fine-grained control or safe mutation via `iterator.remove()`.<br>`forEach` is simpler for visiting, and streams are better for transformation pipelines, but they are less direct for cursor-driven mutation.
END

START
Basic
What is `Spliterator` for at a concept level?
Back: `Spliterator` is a traversal primitive that can both advance through elements and split them into chunks.<br>The Stream API uses it under the hood for bulk traversal and parallel stream execution.
END

START
Basic
How do you safely remove elements during iteration?
Back: Use `Iterator.remove()` after `next()` has returned the element you want to delete: `Iterator<String> it = list.iterator(); while (it.hasNext()) { if (it.next().isEmpty()) it.remove(); }`.<br>In Java 8+, `list.removeIf(String::isEmpty)` is often even cleaner.
END

START
Basic
What does `ListIterator.add(e)` do exactly?
Back: It inserts the element immediately before the element that would be returned by `next()` and immediately after the element that would be returned by `previous()`.<br>After insertion, the cursor sits after the new element, so `previous()` returns it and `next()` continues with the old next element.
END

START
Basic
What does `ListIterator.set(e)` do?
Back: It replaces the last element returned by `next()` or `previous()`.<br>You cannot call it immediately after `add()` or `remove()`; if no traversal step has established a last-returned element, Java throws `IllegalStateException`.
END

START
Basic
What does `Iterator.forEachRemaining(Consumer)` do?
Back: It consumes every remaining element from the iterator without a manual `while (hasNext())` loop.<br>Example: `iterator.forEachRemaining(System.out::println);`.<br>It was added as a default method in Java 8.
END

START
Basic
What's the difference between `Iterable.forEach(Consumer)` and `Collection.stream().forEach(Consumer)`?
Back: `Iterable.forEach()` is just a direct internal loop over the elements.<br>`stream().forEach()` first creates a Stream pipeline, which supports intermediate operations and parallel execution.<br>For simple visitation, `forEach()` is cleaner; for filtering/mapping/reducing, use streams.
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
