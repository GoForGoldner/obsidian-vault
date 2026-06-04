---
tags: [algorithms, data-structures, strings]
category: algorithms
related: [dynamic-programming, two-pointers, bfs]
---

## Description
A trie, or prefix tree, stores characters one level at a time so that paths from the root form prefixes and marked terminal nodes form complete words. Because each operation walks only the characters in the input, insert, search, and prefix queries all run in O(L), where L is the word length, making tries ideal for autocomplete, prefix search, and word dictionary problems.

## Examples
Basic Trie with `insert`, `search`, and `startsWith`:
```java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEnd;
}

class Trie {
    private final TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new TrieNode();
            }
            node = node.children[idx];
        }
        node.isEnd = true;
    }

    boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.isEnd;
    }

    boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    private TrieNode walk(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) return null;
            node = node.children[idx];
        }
        return node;
    }
}
```

## Related Topics
- [[dynamic-programming|Dynamic Programming]]
- HashSet
- Prefix Search
- Autocomplete
- Word Search

## Cards

```anki
START
Basic
You see: need efficient prefix matching, autocomplete, or word dictionary operations. What data structure?
Back: Trie (prefix tree). Each node has children[26] for a-z and an isEnd flag. Insert/search/startsWith all O(L). Use over HashSet when you need prefix queries — HashSet can't do startsWith efficiently.
END

START
Basic
When should you use a Trie vs a HashSet for string lookups?
Back: HashSet for exact match only (O(1)). Trie when you need prefix operations (startsWith, count words with prefix, autocomplete). Trie also supports ordered traversal and wildcard matching. Trie uses more memory but enables prefix queries.
END

START
Basic
What does the `isEnd` flag represent in a trie node?
Back: It marks that the path from the root to this node forms a complete stored word. Without `isEnd`, you could detect prefixes but not distinguish a full word like `app` from a longer word like `apple`.
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
