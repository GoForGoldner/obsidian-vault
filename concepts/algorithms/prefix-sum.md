---
tags: [algorithms, technique, array]
category: algorithms
related: [two-pointers, binary-search, monotonic-stack]
---

## Description
Prefix sum precomputes cumulative totals so repeated range-sum questions on a static array become constant-time queries after a linear-time build. The same idea extends to 2D grids for submatrix sums, making it a foundational pattern for many array, matrix, and counting problems.

## Examples
```java
int[] buildPrefix(int[] arr) {
    int[] prefix = new int[arr.length + 1];
    for (int i = 0; i < arr.length; i++) {
        prefix[i + 1] = prefix[i] + arr[i];
    }
    return prefix;
}

int rangeSum(int[] prefix, int left, int right) {
    return prefix[right + 1] - prefix[left];
}
```

## Related Topics
- [[two-pointers]]
- [[binary-search]]
- [[monotonic-stack]]

## Cards

```anki
START
Basic
You see: multiple range sum queries on a static array. What technique?
Back: Prefix Sum. Build `prefix[i]` as the sum of `arr[0..i-1]` in O(n), then answer `rangeSum(l, r) = prefix[r + 1] - prefix[l]` in O(1). Using `arr.length + 1` avoids boundary special cases.
END

START
Basic
How does 2D prefix sum work for submatrix queries?
Back: Build `prefix[i][j]` as the sum of the rectangle above and left using inclusion-exclusion. Then query `(r1,c1)` to `(r2,c2)` with `prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1]`. Build is O(mn), each query is O(1).
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