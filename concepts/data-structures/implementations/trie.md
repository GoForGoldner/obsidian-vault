---
tags: [data-structures, implementation, leetcode, strings]
category: data-structures
related: [trie, dfs, backtracking]
---

## Description
A prefix tree: each node has up to 26 children (one per lowercase letter) and a
flag marking the end of a word. Insert/search/startsWith are O(L) in the word
length L, independent of how many words are stored.

## Implementation
```java
class Trie {
    private static class Node {
        Node[] next = new Node[26];
        boolean end;
    }

    private final Node root = new Node();

    void insert(String word) {
        Node cur = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (cur.next[i] == null) cur.next[i] = new Node();
            cur = cur.next[i];
        }
        cur.end = true;
    }

    boolean search(String word) {
        Node n = walk(word);
        return n != null && n.end;
    }

    boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    // returns the node reached by following all chars, or null if a step is missing
    private Node walk(String s) {
        Node cur = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (cur.next[i] == null) return null;
            cur = cur.next[i];
        }
        return cur;
    }
}
```

## When to use (LeetCode)
- Autocomplete / prefix queries / "word search II" (DFS over a board + trie).
- Replace-words, longest-word-in-dictionary, and any multi-word prefix matching.
- Bitwise trie variant (children[2]) for max-XOR-pair problems.

## Cards
TARGET DECK: Implement Data Structures

```anki
START
Basic
Implement: Trie (Prefix Tree)
Back: Node holds `Node[26] next` + `boolean end`.<br>Insert/search/startsWith all walk char-by-char (`c - 'a'`), creating nodes on insert.<br>`search` needs the final node's `end == true`; `startsWith` just needs the node to exist.<br>Full reference in the ## Implementation section of this note.
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
