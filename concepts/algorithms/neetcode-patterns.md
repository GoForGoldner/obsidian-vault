---
tags: [algorithms, patterns, leetcode, neetcode]
category: algorithms
related: [two-pointers, sliding-window, binary-search, backtracking, dynamic-programming]
---
TARGET DECK: Neetcode 150::Patterns

## Description
Two kinds of card, one deck, no upkeep beyond adding a card when I earn one.

**Pattern cards** - front is the shape of an input plus a goal, back is the pattern that
shape implies. No problem name appears anywhere, because in an interview I never get one.
Verbal review, ~60 seconds, never open an editor.

**Invariant cards** - front asks why a pattern cannot miss a valid answer, back is my own
one-sentence argument. These are the ones that make variants easy: a memorised template
breaks when a constraint moves, an invariant just gets re-derived.

I only write an invariant card **after** solving something real with that pattern, in my
own words. An absent invariant card is the to-do - there is nothing else to track. Solved
/ unsolved lives on neetcode.io, which already does it automatically.

To add one, append to the `anki` block below:

    START
    Basic
    Why can't <pattern> miss a valid answer?
    Back: <one sentence, in my own words>
    END

**Insight cards** - after solving a problem that had a non-obvious trick, add one. This is
the memory retainer: if I blank on the insight card, *that* is the signal to go re-solve the
problem. If I answer it instantly, the re-solve was not needed. Anki does the spacing; the card
decides whether the expensive review is worth it.

    START
    Basic
    <Problem name> - key insight?
    Back: <the one non-obvious idea, one sentence>
    END

Only for problems where something was genuinely non-obvious. A problem that was a
straight application of its pattern needs no card - the pattern card already covers it.

**Where the code lives.** These cards are recognition only - naming the pattern, never
writing it. The matching code skeletons are a separate deck, `Neetcode 150::Templates`, in
`concepts/algorithms/templates/` (see its [[README]]). Do a template card only once its
pattern card is solid; writing a skeleton you cannot yet select is theatre.

An invariant says why the approach **cannot skip a valid answer**, not what it does.
"Sort then scan" is a description. "After sorting, any valid pair must be adjacent in scan
order, so the scan cannot skip one" is an invariant.

## Related Topics
- [[two-pointers]], [[sliding-window]], [[binary-search]], [[backtracking]], [[dynamic-programming]]
- [[README|Code templates for all 150 problems]] under `concepts/algorithms/templates/` -
  the production half of this deck (`Neetcode 150::Templates`)

