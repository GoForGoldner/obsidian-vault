---
tags: [react, web-dev, hooks, performance]
category: web-dev
related: [useeffect, usestate, custom-hooks, rules-of-hooks]
---

## Description
`useMemo` and `useCallback` are **caching** hooks tied to a dependency array (same rules as `useEffect`): they return the *same* reference across renders until a dependency changes. `useMemo(fn, deps)` caches the **value** that `fn` returns; `useCallback(fn, deps)` caches the **function** itself (it's just `useMemo(() => fn, deps)`). The point is almost never raw speed — it's **referential equality**. In JS, `{} !== {}` and `() => {} !== () => {}`, so a freshly-created object/function passed to a memoized child component, or listed in another hook's deps, looks "changed" every render and defeats memoization or re-triggers effects. These hooks give you a stable reference. They are **easy to overuse**: each one has its own bookkeeping cost, and memoizing a cheap computation is premature optimization. Reach for them only when (a) the computation is genuinely expensive, or (b) the stable reference is needed by `React.memo`, a dependency array, or a context value.

## Examples

### useMemo for an expensive computation
```tsx
const sorted = useMemo(
  () => [...items].sort((a, b) => a.price - b.price), // recomputed only when items changes
  [items]
);
```

### useCallback to keep a function reference stable
```tsx
// Without useCallback, onSelect is a new function every render, so a memoized
// <Row> would re-render even when nothing it cares about changed.
const onSelect = useCallback((id: string) => setSelected(id), []); // setSelected is stable
return rows.map(r => <Row key={r.id} onSelect={onSelect} />);
```

### When NOT to bother
```tsx
// Premature: the work is trivial; the memo costs more than it saves.
const total = useMemo(() => a + b, [a, b]); // just write: const total = a + b;
```

## Related Topics
- [[useeffect|useEffect]]
- [[usestate|useState]]
- [[custom-hooks|Custom Hooks]]
- [[rules-of-hooks|Rules of Hooks]]

## Cards

```anki
START
Basic
What does `useMemo` cache vs what does `useCallback` cache?
Back: `useMemo(fn, deps)` caches the value `fn` returns. `useCallback(fn, deps)` caches the function itself. (`useCallback(fn, d)` === `useMemo(() => fn, d)`.)
<!--ID: 1782407009878-->
END

START
Basic
The real reason to use useMemo/useCallback is usually NOT speed. What is it?
Back: Referential equality. In JS a new object/function is never === the previous one, which breaks React.memo, dependency arrays, and context. These hooks return a stable reference.
<!--ID: 1782407009881-->
END

START
Basic
A coworker wraps every value and handler in useMemo/useCallback "for performance." Why is that often a mistake?
Back: Each memo has its own cost (storing deps, comparing them). For cheap computations or non-referential uses it adds overhead and clutter without benefit — premature optimization.
<!--ID: 1782407009885-->
END

START
Basic
You pass an inline `onClick={() => ...}` to a `React.memo`-wrapped child and it still re-renders every time. Why, and what fixes it?
Back: A new arrow function is created each render, so the prop reference changes and memo can't bail out. Wrap it in `useCallback(fn, deps)` to keep the reference stable.
<!--ID: 1782407009889-->
END

START
Basic
Name two concrete situations where reaching for useMemo/useCallback is justified.
Back: (1) The computation is genuinely expensive (large sort/filter). (2) A stable reference is required — by React.memo, another hook's dependency array, or a context Provider value.
<!--ID: 1782407009892-->
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
