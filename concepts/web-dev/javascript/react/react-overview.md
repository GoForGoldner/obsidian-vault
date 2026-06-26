---
tags: [react, web-dev, components]
category: web-dev
related: [jsx, components-and-props, usestate, useeffect]
---

## Description
React is a JavaScript library for building UIs out of **components** — self-contained functions that return a description of what the screen should look like. The model is **declarative**: you describe the UI as a function of state (`UI = f(state)`), and React figures out the DOM mutations needed to get there, instead of you imperatively calling `element.appendChild(...)` like in vanilla DOM. React keeps a lightweight in-memory tree (the **virtual DOM**); when state changes it re-runs your component, diffs the new tree against the old one, and patches only what actually changed. Coming from Java/Swing or imperative GUI code, the mental shift is: you never "update the widget" — you update state and let React re-render. Modern React (19) is built around **function components and hooks**, not classes.

## Examples

### A component is just a function returning markup
```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

// Used like an HTML tag, capitalized name is mandatory for components
<Greeting name="Tyler" />
```

### Declarative: UI follows state automatically
```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  // You don't touch the DOM. You change state; React re-renders this function.
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}
```

## Related Topics
- [[jsx|JSX]]
- [[components-and-props|Components & Props]]
- [[usestate|useState]]
- [[useeffect|useEffect]]

## Cards

```anki
START
Basic
React's core mental model is summarized by the equation UI = f(state). What does that mean for how you update the screen?
Back: You never imperatively mutate the DOM. You update state, and React re-runs your component and re-derives the UI. The view is a pure function of state.
<!--ID: 1782407009806-->
END

START
Basic
What is the "virtual DOM" and what problem does it solve?
Back: A lightweight in-memory tree of your UI. On each render React diffs the new tree against the previous one and applies only the minimal real-DOM mutations, so you don't hand-write DOM updates.
<!--ID: 1782407009810-->
END

START
Basic
You're coming from imperative GUI code (Swing/vanilla DOM). What's the key behavioral difference when something needs to change on screen in React?
Back: You don't find the element and mutate it. You call a state setter; React re-renders the affected components. The DOM is an output, not something you manage.
<!--ID: 1782407009814-->
END

START
Basic
Why must a React component name start with a capital letter (e.g. `Greeting`, not `greeting`)?
Back: JSX treats lowercase tags as built-in HTML elements (strings like "div") and capitalized tags as component references. Lowercase would be rendered as an unknown HTML tag, not your component.
<!--ID: 1782407009817-->
END

START
Basic
In modern React 19, are you expected to write class components with `render()` and lifecycle methods?
Back: No. Modern React is function components + hooks. Classes still work but are legacy; new code uses functions and hooks like useState/useEffect.
<!--ID: 1782407009820-->
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
