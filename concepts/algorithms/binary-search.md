---
tags: [algorithms, technique, searching]
category: algorithms
related: [two-pointers, prefix-sum, backtracking]
---

## Description
Binary search finds information in a sorted search space by cutting the remaining range in half each step. Its core runtime is O(log n), and the three most common forms are exact match, lower bound for the first value greater than or equal to a target, and upper bound for the first value strictly greater than a target.

## Examples
```java
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

```java
int lowerBound(int[] arr, int target) {
    int left = 0, right = arr.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target) right = mid;
        else left = mid + 1;
    }
    return left;
}
```

## Related Topics
- [[two-pointers]]
- [[prefix-sum]]
- [[backtracking]]

## Cards

```anki
START
Basic
What's the difference between standard binary search, lower bound, and upper bound?
Back: Standard binary search finds an exact match and returns `-1` if missing (`left <= right`, then move `mid ± 1`). Lower bound returns the first index where `arr[i] >= target` (`left < right`, `right = mid`). Upper bound returns the first index where `arr[i] > target`. Count occurrences with `upperBound - lowerBound`.
<!--ID: 1780580932914-->
END

START
Basic
What's the gotcha with `mid = (left + right) / 2` in binary search?
Back: Integer overflow when `left + right` exceeds `Integer.MAX_VALUE`. Use `mid = left + (right - left) / 2` instead.
<!--ID: 1780580932917-->
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