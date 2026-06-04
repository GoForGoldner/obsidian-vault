---
tags: [algorithms, technique, sorting]
category: algorithms
related: [sorting-algorithms, dynamic-programming, two-pointers]
---

## Description
Cyclic sort exploits the fact that the values belong to a known range like `1..n` or `0..n`, so each number has a correct target index. By swapping values into place instead of fully comparing and ordering everything, you can solve missing-number, duplicate-number, and first-missing-positive problems in O(n) time and O(1) extra space.

## Examples
Basic cyclic sort for values in `[1, n]`:
```java
int i = 0;
while (i < nums.length) {
    int correct = nums[i] - 1;
    if (nums[i] >= 1 && nums[i] <= nums.length && nums[i] != nums[correct]) {
        int temp = nums[i];
        nums[i] = nums[correct];
        nums[correct] = temp;
    } else {
        i++;
    }
}
```

Find missing number after placement:
```java
for (int j = 0; j < nums.length; j++) {
    if (nums[j] != j + 1) {
        return j + 1;
    }
}
return nums.length + 1;
```

## Related Topics
- [[sorting-algorithms|Sorting Algorithms]]
- [[dynamic-programming|Dynamic Programming]]
- Missing Number
- First Missing Positive
- Find Duplicates

## Cards

```anki
START
Basic
You see: array of n numbers in range [1,n], need to find missing or duplicate numbers in O(n) time, O(1) space. What technique?
Back: Cyclic Sort. Swap each value to its correct index (value v goes to index v-1). After placing, scan for mismatches — they ARE the answer. Each element swapped at most once → O(n).
END

START
Basic
What's the key insight that makes cyclic sort work for 'first missing positive'?
Back: Only values in [1, n] matter — ignore negatives, zeros, and values > n. After placing valid values at their correct indices, the first index where nums[i] != i+1 is the answer. Everything else is noise.
END

START
Basic
Why does cyclic sort stay O(n) even though it uses swaps inside a loop?
Back: Each successful swap places at least one value into its correct position, so elements do not keep bouncing around forever. That bounds the total number of swaps across the whole array to O(n), not O(n^2).
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
