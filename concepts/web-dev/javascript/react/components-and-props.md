---
tags: [react, web-dev, components, typescript]
category: web-dev
related: [react-overview, jsx, usestate, usecontext, conditional-rendering-and-lists]
---

## Description
A function component takes a single object argument — **props** — and returns JSX. Props are the component's read-only inputs (think constructor args, but immutable): the parent passes them as JSX attributes, and you receive them by destructuring the props object. In TypeScript you type props with an **interface** (or `type`); this gives you autocomplete and compile-time checking on every usage. The special `children` prop holds whatever JSX you nest between the component's tags. There's no built-in "default props" for function components — you just give the destructured parameters JS default values. Passing a prop down through many intermediate components that don't use it is **prop drilling**, the pain point that Context exists to solve.

## Examples

### Typed props with an interface, defaults, and children
```tsx
interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary"; // optional (note the ?)
  onClick: () => void;
  children?: React.ReactNode;          // anything renderable nested inside
}

function Button({ label, variant = "primary", onClick, children }: ButtonProps) {
  return (
    <button className={variant} onClick={onClick}>
      {label} {children}
    </button>
  );
}

// Usage — TS errors if you forget onClick or misspell variant
<Button label="Save" variant="secondary" onClick={save}>
  <Icon name="disk" /> {/* this becomes children */}
</Button>
```

### Prop drilling (the problem)
```tsx
// `user` is needed only by Avatar, but must be threaded through every layer.
function App()    { return <Page user={user} />; }
function Page({ user }) { return <Header user={user} />; }
function Header({ user }) { return <Avatar user={user} />; } // <- finally used here
```

## Related Topics
- [[react-overview|React Overview]]
- [[jsx|JSX]]
- [[usecontext|useContext]]
- [[usestate|useState]]
- [[conditional-rendering-and-lists|Conditional Rendering & Lists]]

## Cards

```anki
START
Basic
How do you give a function component's prop a default value in modern React (there's no `defaultProps` for you to use)?
Back: Use a JS default in the destructured parameter list: `function Button({ variant = "primary" }: Props)`. The default applies when the prop is omitted/undefined.
<!--ID: 1782407009731-->
END

START
Basic
Write the TypeScript to type a `Greeting` component's props that take a required `name: string` and an optional `count?: number`.
Back: `interface GreetingProps { name: string; count?: number; }` then `function Greeting({ name, count }: GreetingProps) { ... }`
<!--ID: 1782407009734-->
END

START
Basic
What is the `children` prop and how does a parent pass it?
Back: `children` is whatever JSX is nested between the component's opening and closing tags: `<Card>this is children</Card>`. You type it as `React.ReactNode`.
<!--ID: 1782407009737-->
END

START
Basic
Are props mutable? What happens if you try to reassign `props.name = "x"` inside a component?
Back: Props are read-only — a component must never mutate its props. Treat them like immutable inputs from the parent; to change displayed data, use state or have the parent pass new props.
<!--ID: 1782407009740-->
END

START
Basic
What is "prop drilling" and which React feature is designed to relieve it?
Back: Passing a prop down through many intermediate components that don't use it, just to reach a deep child. Context (createContext/useContext) lets the deep child read the value directly without threading.
<!--ID: 1782407009743-->
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
