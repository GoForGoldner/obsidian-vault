---
tags: [data-structures, implementation, leetcode, recursion]
category: data-structures
related: [backtracking, dfs, trie]
---

## Description
Systematic DFS over a decision tree: **choose** an option, **recurse**, then
**undo** the choice (backtrack) so the next branch starts clean. The template is
the same for subsets, permutations, and combinations — only the loop bounds and
the "skip" rules change.

## Implementation
```java
// Subsets: every subset of nums (no duplicates in input).
List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}
private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));          // record every node (each is a valid subset)
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);                   // choose
        backtrack(nums, i + 1, path, res);   // explore (i+1 => no reuse, forward only)
        path.remove(path.size() - 1);        // un-choose (backtrack)
    }
}

// Permutations: use a `used[]` flag and loop from 0 each level.
List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    permute(nums, new boolean[nums.length], new ArrayList<>(), res);
    return res;
}
private void permute(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(nums[i]);
        permute(nums, used, path, res);
        path.remove(path.size() - 1); used[i] = false;
    }
}
```

## When to use (LeetCode)
- Enumerate all subsets / permutations / combinations; combination sum; palindrome
  partitioning; N-queens; word search; sudoku.
- Prune early (skip invalid choices, sort + skip duplicates with `i > start && nums[i]==nums[i-1]`).

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Backtracking template (subsets / permutations)
Back: Loop over choices: choose (add) -> recurse -> un-choose (remove). Undoing is what makes it backtracking.<br>Subsets: pass `i+1` as next start (forward only), record at every node.<br>Permutations: `used[]` flag, loop from 0, record when path is full.<br>Full reference in the ## Implementation section of this note.
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
