---
tags: [algorithms, template, leetcode, neetcode, hashing, arrays]
category: algorithms
related: [hash-table, prefix-sum, sliding-window, heap-top-k]
---

## Description
Spend O(n) memory to turn a nested scan into one pass. The map always answers the same
question: **"have I already seen the thing I need?"** Only two lines change per problem -
what you look up, and what you remember.

## Implementation
```java
int[] onePass(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();          // what I remember -> where

    for (int i = 0; i < nums.length; i++) {

        int want = target - nums[i];                       // (1) what completes the answer

        // Look up BEFORE inserting. Insert first and nums[i] pairs with itself.
        if (seen.containsKey(want))
            return new int[] { seen.get(want), i };

        seen.put(nums[i], i);                              // (2) what to remember about i
    }

    return new int[0];
}
```

## Variations
| Goal | (1) look up | (2) remember |
|---|---|---|
| pair hitting a target | `target - nums[i]` | value -> index |
| count occurrences | - | `map.merge(x, 1, Integer::sum)` |
| group equivalent items | a **canonical** key, e.g. `Arrays.toString(int[26])` | `computeIfAbsent(k, x -> new ArrayList<>()).add(v)` |
| top-k frequent | - | counts, then `List<Integer>[] bucket` indexed **by frequency**; read down from `n`. O(n), beats a heap |
| membership oracle | `set.contains(x - 1)` to skip non-starts | a plain `HashSet` |
| framing strings safely | - | length prefix `len + '#' + s`; any delimiter can appear in the payload |

`int[26]` beats a `HashMap` for a fixed alphabet, and makes `Arrays.equals` comparisons free.

## When to use (NeetCode 150)
- **Two Sum** (pair), **Contains Duplicate** (`set.add` returning false), **Valid Anagram**.
- **Group Anagrams** (signature), **Top K Frequent Elements** (bucket).
- **Longest Consecutive Sequence** (oracle - the `x - 1` guard *is* the O(n) argument).
- **Valid Sudoku** (three seen-sets keyed row / col / `(r/3)*3 + c/3`), **Encode and Decode Strings**.

## Pitfalls
- Insert after the lookup, never before.
- A raw `int[]` cannot be a map key - arrays hash by identity. Use `Arrays.toString`.
- Compare `Integer` keys with `.equals`, never `==`.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the one-pass hash map skeleton (and name what changes per problem)
Back: `Map seen`; loop once, compute what would COMPLETE the answer, look it up, and only then insert the current element - inserting first lets an element pair with itself.<br>Two knobs: what you look up, and what you store.<br>Counting = `merge(x, 1, Integer::sum)`. Grouping = canonical key + `computeIfAbsent(...).add(v)`. Top-k = bucket by frequency and read down from n. Oracle = HashSet plus a "skip non-starts" guard.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040437-->
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
