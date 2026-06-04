---
tags: [algorithms, technique, intervals]
category: algorithms
related: [sorting-algorithms, heap-priority-queue, two-pointers]
---

## Description
Line sweep solves interval and event problems by turning starts and ends into sorted events along a number line, then scanning from left to right while maintaining a running state such as active overlaps. Because sorting dominates the work, the pattern usually runs in O(n log n) and is especially useful for overlap counting, meeting rooms, and interval merging problems.

## Examples
Max overlap with `+1 / -1` events:
```java
List<int[]> events = new ArrayList<>();
for (int[] interval : intervals) {
    events.add(new int[]{interval[0], 1});
    events.add(new int[]{interval[1], -1});
}

events.sort((a, b) -> {
    if (a[0] != b[0]) return a[0] - b[0];
    return a[1] - b[1]; // end before start when touching does not overlap
});

int active = 0, best = 0;
for (int[] event : events) {
    active += event[1];
    best = Math.max(best, active);
}
```

Merge intervals after sorting by start:
```java
Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
List<int[]> merged = new ArrayList<>();

for (int[] cur : intervals) {
    if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < cur[0]) {
        merged.add(new int[]{cur[0], cur[1]});
    } else {
        merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], cur[1]);
    }
}
```

## Related Topics
- [[sorting-algorithms|Sorting Algorithms]]
- [[heap-priority-queue|Heap / Priority Queue]]
- Intervals
- Meeting Rooms
- Merge Intervals

## Cards

```anki
START
Basic
You see: overlapping intervals, need to find max concurrent overlap or merge them. What technique?
Back: Line Sweep. Convert each interval to two events: (start, +1) and (end, -1). Sort by position, sweep left→right maintaining a running count. Peak count = max overlap = min meeting rooms needed.
<!--ID: 1780580932957-->
END

START
Basic
How do you handle tie-breaking when sorting line sweep events?
Back: Depends on the problem definition. If intervals touching at a point DON'T overlap: process ends (-1) before starts (+1) at the same position. If they DO overlap: process starts before ends. Wrong tie-breaking gives off-by-one errors.
<!--ID: 1780580932959-->
END

START
Basic
Why is line sweep usually O(n log n)?
Back: You create O(n) events and sort them, which costs O(n log n). The actual sweep pass is linear because you only scan the sorted events once while updating a running state.
<!--ID: 1780580932960-->
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
