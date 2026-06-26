---
tags: [react, web-dev, hooks]
category: web-dev
related: [usestate, useeffect, rules-of-hooks, usecontext, http-requests]
---

## Description
A custom hook is just a function whose name starts with **`use`** that calls other hooks. It's React's mechanism for extracting and reusing **stateful logic** (not markup) — the toggle behavior, the fetch-and-loading-state dance, a subscription — separately from any one component. There's no special API: you compose the built-in hooks (`useState`, `useEffect`, etc.) and return whatever the caller needs (often a tuple or object). The `use` prefix is mandatory because it's what the lint rule keys on to enforce the Rules of Hooks. Crucially, each component that calls your hook gets its **own isolated state** — calling `useToggle()` in two components creates two independent toggles; you are reusing logic, not sharing a value (sharing is Context's job). This replaces the old class-era patterns (HOCs, render props) for logic reuse.

## Examples

### useToggle — reusing simple stateful logic
```tsx
function useToggle(initial = false): [boolean, () => void] {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(prev => !prev), []);
  return [on, toggle]; // each caller gets its own independent `on`
}

// Two independent toggles:
const [open, toggleOpen] = useToggle();
const [dark, toggleDark] = useToggle(true);
```

### useFetch — composing useState + useEffect
```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } });
    return () => { cancelled = true; }; // ignore stale response on url change/unmount
  }, [url]);
  return { data, loading };
}
```

## Related Topics
- [[usestate|useState]]
- [[useeffect|useEffect]]
- [[rules-of-hooks|Rules of Hooks]]
- [[usecontext|useContext]]
- [[http-requests|HTTP Requests]]

## Cards

```anki
START
Basic
What actually makes a function a "custom hook" in React?
Back: Its name starts with `use` and it calls one or more other hooks. There's no special API — it just composes built-in hooks and returns whatever the caller needs.
<!--ID: 1782407009714-->
END

START
Basic
Why must a custom hook's name start with `use`?
Back: The eslint Rules-of-Hooks lint rule uses the `use` prefix to identify hooks and verify they're only called at the top level of components/hooks. Without it, the rule can't check call order.
<!--ID: 1782407009718-->
END

START
Basic
Two components both call your `useCounter()` hook. Do they share the same count?
Back: No. Each call site gets its own isolated state — you're reusing the *logic*, not the value. Sharing a value across components is Context's job, not a custom hook's.
<!--ID: 1782407009721-->
END

START
Basic
What kind of thing should you extract into a custom hook (and what shouldn't you)?
Back: Extract reusable *stateful logic* (toggles, fetching, subscriptions, timers). Don't extract JSX/markup — that's what regular components are for.
<!--ID: 1782407009725-->
END

START
Basic
In a `useFetch(url)` hook, why include `[url]` as the effect's dependency and a cancellation flag in cleanup?
Back: `[url]` re-fetches when the url changes; the cleanup flag (or AbortController) discards a now-stale in-flight response so a slow old request can't overwrite newer data.
<!--ID: 1782407009728-->
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
