---
tags: [algorithms, template, leetcode, neetcode, index]
category: algorithms
related: [neetcode-patterns, dynamic-programming, hash-table]
---

## Description
Reusable **skeletons** for the NeetCode 150 - the shape of a solution, so that under pressure
the thinking budget goes to the problem's logistics instead of to re-deriving a BFS level loop.

**37 notes, 37 cards, ~16 lines of Java each.** These are guidelines, not worked solutions.
Each note holds exactly **one** skeleton with its divergence points marked `(1)`, `(2)`, and a
`## Variations` table that resolves those markers per problem family. Where two problems share
a shape and differ in one line, that line is a table row - not a second example.

Every note has the same five sections: `## Description` (the one decision the skeleton
encodes), `## Implementation`, `## Variations`, `## When to use (NeetCode 150)`, `## Pitfalls`.

### How this fits the other two decks

| Deck | Card asks | Answered | Where |
|---|---|---|---|
| `Neetcode 150::Patterns` | input shape + goal -> *which* pattern | verbally, ~60s | [[neetcode-patterns]] |
| `Neetcode 150::Templates` | pattern name -> *write the skeleton* | in an editor, ~2-3 min | this folder |
| `Neetcode 150::<topic>` | a specific problem | full solve | scraped problem cards |

Recognition, production, application. A template card is only useful once the matching pattern
card is solid - if you cannot name the pattern, writing its skeleton is theatre.

### Using the Templates deck
Each card fronts `Implement: <skeleton>`. Write it from memory, then check the
`## Implementation` section. **Grade on structure, not on syntax** - the abstract helper names
(`invalid()`, `combine()`, `measure()`) are placeholders on purpose. Getting `i` vs `i + 1`
wrong counts; forgetting an import does not.

## Contents
**Arrays, hashing, pointers**
- [[hash-map-counting|One-pass hash map]]
- [[prefix-sum|Prefix aggregates]]
- [[two-pointers-converging|Converging two pointers]]
- [[fast-slow-pointers|Fast and slow pointers]]
- [[sliding-window|Sliding window]]

**Stacks and search**
- [[monotonic-stack|Monotonic stack / deque]]
- [[stack-parsing|Stack for nesting and deferred evaluation]]
- [[binary-search|Binary search (first-true)]]

**Linked lists**
- [[linked-list-ops|Dummy head and three-pointer reverse]]
- [[lru-cache|LRU cache]]

**Trees**
- [[tree-traversal|Traversal orders and iterative in-order]]
- [[tree-dfs-aggregate|Tree DFS aggregate (return X, track Y)]]
- [[bst-impl|BST walk and interval validation]]
- [[tree-serialize|Flat token stream <-> tree]]
- [[trie|Trie character walk]]

**Heaps**
- [[heap-top-k|Bounded heap (top-k)]]
- [[quickselect|Quickselect]]
- [[two-heaps|Two heaps (streaming median)]]

**Recursion and search**
- [[backtracking|Backtracking (choose / recurse / un-choose)]]

