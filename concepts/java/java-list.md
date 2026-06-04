---
tags: [java, data-structures, list]
category: java
related: [collections-framework, java-iterators, java-queue-deque]
---

## Description
A `List` is the Java collections type you choose when order and position matter. It preserves encounter order, allows duplicates, and supports indexed read/write operations such as `get(i)`, `set(i, e)`, `add(i, e)`, and `remove(i)`. In real programs, `ArrayList` is the default because it gives O(1) positional reads and excellent cache locality. `LinkedList` only becomes interesting when you truly need deque-style operations at the ends, and even then `ArrayDeque` is usually the better non-list choice. The biggest practical list mistakes are confusing `remove(index)` with `remove(object)`, forgetting that `subList()` is a live view, and mutating the list unsafely during iteration.

## Examples
### Core `List` method reference
| Signature | Returns | What it does | Common note |
| --- | --- | --- | --- |
| `E get(int index)` | `E` | Reads element at `index` | O(1) on `ArrayList`, O(n) on `LinkedList` |
| `E set(int index, E element)` | `E` | Replaces existing element | Returns old value |
| `void add(int index, E element)` | `void` | Inserts before `index` | Shifts later elements right |
| `boolean add(E element)` | `boolean` | Appends to end | Usually amortized O(1) on `ArrayList` |
| `E remove(int index)` | `E` | Removes by position | Returns removed element |
| `boolean remove(Object o)` | `boolean` | Removes first equal element | Overload trap with `List<Integer>` |
| `int indexOf(Object o)` | `int` | Finds first matching element | Returns `-1` if absent |
| `int lastIndexOf(Object o)` | `int` | Finds last matching element | Also uses `equals()` |
| `List<E> subList(int fromIndex, int toIndex)` | `List<E>` | Returns range view `[from, to)` | Backed by original list |
| `void sort(Comparator<? super E> c)` | `void` | Sorts in place | Mutates original list |
| `void replaceAll(UnaryOperator<E> op)` | `void` | Replaces each element in place | Mutates original list |
| `ListIterator<E> listIterator()` | `ListIterator<E>` | Bidirectional iterator | Supports `add`, `set`, `previous` |

### `ArrayList` vs `LinkedList`
```java
List<String> array = new ArrayList<>();
array.add("A");
array.add("B");
String first = array.get(0);        // fast indexed access
array.add(1, "X");                 // shifts later elements

List<String> linked = new LinkedList<>();
linked.add("A");
linked.add("B");
linked.add(0, "X");                // legal, but indexed traversal is still O(n)
String head = linked.get(0);         // works, but slower in general than ArrayList
```

### `subList`, `sort`, and `replaceAll`
```java
List<String> names = new ArrayList<>(List.of("grace", "ada", "linus", "ken"));
List<String> middle = names.subList(1, 3);   // [ada, linus], live view
middle.clear();                              // names is now [grace, ken]

names.addAll(List.of("barbara", "alan"));
names.sort(Comparator.naturalOrder());
names.replaceAll(String::toUpperCase);
// names is now [ALAN, BARBARA, GRACE, KEN]
```

### `remove(int)` vs `remove(Object)` on `List<Integer>`
```java
List<Integer> nums = new ArrayList<>(List.of(10, 20, 30, 20));
Integer removedByIndex = nums.remove(1);           // removes element at index 1 => 20
boolean removedByValue = nums.remove(Integer.valueOf(20));
// removes the first Integer equal to 20
```

### `ListIterator` bidirectional editing
```java
List<String> letters = new ArrayList<>(List.of("A", "C"));
ListIterator<String> it = letters.listIterator();

it.next();                 // returns "A"
it.add("B");             // inserts before element that next() would now return
it.next();                 // returns "C"
it.set("D");             // replaces last returned element
String previous = it.previous(); // returns "D"
// letters is now [A, B, D]
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
Back: Almost never.<br>`ArrayList` gives O(1) random access and far better cache locality.<br>`LinkedList` mainly helps when you truly need frequent insertion/removal at both ends and want a `Deque`, but even then `ArrayDeque` is usually better.
<!--ID: 1780580933015-->
END

START
Basic
What's the gotcha with `remove()` on a `List<Integer>`?
Back: `remove(2)` calls `remove(int index)`, not `remove(Object)`.<br>To remove the Integer value `2`, call `remove(Integer.valueOf(2))`.<br>The overloads even return different types: `E` for index removal and `boolean` for object removal.
<!--ID: 1780580933017-->
END

START
Basic
Why is `Iterator.remove()` safe during iteration but `Collection.remove()` is not?
Back: A for-each loop uses an iterator internally, so calling `list.remove(...)` directly causes a structural modification the iterator did not expect and can throw `ConcurrentModificationException`.<br>`Iterator.remove()` is safe because it removes through the iterator's own state.
<!--ID: 1780580933019-->
END

START
Basic
What's the `subList()` trap?
Back: `subList(from, to)` returns a live view backed by the original list, not a copy.<br>Mutating the sublist changes the original list, and structural changes to the original list can invalidate the view.<br>Use `new ArrayList<>(list.subList(...))` when you need an independent slice.
<!--ID: 1780580933020-->
END

START
Basic
What does `List.sort(Comparator)` do and how do you use it?
Back: It sorts the list in place and returns `void`.<br>Examples: `list.sort(Comparator.naturalOrder())` and `list.sort(Comparator.comparing(Person::getAge))`.<br>Because it mutates, make a copy first if you need to preserve the old order.
<!--ID: 1780580933022-->
END

START
Basic
What does `List.replaceAll(UnaryOperator)` do?
Back: It replaces every element in the list in place by applying the operator to each element.<br>Example: `names.replaceAll(String::toUpperCase);`.<br>Unlike `stream().map(...)`, it mutates the original list instead of producing a new result list.
<!--ID: 1780580933023-->
END

START
Basic
What does `List.of()` vs `new ArrayList<>(List.of())` give you?
Back: `List.of(...)` creates an immutable list, so `add`, `remove`, and `set` throw `UnsupportedOperationException`.<br>`new ArrayList<>(List.of(...))` creates a mutable copy you can edit normally.
<!--ID: 1780580933025-->
END

START
Basic
What is the complexity of `get(index)` in `ArrayList` vs `LinkedList`?
Back: `ArrayList.get(index)` is O(1) because it uses array indexing.<br>`LinkedList.get(index)` is O(n) because it must walk node-by-node from one end.<br>This is a major reason `ArrayList` is the default list choice.
<!--ID: 1780580933026-->
END

START
Basic
What is the complexity of `add/remove` at the HEAD in `ArrayList` vs `LinkedList`?
Back: At index 0, `ArrayList` is O(n) because elements must shift, while `LinkedList` is O(1) for pointer updates.<br>But `LinkedList` still often loses in practice because of object overhead and poor cache locality.
<!--ID: 1780580933028-->
END

START
Basic
What does `List.indexOf(Object)` return if the element isn't found?
Back: It returns `-1`.<br>The comparison uses `equals()`.<br>`lastIndexOf(Object)` works the same way but searches for the last matching occurrence.
<!--ID: 1780580933030-->
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
