---
tags: [algorithms, template, leetcode, neetcode, intervals, greedy, sorting]
category: algorithms
related: [line-sweep, greedy-scans, heap-top-k]
---

## Description
Every interval problem starts with a sort, and **which key you sort by is the whole decision**:

| Sort by | Because |
|---|---|
| **start** | you are merging or inserting - adjacency in start order is adjacency on the line |
| **end** | you are keeping a maximum non-conflicting subset - finishing earliest leaves the most room |

Sorting by the wrong key gives a plausible, wrong answer on exactly the cases the tests cover.

Two intervals overlap iff `a.start < b.end && b.start < a.end`. With `a` sorted first by
start, that collapses to `b.start < a.end` - the only comparison most of these need.

## Implementation
```java
List<int[]> sweep(int[][] intervals) {
    Arrays.sort(intervals, Comparator.comparingInt(iv -> iv[KEY]));  // (1) start or end

    List<int[]> out = new ArrayList<>();
    int state = initialState();

    for (int[] cur : intervals) {

        if (conflicts(cur, state)) {          // (2) the overlap test
            state = absorb(cur, state);       // (3) extend / count / skip
        } else {
            state = openNew(cur, out);        //     start a fresh run
        }
    }

    return out;
}
```

## Variations
| Want | (1) sort by | (2)/(3) |
|---|---|---|
| merge overlapping ranges | start | `cur[0] <= last[1]` -> `last[1] = max(last[1], cur[1])`, else append |
| insert one range into a sorted list | (already sorted) | three phases: copy everything ending **before** the new start, absorb everything starting at or before the new end (widening min/max), append the merged one, copy the rest |
| **most** non-conflicting ranges | **end** | keep when `cur[0] >= lastEnd`; the answer to "how many to remove" is `n - kept` |
| can one person attend all | start | fail if any `cur[0] < prev[1]` |
| how many are active at once | start | min-heap of **end** times: if `ends.peek() <= cur[0]` poll (reuse that slot), then offer this end. **The heap size is the answer** |
| ...without a heap | - | **sweep**: split into sorted `starts[]` and `ends[]`, walk the starts closing every end `<= start` (`active--`), then `active++` and track the max. Generalises to "busiest moment" |
| smallest range covering each query | start, **and sort the queries too** | offline: walk queries in value order, push every range that has opened into a heap keyed by size, lazily drop ones that already closed, then read `peek()`. Sort query **indices** so the output goes back in the original order |

## When to use (NeetCode 150)
- **Merge Intervals**, **Insert Interval**, **Non-overlapping Intervals**, **Meeting Rooms**,
  **Meeting Rooms II**, **Minimum Interval to Include Each Query**.
- **Partition Labels** is intervals in disguise - build `[first, last]` per letter and merge
  -> [[greedy-scans]].

## Pitfalls
- The sort key. Merging by end, or selecting by start, both look right and are wrong.
- Closed vs half-open: is `[1,2]` touching `[2,3]` an overlap? Merge problems usually say yes
  (`<=`), scheduling usually says no (`>=`). Decide before writing the comparison.
- `(a, b) -> a[0] - b[0]` overflows with large or negative bounds - use `Comparator.comparingInt`.
- Offline queries need the *indices* sorted, not just the values.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the interval sort-and-sweep skeleton, and the sort key that decides everything
Back: Sort by START when merging or inserting; sort by END when keeping a maximum non-conflicting subset (finishing earliest leaves the most room). The wrong key gives a plausible wrong answer.<br>Overlap test reduces to `cur[0] <= last[1]` once sorted by start.<br>Merge: extend with `last[1] = max(last[1], cur[1])`, else append. Max non-conflicting: keep when `cur[0] >= lastEnd`, answer `n - kept`.<br>How many active at once: min-heap of END times, poll when `peek() <= cur[0]`, and the HEAP SIZE is the answer - or a sweep over separately sorted starts and ends.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040449-->
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
