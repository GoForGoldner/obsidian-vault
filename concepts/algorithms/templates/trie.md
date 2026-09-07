---
tags: [algorithms, template, leetcode, neetcode, trie, strings]
category: algorithms
related: [trie, backtracking, dfs]
---

## Description
A prefix tree. Operations are O(L) in the **word** length, independent of how many words are
stored - which is the payoff when many queries share prefixes.

Every operation is the same character walk; only what you do at a missing link, and what you
check at the end, changes.

## Implementation
```java
class TrieNode {
    TrieNode[] next = new TrieNode[26];
    boolean end;                              // marks a complete word, not just a path
}

private final TrieNode root = new TrieNode();

void insert(String w) {
    TrieNode cur = root;

    for (char c : w.toCharArray()) {
        int i = c - 'a';

        if (cur.next[i] == null)              // (1) missing link: CREATE on insert,
            cur.next[i] = new TrieNode();     //     bail out on a query
        cur = cur.next[i];
    }

    cur.end = true;                           // (2) what the terminal node records
}

boolean query(String s, boolean wholeWord) {
    TrieNode cur = root;

    for (char c : s.toCharArray()) {
        cur = cur.next[c - 'a'];
        if (cur == null) return false;
    }

    return wholeWord ? cur.end : true;        // exact match needs `end`; prefix does not
}
```

## Variations
| Want | Change |
|---|---|
| `startsWith` vs `search` | the final check only: node exists, versus node exists **and** `end` |
| wildcard `.` matching any letter | recurse with an index instead of looping; on `.`, try **every** non-null child and return true if any branch matches; at the end of the pattern return `node.end` |
| driving a grid search | store the full **word** on its terminal node, then DFS the board carrying the current *trie node*. `nxt = node.next[ch-'a']`; a null `nxt` prunes the whole branch instantly - that is what makes it one board walk instead of one per word. Null the stored word after collecting it, which dedupes and prunes at once |
| max-XOR pairs | `next[2]` instead of `next[26]`, walking bits high-to-low |

## When to use (NeetCode 150)
- **Implement Trie (Prefix Tree)**, **Design Add and Search Words Data Structure** (wildcard).
- **Word Search II** - the grid variation. Doing it word-by-word with plain [[backtracking]]
  is O(words x board) and times out.

## Pitfalls
- `new TrieNode[26]` assumes lowercase only - check the constraints.
- `search` needs `end`; `startsWith` does not. Conflating them is the classic bug.
- In the grid variation, **restore** the board cell after recursing - it is backtracking, not
  flood fill.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the trie character-walk skeleton, plus the wildcard and grid variations
Back: Node = `TrieNode[26] next` + `boolean end`. Every op is the same walk over `c - 'a'`; only two things change: what a MISSING link does (create on insert, bail on query) and what you check at the END (`end` for an exact match, mere existence for a prefix).<br>Wildcard `.`: recurse with an index; on a dot try every non-null child, true if any matches; at pattern end return `node.end`.<br>Grid search: store the full word on its terminal node and DFS the board carrying the current TRIE NODE - a null child prunes instantly. Null the stored word after collecting (dedupes and prunes). Restore the cell - it is backtracking.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1783445398796-->
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
