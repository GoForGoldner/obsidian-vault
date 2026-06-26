---
tags: [react, web-dev, hooks, side-effects]
category: web-dev
related: [usestate, useref, rules-of-hooks, custom-hooks, http-requests]
---

## Description
`useEffect` runs **side effects** — things outside React's pure render: data fetching, subscriptions, timers, manual DOM work, logging. It runs *after* the component renders and commits to the screen. The second argument is the **dependency array**, and its three forms have very different meanings: **omitted** → effect runs after *every* render; **`[]`** (empty) → runs *once* after mount (and cleanup on unmount); **`[a, b]`** → runs after mount and again whenever `a` or `b` changes (compared by reference/`Object.is`). The effect may return a **cleanup function**, which React calls before re-running the effect and on unmount — use it to clear timers, unsubscribe, abort fetches. Two classic bugs: the **stale closure** (an effect with `[]` captures the first render's values forever, because you lied about its deps) and the **infinite loop** (the effect sets state that's in its own deps, or depends on a fresh object/array recreated every render). The fix for stale closures is usually to list the real dependencies (or use the functional setter / a ref).

## Examples

### The three dependency-array forms
```tsx
useEffect(() => { /* after EVERY render */ });
useEffect(() => { /* once after mount */ }, []);
useEffect(() => { /* after mount + whenever userId changes */ }, [userId]);
```

### Fetch with cleanup (abort on change/unmount) — avoids stale results
```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(e => { if (e.name !== "AbortError") throw e; });
  return () => controller.abort(); // cleanup: runs before next effect + on unmount
}, [userId]); // re-run when userId changes
```

### Infinite-loop gotcha
```tsx
// BAD: effect sets count, count is a dependency -> render -> effect -> render -> ...
useEffect(() => { setCount(count + 1); }, [count]);
// Also bad: a new object each render is never === the last -> re-runs forever
useEffect(() => {/*...*/}, [{ id: 1 }]);
```

## Related Topics
- [[usestate|useState]]
- [[useref|useRef]]
- [[custom-hooks|Custom Hooks]]
- [[rules-of-hooks|Rules of Hooks]]
- [[http-requests|HTTP Requests]]

## Cards

```anki
START
Basic
Contrast the three dependency-array forms of useEffect: omitted, `[]`, and `[a]`. When does each effect run?
Back: Omitted -> after every render. `[]` -> once after mount (cleanup on unmount). `[a]` -> after mount and whenever `a` changes (compared with Object.is).
<!--ID: 1782407009859-->
END

START
Basic
What is a useEffect cleanup function, when does React call it, and what's it for?
Back: The function you `return` from the effect. React calls it before re-running the effect and on unmount. Use it to clear timers, unsubscribe, or abort fetches.
<!--ID: 1782407009862-->
END

START
Basic
You wrote an effect with `[]` that references `count`, and it always sees `count` as its initial value. What's this bug called and why does it happen?
Back: A stale closure. The empty deps array means the effect runs once, capturing the first render's `count` forever. Fix: list `count` in deps, or use a functional setter / ref.
<!--ID: 1782407009865-->
END

START
Basic
`useEffect(() => setCount(count + 1), [count])` freezes the page. Why?
Back: Infinite loop: the effect updates `count`, which is a dependency, triggering a re-render and the effect again, endlessly.
<!--ID: 1782407009868-->
END

START
Basic
An effect with deps `[options]` re-runs every render even though "nothing changed." `options` is `{ sort: "asc" }` defined inline. Why?
Back: A new object literal is created each render and is never reference-equal (Object.is) to the previous one, so React thinks the dep changed. Memoize it (useMemo) or list primitive fields instead.
<!--ID: 1782407009871-->
END

START
Basic
Why does useEffect run *after* render rather than during it?
Back: Render must be pure (no side effects). React commits the DOM first, then runs effects, so the screen is consistent and side effects don't block painting or corrupt the render.
<!--ID: 1782407009874-->
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
