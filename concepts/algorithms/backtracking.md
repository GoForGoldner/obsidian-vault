---
tags: [algorithms, technique, recursion]
category: algorithms
related: [dfs, dynamic-programming, binary-search]
---

## Description
Backtracking explores a search space by trying a choice, recursing, and undoing that choice when returning. The core pattern is Choose → Explore → Unchoose, which makes it ideal for subsets, permutations, combinations, and other constraint-satisfaction problems where you need to systematically try candidates and prune bad paths.

## Examples
```java
void backtrack(List<Integer> path, int start) {
    // record when appropriate
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);          // choose
        backtrack(path, i + 1);     // explore
        path.remove(path.size() - 1); // unchoose
    }
}
```

| Pattern | Loop start | Extra state | When to record |
| --- | --- | --- | --- |
| Subsets | `i = start` | none | Every call |
| Permutations | `i = 0` | `boolean[] used` | At leaf: `path.size() == n` |
| Combinations | `i = start` | target size `k` | When `path.size() == k` |

## Related Topics
- [[dfs]]
- [[dynamic-programming]]
- [[binary-search]]

## Cards

```anki
START
Basic
You see: generate all subsets/permutations/combinations. What technique?
Back: Backtracking. Choose-Explore-Unchoose. Key differences: subsets record at every node (`i = start`), permutations record at leaves only (`i = 0`, `used[]`), combinations record at target size (`i = start`).
END

START
Basic
What's the key difference between generating subsets vs permutations in backtracking?
Back: Subsets loop from `start` index, enforcing order and avoiding revisits, and record at every recursive call. Permutations loop from `0` every time with a `used[]` array and only record when `current.size() == n`. Changing `i = start` to `i = 0` turns subsets into permutations.
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