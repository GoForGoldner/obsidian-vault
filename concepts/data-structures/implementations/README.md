---
tags: [data-structures, implementation, leetcode, index]
category: data-structures
related: [bst(binary-search-tree), hash-table]
---

## Description
Reference implementations of the more involved data structures and reusable
algorithm templates used for LeetCode. Each note holds a complete, correct Java
implementation you can study, plus **one** flashcard whose front is just the
structure's name — you implement it from memory, then check the `## Implementation`
section of the same note to verify.

These "implement it" cards are kept **separate from the normal study deck**. Every
note here carries a `TARGET DECK: Implement Data Structures` line, so on your next
Obsidian-to-Anki sync the cards land in their own deck named
**`Implement Data Structures`** (rename by editing that line — it lives right under
each note's `## Cards` heading). Nothing outside the vault is needed; this all syncs
through the same Obsidian-to-Anki plugin as the rest of your cards.

Trivial structures (e.g. `HashMap` — just iterate) are intentionally excluded; see
`concepts/data-structures/hash-table.md` for those.

## Contents
Data structures:
- [[union-find|Union-Find (DSU)]]
- [[trie|Trie]]
- [[bst-impl|Binary Search Tree]]
- [[binary-heap|Binary Heap]]
- [[monotonic-stack|Monotonic Stack]]

Reusable algorithm templates:
- [[binary-search|Binary Search (lower/upper bound)]]
- [[bfs|BFS (grid + graph, multi-source)]]
- [[dfs|DFS (grid + graph)]]
- [[topological-sort|Topological Sort (Kahn + DFS)]]
- [[dijkstra|Dijkstra]]
- [[two-heaps|Two Heaps (streaming median)]]
- [[backtracking|Backtracking template]]
- [[sliding-window|Sliding Window / Two Pointers]]
- [[prefix-sum|Prefix Sum (1D + 2D)]]

## Adding a new structure (update convention)
When you add a new data structure to the vault and want it in this library, ask
Claude (or follow the pattern by hand):

> Add a reference implementation note for **<name>** under
> `concepts/data-structures/implementations/`. Match the existing notes exactly:
> frontmatter, a `## Implementation` section with clean idiomatic Java, a short
> `## When to use (LeetCode)` section, and a `## Cards` section beginning with the
> line `TARGET DECK: Implement Data Structures` followed by a single `Basic` anki
> card whose front is `Implement: <name>` and whose back is a 2–3 line key-idea
> hint pointing back to the `## Implementation` section. Append the canonical
> `dataviewjs` render block verbatim. Do NOT add `<!--ID:-->` lines (the plugin
> assigns them on first sync). Then add the new note to this README's Contents list.

## Related Topics
- [[bst(binary-search-tree)|BST concept note]]
- [[hash-table|Hash Table]]
