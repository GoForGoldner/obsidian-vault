---
tags: [algorithms, template, leetcode, neetcode, backtracking, recursion]
category: algorithms
related: [backtracking, dfs, trie, tree-traversal]
---

## Description
DFS over a decision tree: **choose**, **recurse**, **un-choose**. That last line is the whole
pattern - it is what lets one mutable `path` serve every branch.

Three knobs cover the entire category:

| Knob | Combinations / subsets | Permutations |
|---|---|---|
| loop starts at | `start` | `0` |
| prevents reuse via | passing `i + 1` | a `used[]` flag |
| records the answer | at **every** node | only when `path` is full |

## Implementation
```java
void backtrack(int[] a, int start, List<Integer> path, List<List<Integer>> res) {

    if (isComplete(path)) {                        // (1) when to record
        res.add(new ArrayList<>(path));            //     DEEP COPY - path keeps mutating
        return;                                    //     (drop the return to record at every node)
    }

    for (int i = start; i < a.length; i++) {       // (2) where the loop starts

        if (skip(a, i, start)) continue;           // (3) pruning / duplicate guard

        path.add(a[i]);                            // choose
        backtrack(a, i + 1, path, res);            // (4) explore - i+1 forbids reuse, i allows it
        path.remove(path.size() - 1);              // un-choose
    }
}
```

## Variations
| Problem shape | (1) record | (2)/(4) | (3) skip when |
|---|---|---|---|
| all subsets | at **every** node (no `return`) | `start`, pass `i + 1` | - |
| subsets with duplicate input | same | same | sort first, then `i > start && a[i] == a[i-1]` - equal **siblings**, so `i > start`, **not** `i > 0` |
| combinations summing to a target, reuse allowed | `remain == 0` | `start`, pass **`i`** | `a[i] > remain` (`break` if sorted) |
| same, each item once | `remain == 0` | `start`, pass `i + 1` | the duplicate guard above |
| permutations | `path.size() == n` | loop from **`0`**, `used[]` | `used[i]` |
| permutations with duplicates | same | same | `i > 0 && a[i] == a[i-1] && !used[i-1]` - `!used[i-1]` means the equal twin was already un-chosen, so this is a sibling branch |
| partition a string | `start == s.length()` | `start`, pass `end + 1`, looping `end` over cut points | the piece is not valid (e.g. not a palindrome) |
| grid path search | the target is matched | recurse the 4 directions | out of bounds, or a mismatch |
| N-Queens | `row == n` | recurse row by row, looping `col` | `col[c] \|\| diag[r-c+n-1] \|\| anti[r+c]` - three boolean arrays give an O(1) conflict test |

**Grid backtracking** differs from flood-fill [[dfs]] by exactly one line: write a sentinel
into the cell, recurse, then **restore it**, because other paths still need that cell.

## When to use (NeetCode 150)
- **Subsets**, **Subsets II**, **Combination Sum**, **Combination Sum II**, **Permutations**,
  **Letter Combinations of a Phone Number**, **Palindrome Partitioning**, **N-Queens**.
- **Word Search** - grid variation. **Word Search II** drives the same walk from a
  [[trie]] instead of one target string.
- If you need a *count* or an *optimum* rather than the configurations themselves, DP
  collapses the branches -> see [[dp-knapsack]].

## Pitfalls
- `res.add(path)` without the copy - every result ends up empty.
- `i` vs `i + 1` in the recursive call: one character, completely different answer set.
- The duplicate guard differs between the two families (`i > start` vs `i > 0 && !used[i-1]`).
- Restore grid cells. Forgetting turns backtracking into flood fill and loses answers.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the backtracking skeleton, and the three knobs that specialise it
Back: choose -> recurse -> un-choose. Record with a DEEP COPY, `new ArrayList<>(path)`.<br>Knobs: (a) loop from `start` for combinations/subsets, from `0` with a `used[]` flag for permutations; (b) pass `i+1` to forbid reuse or `i` to allow it; (c) record at EVERY node for subsets, only when `path` is full for permutations.<br>Duplicates: sort, then `i > start && a[i]==a[i-1]` for combinations (equal SIBLINGS - not `i > 0`), or `i > 0 && a[i]==a[i-1] && !used[i-1]` for permutations.<br>Grid variant = flood fill plus one line: RESTORE the cell after recursing.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398746-->
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
