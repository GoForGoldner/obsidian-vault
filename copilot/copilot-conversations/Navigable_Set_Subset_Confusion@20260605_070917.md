---
epoch: 1780657757758
modelKey: "deepseek-v4-flash|deepseek"
topic: "Navigable Set Subset Confusion"



tags:
  - copilot-conversation
---

**user**: I think I understand the subset method for Sorted Set but I dont understand the Navigable set one.
[Timestamp: 2026/06/05 07:09:17]

**ai**: Great question. The key difference is that `SortedSet.subSet(from, to)` always interprets the lower bound as **inclusive** and the upper bound as **exclusive** (i.e., `[from, to)`). `NavigableSet` gives you explicit control over both endpoints.

## `NavigableSet.subSet(fromElement, fromInclusive, toElement, toInclusive)`

- You pass two extra booleans to decide whether each endpoint is included.
- `true` means the element itself is included, `false` means excluded.
- Example:
  ```java
  NavigableSet<Integer> ns = new TreeSet<>(Set.of(1,2,3,4,5));
  ns.subSet(2, true, 4, true);   // [2,3,4]   both inclusive
  ns.subSet(2, false, 4, false); // (2,4)      only 3
  ns.subSet(2, false, 4, true);  // (2,4]     3,4
  ```
- The older `SortedSet.subSet(from, to)` is equivalent to `subSet(from, true, to, false)`.

## Other useful `NavigableSet` methods

- `headSet(toElement, inclusive)` – everything before `toElement`, with optional inclusion.
- `tailSet(fromElement, inclusive)` – everything after `fromElement`, with optional inclusion.
- `descendingSet()` – reverse order view.
- `pollFirst() / pollLast()` – remove and return the first/last element (atomic).
- `lower(e) / floor(e) / ceiling(e) / higher(e)` – precise navigation.

These methods make `NavigableSet` much more flexible for range queries and bidirectional traversal.

---

Added [[navigable-set]].
Created 3 cards (boundary control, equivalent overload, practical usage). Let me know if you want me to tweak anything.
[Timestamp: 2026/06/05 07:09:28]