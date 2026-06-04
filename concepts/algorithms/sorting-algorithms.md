---
tags: [algorithms, sorting]
category: algorithms
related: [heap-priority-queue, line-sweep, cyclic-sort]
---

## Description
Sorting problems split into comparison-based algorithms like merge sort and quick sort, which are typically O(n log n), and specialized non-comparison approaches like bucket sort, which can reach linear-time performance when the input distribution fits the assumptions. Merge sort gives stable, guaranteed O(n log n) behavior with O(n) extra space, quick sort is usually fast and in-place but has O(n²) worst case, and bucket sort shines when values are uniformly distributed or frequencies can be grouped efficiently.

## Examples
Merge sort skeleton:
```java
void mergeSort(int[] nums, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(nums, left, mid);
    mergeSort(nums, mid + 1, right);
    merge(nums, left, mid, right);
}
```

Quick sort with Lomuto partition:
```java
int partition(int[] nums, int low, int high) {
    int pivot = nums[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if (nums[j] <= pivot) {
            int temp = nums[i];
            nums[i] = nums[j];
            nums[j] = temp;
            i++;
        }
    }
    int temp = nums[i];
    nums[i] = nums[high];
    nums[high] = temp;
    return i;
}
```

Bucket sort idea for top-K frequent:
```java
Map<Integer, Integer> freq = new HashMap<>();
for (int num : nums) freq.put(num, freq.getOrDefault(num, 0) + 1);

List<Integer>[] buckets = new List[nums.length + 1];
for (int num : freq.keySet()) {
    int count = freq.get(num);
    if (buckets[count] == null) buckets[count] = new ArrayList<>();
    buckets[count].add(num);
}

for (int count = buckets.length - 1; count >= 0 && ans.size() < k; count--) {
    if (buckets[count] != null) ans.addAll(buckets[count]);
}
```

## Related Topics
- [[heap-priority-queue|Heap / Priority Queue]]
- [[line-sweep|Line Sweep]]
- [[cyclic-sort|Cyclic Sort]]
- Quick Select
- Top K Frequent Elements

## Cards

```anki
START
Basic
When do you choose merge sort vs quick sort vs bucket sort?
Back: Merge sort: need stability or guaranteed O(n log n), willing to pay O(n) space. Quick sort: in-place preferred, average O(n log n), randomize pivot to avoid O(n²). Bucket sort: data uniformly distributed in known range, O(n) average.
END

START
Basic
What is Quick Select and when do you use it?
Back: Find the kth smallest element in O(n) average. Same partition as quick sort, but only recurse into ONE side (the side containing k). After partitioning, pivot is at its final sorted position — if that's k, you're done.
END

START
Basic
What's the difference between Lomuto and Hoare partitioning in quicksort?
Back: Lomuto: pivot at end, one pointer from left, simpler. Hoare: pivot at middle, two pointers from both ends, fewer swaps on average. Lomuto recurses on (low, p-1) and (p+1, high). Hoare recurses on (low, p) and (p+1, high).
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
