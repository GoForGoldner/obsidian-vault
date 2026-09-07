---
tags: [algorithms, template, leetcode, neetcode, design, linked-list, hashing]
category: algorithms
related: [linked-list-ops, hash-table]
---

## Description
The canonical "two structures, one invariant" design answer: a **hash map for O(1) lookup**
plus a **doubly linked list for O(1) reordering**. Neither can do both alone - the map has no
order, the list has no random access.

The trick that makes the code short is **sentinel head and tail nodes**: with both present, no
insert or unlink ever needs a null check.

## Implementation
```java
class LRUCache {
    private static class Node { int k, v; Node prev, next; }

    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(), tail = new Node();   // sentinels, never removed
    private final int cap;

    LRUCache(int capacity) {
        cap = capacity;
        head.next = tail;                  // empty list: the two sentinels point at each other
        tail.prev = head;
    }

    private void unlink(Node n) {          // no null checks - sentinels guarantee neighbours
        n.prev.next = n.next;
        n.next.prev = n.prev;
    }

    private void appendTail(Node n) {      // tail side == most recently used
        n.prev = tail.prev;  n.next = tail;
        tail.prev.next = n;  tail.prev = n;
    }

    int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;

        unlink(n);  appendTail(n);         // a touch means "most recent"
        return n.v;
    }

    void put(int key, int value) {
        Node n = map.get(key);

        if (n != null) {                   // update in place, then re-touch
            n.v = value;
            unlink(n);  appendTail(n);
            return;
        }

        if (map.size() == cap) {
            Node lru = head.next;          // head side == least recently used
            unlink(lru);
            map.remove(lru.k);             // evict from BOTH structures
        }

        Node fresh = new Node();
        fresh.k = key;  fresh.v = value;
        map.put(key, fresh);
        appendTail(fresh);
    }
}
```

## Variations
| Need | Change |
|---|---|
| LFU | keep one list per frequency plus a `minFreq` int; on a touch, move the node to the `freq + 1` list |
| fixed-window "last k" | same structure, evict on size rather than on a capacity field |
| Java shortcut | `LinkedHashMap` with `accessOrder = true` and an overridden `removeEldestEntry`. Know the hand-rolled version first - the shortcut is usually disallowed |

## When to use (NeetCode 150)
- **LRU Cache**.
- The general cue: "design a structure with O(1) `get` **and** O(1) ordered eviction".

## Pitfalls
- Eviction must remove the key from the **map** too, not just unlink the node.
- Use *both* sentinels. One alone still leaves a null case at the other end.
- `get` on a hit must re-touch. Returning the value without reordering silently breaks the
  eviction policy while every small test still passes.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: LRU Cache (O(1) get and put)
Back: `HashMap<key, Node>` for lookup + a DOUBLY linked list for recency, with SENTINEL head and tail so no insert or unlink ever needs a null check. Head side = least recent, tail side = most recent.<br>Helpers: `unlink(n)` rewires both neighbours; `appendTail(n)` splices before the tail sentinel.<br>get: miss -> -1; hit -> unlink, appendTail, return value (re-touching is mandatory).<br>put: existing -> update + re-touch. New at capacity -> unlink `head.next` AND `map.remove(lru.k)`, then append the new node.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040510-->
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