**Graphs**
- [[dfs|DFS (adjacency, flood fill, colours)]]
- [[bfs|BFS (level loop, multi-source)]]
- [[union-find|Union-Find (DSU)]]
- [[topological-sort|Kahn's topological sort]]
- [[dijkstra|Dijkstra (and the combine step)]]
- [[bellman-ford|Bellman-Ford (and hop caps)]]
- [[minimum-spanning-tree|MST (Prim / Kruskal)]]
- [[eulerian-path|Hierholzer (every edge once)]]

**Dynamic programming**
- [[dp-1d-linear|1-D rolling variables]]
- [[dp-knapsack|Knapsack (and the loop-direction rule)]]
- [[dp-lis|Best-ending-at-i (LIS)]]
- [[dp-2d-grid|2-D grid / memoised DFS / interval]]
- [[dp-2d-sequences|Two-sequence table]]

**Greedy, intervals, math**
- [[greedy-scans|Greedy scans]]
- [[intervals|Interval sort and sweep]]
- [[matrix-manipulation|Four-boundary matrix walk]]
- [[math-tricks|Fast exponentiation and overflow discipline]]
- [[bit-manipulation|Bit vocabulary]]

## Coverage: all 150 problems
Every NeetCode 150 problem maps to at least one skeleton. A problem missing from this list
means the library has a gap.

**01 Arrays & Hashing** - Contains Duplicate, Valid Anagram, Two Sum, Group Anagrams, Top K
Frequent Elements, Encode and Decode Strings, Valid Sudoku, Longest Consecutive Sequence ->
[[hash-map-counting]] | Product of Array Except Self -> [[prefix-sum]]

**02 Two Pointers** - Valid Palindrome, Two Sum II, 3Sum, Container With Most Water,
Trapping Rain Water -> [[two-pointers-converging]]

**03 Sliding Window** - Best Time to Buy and Sell Stock, Longest Substring Without Repeating
Characters, Longest Repeating Character Replacement, Permutation in String, Minimum Window
Substring -> [[sliding-window]] | Sliding Window Maximum -> [[monotonic-stack]]

**04 Stack** - Valid Parentheses, Min Stack, Evaluate Reverse Polish Notation, Generate
Parentheses -> [[stack-parsing]] | Daily Temperatures, Car Fleet, Largest Rectangle in
Histogram -> [[monotonic-stack]]

**05 Binary Search** - Binary Search, Search a 2D Matrix, Koko Eating Bananas, Find Minimum in
Rotated Sorted Array, Search in Rotated Sorted Array, Time Based Key-Value Store, Median of
Two Sorted Arrays -> [[binary-search]]

**06 Linked List** - Reverse Linked List, Merge Two Sorted Lists, Reorder List, Add Two
Numbers, Reverse Nodes in k-Group, Copy List with Random Pointer -> [[linked-list-ops]] |
Remove Nth Node From End of List, Linked List Cycle, Find the Duplicate Number ->
[[fast-slow-pointers]] | LRU Cache -> [[lru-cache]] | Merge k Sorted Lists -> [[heap-top-k]]

**07 Trees** - Invert Binary Tree, Same Tree, Subtree of Another Tree -> [[tree-traversal]] |
Binary Tree Level Order Traversal, Binary Tree Right Side View -> [[bfs]] | Maximum Depth,
Balanced Binary Tree, Diameter of Binary Tree, Binary Tree Maximum Path Sum, Count Good Nodes
-> [[tree-dfs-aggregate]] | Validate Binary Search Tree, Kth Smallest Element in a BST, Lowest
Common Ancestor of a BST -> [[bst-impl]] | Serialize and Deserialize Binary Tree, Construct
Binary Tree from Preorder and Inorder Traversal -> [[tree-serialize]]

**08 Tries** - Implement Trie, Design Add and Search Words Data Structure, Word Search II ->
[[trie]]

**09 Heap / Priority Queue** - Kth Largest Element in a Stream, Last Stone Weight, K Closest
Points to Origin, Kth Largest Element in an Array (or [[quickselect]] for O(n) average), Task
Scheduler, Design Twitter -> [[heap-top-k]] | Find Median from Data Stream -> [[two-heaps]]

**10 Backtracking** - Subsets, Combination Sum, Combination Sum II, Permutations, Subsets II,
Word Search, Palindrome Partitioning, Letter Combinations of a Phone Number, N-Queens ->
[[backtracking]]

**11 Graphs** - Number of Islands, Max Area of Island, Clone Graph, Pacific Atlantic Water
Flow, Surrounded Regions -> [[dfs]] | Rotting Oranges, Walls and Gates, Word Ladder -> [[bfs]]
| Course Schedule, Course Schedule II -> [[topological-sort]] | Graph Valid Tree, Number of
Connected Components, Redundant Connection -> [[union-find]]

**12 Advanced Graphs** - Network Delay Time, Swim in Rising Water -> [[dijkstra]] |
Reconstruct Itinerary -> [[eulerian-path]] | Min Cost to Connect All Points ->
[[minimum-spanning-tree]] | Alien Dictionary -> [[topological-sort]] | Cheapest Flights Within
K Stops -> [[bellman-ford]]

**13 1-D Dynamic Programming** - Climbing Stairs, Min Cost Climbing Stairs, House Robber,
House Robber II, Decode Ways, Word Break, Maximum Product Subarray -> [[dp-1d-linear]] |
Longest Palindromic Substring, Palindromic Substrings -> [[two-pointers-converging]] | Coin
Change, Partition Equal Subset Sum -> [[dp-knapsack]] | Longest Increasing Subsequence ->
[[dp-lis]]

**14 2-D Dynamic Programming** - Unique Paths, Longest Increasing Path in a Matrix, Burst
Balloons -> [[dp-2d-grid]] | Longest Common Subsequence, Edit Distance, Distinct Subsequences,
Interleaving String, Regular Expression Matching -> [[dp-2d-sequences]] | Coin Change II,
Target Sum -> [[dp-knapsack]] | Best Time to Buy and Sell Stock with Cooldown ->
[[dp-1d-linear]]

**15 Greedy** - Jump Game, Jump Game II, Gas Station, Hand of Straights, Partition Labels,
Valid Parenthesis String, Merge Triplets to Form Target Triplet -> [[greedy-scans]] | Maximum
Subarray -> [[dp-1d-linear]]

**16 Intervals** - Insert Interval, Merge Intervals, Non-overlapping Intervals, Meeting Rooms,
Meeting Rooms II, Minimum Interval to Include Each Query -> [[intervals]]

**17 Math & Geometry** - Rotate Image, Spiral Matrix, Set Matrix Zeroes, Detect Squares ->
[[matrix-manipulation]] | Happy Number, Plus One, Multiply Strings, Pow(x, n) -> [[math-tricks]]

**18 Bit Manipulation** - Single Number, Number of 1 Bits, Counting Bits, Reverse Bits,
Missing Number, Sum of Two Integers -> [[bit-manipulation]] | Reverse Integer -> [[math-tricks]]

## Adding a template (update convention)
> Add a template note for **<name>** under `concepts/algorithms/templates/`. Match the existing
> notes exactly: frontmatter (`tags: [algorithms, template, leetcode, neetcode, <topic>]`,
> `category: algorithms`); a short `## Description` naming the ONE decision the skeleton
> encodes; a `## Implementation` with **a single** ~12-18 line Java skeleton, blank lines
> between stanzas, a comment on each load-bearing line, and divergence points marked `(1)`,
> `(2)`; a `## Variations` **table** resolving those markers per problem family - never a
> second full example; a `## When to use (NeetCode 150)` naming actual problems; a
> `## Pitfalls` of 3-4 bullets; and a `## Cards` section starting with the column-0 line
> `TARGET DECK: Neetcode 150::Templates` followed by **one** `Basic` card fronted
> `Implement: <skeleton>`, its back a compressed recipe ending "Full reference in the
> ## Implementation section of this note". Append the canonical `dataviewjs` block verbatim.
> No `<!--ID:-->` lines - the plugin assigns them. Then add the note to this README's Contents
> and Coverage lists.

Split a skeleton into its own note only when it **shares no control-flow shape** with its host
- that is why [[lru-cache]], [[quickselect]] and [[eulerian-path]] are separate, and why
merging vs. counting intervals are not.

The one deliberate exception to the size rule is [[lru-cache]], at ~40 lines: it is a design
problem where the class structure *is* the answer, so there is nothing to abstract away.

## Related Topics
- [[neetcode-patterns|Pattern recognition cards + invariants]] - the deck that comes first
- [[dynamic-programming]], [[two-pointers]], [[binary-search]], [[backtracking]] - concept notes