## Cards
```anki
START
Basic
Unsorted collection. I need to know whether some already-seen element pairs with the current one to satisfy a target relation, in a single pass.
Back: **Hash map for complement lookup**
<!--ID: 1788289116831-->
END

START
Basic
I need to decide whether two sequences are equivalent under reordering, or to bucket a collection into classes of such equivalents.
Back: **Frequency signature grouping**
<!--ID: 1788289116837-->
END

START
Basic
For every index I need an aggregate over everything to its left and everything to its right, without re-scanning the whole sequence per index.
Back: **Prefix and suffix accumulation**
<!--ID: 1788289116843-->
END

START
Basic
Sorted sequence. I need a pair, or a bounded region, satisfying a monotone condition on its two ends.
Back: **Converging two pointers**
<!--ID: 1788289116849-->
END

START
Basic
A sequence with implicit successor links and no length known up front. I need to detect repetition, or land on a position defined relative to the end.
Back: **Fast and slow pointers**
<!--ID: 1788289116855-->
END

START
Basic
Contiguous run over a sequence. I need the longest or shortest run satisfying a constraint that only gets harder to satisfy as the run grows.
Back: **Variable-size sliding window**
<!--ID: 1788289116861-->
END

START
Basic
For each position I need the nearest position on one side whose value beats it under a strict comparison.
Back: **Monotonic stack or deque**
<!--ID: 1788289116867-->
END

START
Basic
The input has nested or deferred structure that has to be resolved innermost-first.
Back: **Stack for nesting and deferred evaluation**
<!--ID: 1788289116873-->
END

START
Basic
Sorted, or piecewise-sorted, indexed collection. I need a specific element or a boundary position in sublinear time.
Back: **Binary search over a sorted collection**
<!--ID: 1788289116879-->
END

START
Basic
The answer is a number in a known range. Testing whether a given candidate works is easy, and if a candidate works then every larger one does too (or every smaller one).
Back: **Binary search on the answer**
<!--ID: 1788289116885-->
END

START
Basic
Node-linked sequence. I need to restructure the links themselves in constant extra space.
Back: **In-place linked list relinking**
<!--ID: 1788289116890-->
END

START
Basic
Rooted hierarchy. The answer at a node is a function of the answers already computed for its children.
Back: **Tree DFS returning values upward**
<!--ID: 1788289116894-->
END

START
Basic
I need the fewest steps to reach a target, or I need to process a structure one distance-ring at a time, and every step costs the same.
Back: **BFS by level**
<!--ID: 1788289116899-->
END

START
Basic
Ordered hierarchy where every left descendant is smaller and every right descendant is larger. I need to locate, validate, or enumerate in sorted order.
Back: **BST ordering invariant**
<!--ID: 1788289116904-->
END

START
Basic
Large set of strings. Queries are repeated and keyed on shared prefixes rather than whole-string equality.
Back: **Trie over shared prefixes**
<!--ID: 1788289116909-->
END

START
Basic
I need the k best of n, or I need to repeatedly pull the current extreme from a collection that keeps changing.
Back: **Heap for top-k and streaming order**
<!--ID: 1788289116914-->
END

START
Basic
I need to enumerate every arrangement or selection satisfying a constraint, where a partial candidate is extended one choice at a time and can be abandoned early.
Back: **Backtracking over a choice tree**
<!--ID: 1788289116919-->
END

START
Basic
An implicit graph given as a grid or adjacency list. I need to identify, measure, or transform maximal connected regions.
Back: **Flood fill over a connected region**
<!--ID: 1788289116923-->
END

START
Basic
A set of items with 'must come before' constraints. I need a consistent ordering, or I need to detect that none exists.
Back: **Topological sort**
<!--ID: 1788289116928-->
END

START
Basic
A stream of 'these two are now connected' facts. I need to answer 'are these two connected' as the facts arrive.
Back: **Union-Find**
<!--ID: 1788289116933-->
END

START
Basic
Weighted graph with non-negative edge costs. I need the cheapest total cost from a single source.
Back: **Dijkstra for weighted shortest path**
<!--ID: 1788289116938-->
END

START
Basic
The answer for a size-n input decomposes into answers for a constant number of smaller prefixes of the same problem.
Back: **Linear DP over one dimension**
<!--ID: 1788289116943-->
END

START
Basic
Two sequences, or a sequence plus a budget. The answer depends on a position in each, and every step advances one or both.
Back: **Two-dimensional DP over two sequences**
<!--ID: 1788289116947-->
END

START
Basic
A collection of [start, end] ranges. I need to merge them, count how many overlap, or select a largest non-conflicting subset.
Back: **Interval sort and sweep**
<!--ID: 1788289116952-->
END

START
Basic
I need an optimum, and there is a locally best choice that can be shown never to make the final result worse.
Back: **Greedy with an exchange argument**
<!--ID: 1788289116956-->
END

START
Basic
Values behave as fixed-width bit patterns. I need pairing and cancellation, subset enumeration, or arithmetic without arithmetic operators.
Back: **Bit manipulation with XOR and masks**
<!--ID: 1788289116960-->
END

START
Basic
No cleverness available - the task is to transform a matrix or digit sequence exactly as specified, in place or with tight space, and the whole difficulty is bookkeeping.
Back: **Simulation with deliberate index arithmetic**
<!--ID: 1788289116965-->
END

START
Basic
Variable-size sliding window
Back: Trigger: a contiguous run, with a constraint that is monotone in run length. Prefer over converging two pointers when the sequence is unsorted and the answer is a run rather than a pair - converging pointers need sorted order and return two endpoints, not a span.
<!--ID: 1788289116969-->
END

START
Basic
Monotonic stack or deque
Back: Trigger: nearest-greater or nearest-smaller for every position. Prefer over a plain stack when the comparison relation itself must be maintained; use a deque instead of a stack only when I also need to evict from the front by window position.
<!--ID: 1788289116974-->
END

START
Basic
Binary search on the answer
Back: Trigger: monotone feasibility over a numeric range - if x works, everything past x works. Prefer over searching an array when the thing being searched is not stored anywhere: I am searching a value space and running a feasibility test, not scanning data.
<!--ID: 1788289116982-->
END

START
Basic
Backtracking over a choice tree
Back: Trigger: enumerate all valid configurations, choices made one at a time and revocable. Prefer over DP when I need the configurations themselves rather than a count or an optimum - DP collapses distinct paths into a single number, which destroys the enumeration.
<!--ID: 1788289116989-->
END

START
Basic
Union-Find
Back: Trigger: connectivity queries interleaved with merge operations. Prefer over DFS when edges arrive incrementally and I must answer between arrivals - DFS would re-traverse the graph per query. Prefer DFS when the graph is fixed up front and one pass answers everything.
<!--ID: 1788289116993-->
END

START
Basic
Dijkstra for weighted shortest path
Back: Trigger: non-negative weighted edges, cheapest cost from a source. Prefer over BFS only when edge weights actually differ - with uniform weights BFS is correct and cheaper. Never use it when any edge is negative.
<!--ID: 1788289116998-->
END

START
Basic
Why can't hash map for complement lookup miss a valid answer?
Back: By the time I reach element i, every earlier element is already in the map, so a valid partner is either behind me (found now) or ahead of me (found when that one is current) - it cannot be missed in either direction.
<!--ID: 1788289117003-->
END

START
Basic
Why can't frequency signature grouping miss a valid answer?
Back: A count vector is identical for two items exactly when one is a reordering of the other, so 'equal signature' and 'same class' are the same condition - grouping by signature cannot merge two classes or split one.
<!--ID: 1788289117007-->
END

START
Basic
Why can't prefix and suffix accumulation miss a valid answer?
Back: One left-to-right pass makes every prefix aggregate available before index i is read, and one right-to-left pass does the same for suffixes, so each index sees both sides while every element is visited a constant number of times.
<!--ID: 1788289117012-->
END

START
Basic
Why can't converging two pointers miss a valid answer?
Back: Because the sequence is sorted, moving the left end only increases the condition value and moving the right end only decreases it, so each move discards exactly the candidates that could never satisfy it and no valid pair is skipped.
<!--ID: 1788289117017-->
END

START
Basic
Why can't dijkstra for weighted shortest path miss a valid answer?
Back: When I pop the cheapest unfinalized node, any other route to it would have to leave through a node that already costs at least as much, so no cheaper path to it can still be discovered and its distance is final.
<!--ID: 1788289117021-->
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
