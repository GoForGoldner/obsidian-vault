---
tags: [algorithms, template, leetcode, neetcode, stack]
category: algorithms
related: [monotonic-stack, backtracking, tree-traversal]
---

## Description
A stack for **nesting and deferred evaluation**: when the meaning of a token can only be
settled once you reach its partner, push it and resolve on the way back out. The tell is
nested or postfix structure - brackets, expressions, encoded strings.

## Implementation
```java
boolean parse(String s) {
    Deque<Character> st = new ArrayDeque<>();

    for (char c : s.toCharArray()) {

        if (opens(c)) {
            st.push(c);                                  // (1) defer this token
        } else {
            // A closer must find its exact partner waiting on top.
            if (st.isEmpty() || !matches(st.pop(), c))   // (2) the resolve step
                return false;
        }
    }

    return st.isEmpty();                                 // leftovers = unclosed
}
```

## Variations
| Problem | (1) push | (2) resolve |
|---|---|---|
| bracket matching | any opener | `close.get(c)` must equal the popped opener; map `)->(`, `]->[`, `}->{` |
| postfix evaluation | any operand | pop into `b` then `a` **in that order**, push `a op b` |
| O(1) auxiliary query | the pair `{value, min(value, currentMin)}` | `getMin()` is `peek()[1]` - carrying the answer per element beats recomputing, and handles duplicate minima free |
| generate all valid nestings | - | not a literal stack: recurse with counters, `open < n` to add one, `close < open` to close one. See [[backtracking]] |

## When to use (NeetCode 150)
- **Valid Parentheses**, **Evaluate Reverse Polish Notation**, **Min Stack**.
- **Generate Parentheses** - the counter variation; `close < open` *is* the whole problem.
- Ordering-sensitive stacks (nearest greater, histogram) are a different pattern ->
  [[monotonic-stack]].

## Pitfalls
- Check `isEmpty()` before `pop()` - `ArrayDeque` throws, it does not return null.
- Non-commutative operators: `int b = pop(), a = pop();` then `a - b`. Writing
  `pop() - pop()` gambles on evaluation order.
- Min Stack must survive duplicate minima - store the running min per element rather than a
  second stack that only pushes on strict `<`.

## Cards
TARGET DECK: Neetcode 150::Templates

```anki
START
Basic
Implement: the stack skeleton for nesting / deferred evaluation
Back: Push tokens whose meaning is not yet settled; on a resolving token, pop and check it matches. Valid only if the stack ends EMPTY. Check `isEmpty()` before popping - ArrayDeque throws.<br>Brackets: map closer -> opener, pop must equal it.<br>RPN: pop into `b` then `a` (that order), push `a op b`.<br>O(1) auxiliary query (min stack): push the PAIR `{value, min(value, curMin)}` - carrying the answer per element makes the query O(1) and handles duplicate minima for free.<br>Full reference in the ## Implementation section of this note.
<!--ID: 1788749040492-->
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
