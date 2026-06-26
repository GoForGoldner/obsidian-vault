---
tags: [react, web-dev, hooks]
category: web-dev
related: [usestate, useeffect, custom-hooks, usecontext, conditional-rendering-and-lists]
---

## Description
There are exactly two Rules of Hooks. **(1) Only call hooks at the top level** of a component or custom hook — never inside conditions, loops, nested functions, or after an early `return`. **(2) Only call hooks from React function components or other custom hooks** — not from regular functions, event handlers, or class components. The reason for rule 1 is mechanical: React has no names for your hooks; it identifies each piece of state purely by **call order**, matching the Nth `useState` call this render to the Nth from last render. If a hook is inside an `if` that sometimes runs and sometimes doesn't, the call order shifts between renders and React hands back the *wrong* state — silent, nasty bugs. So you always call the same hooks in the same order every render; to conditionalize, put the condition *inside* the hook or conditionally use the result, not the call. The `eslint-plugin-react-hooks` lint rule (`rules-of-hooks`) catches violations at dev time.

## Examples

### Wrong: hook inside a condition (call order changes)
```tsx
function Profile({ loggedIn }: { loggedIn: boolean }) {
  if (loggedIn) {
    const [name, setName] = useState(""); // BREAKS: call count varies by render
  }
  // ...
}
```

### Right: hook at top level, conditionalize the logic instead
```tsx
function Profile({ loggedIn }: { loggedIn: boolean }) {
  const [name, setName] = useState("");        // always called, same order
  useEffect(() => {
    if (!loggedIn) return;                      // put the condition INSIDE
    fetchProfile().then(setName);
  }, [loggedIn]);
  return loggedIn ? <span>{name}</span> : null; // early return AFTER all hooks
}
```

## Related Topics
- [[usestate|useState]]
- [[useeffect|useEffect]]
- [[custom-hooks|Custom Hooks]]
- [[conditional-rendering-and-lists|Conditional Rendering & Lists]]

## Cards

```anki
START
Basic
State the two Rules of Hooks.
Back: (1) Only call hooks at the top level — never in conditions, loops, nested functions, or after an early return. (2) Only call hooks from React function components or custom hooks.
<!--ID: 1782407009840-->
END

START
Basic
Mechanically, why does calling a hook inside an `if` break React?
Back: React identifies each hook's state by call order, matching the Nth call this render to the Nth last render. A conditional call changes the order, so React returns the wrong state for subsequent hooks.
<!--ID: 1782407009843-->
END

START
Basic
You need an effect to run only when `loggedIn` is true. Where does the `if` go — around the `useEffect` call or inside it?
Back: Inside it. Always call `useEffect` unconditionally; put `if (!loggedIn) return;` (or the condition) inside the effect body, or list `loggedIn` in deps.
<!--ID: 1782407009846-->
END

START
Basic
Can you call `useState` inside an `onClick` handler? Why or why not?
Back: No. Hooks may only be called at the top level of a component or custom hook, not inside event handlers, loops, or other regular functions.
<!--ID: 1782407009849-->
END

START
Basic
What tool catches Rules-of-Hooks violations, and how does it know a function is a hook?
Back: The `eslint-plugin-react-hooks` lint rule. It treats capitalized functions as components and `use`-prefixed functions as hooks, then verifies hook calls aren't conditional/nested.
<!--ID: 1782407009852-->
END

START
Basic
Is it OK to have an early `return null;` in a component, given the top-level rule?
Back: Yes, as long as ALL hook calls happen before the early return. The rule forbids hooks *after* a conditional return, because then they'd be skipped on some renders.
<!--ID: 1782407009855-->
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
