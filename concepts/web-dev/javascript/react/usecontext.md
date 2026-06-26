---
tags: [react, web-dev, hooks, context]
category: web-dev
related: [components-and-props, usestate, custom-hooks, usememo-usecallback]
---

## Description
Context lets a value be read by any descendant component without passing it through every intermediate prop — the cure for **prop drilling**. Three pieces: `createContext(defaultValue)` makes a context object; a **`<Context.Provider value={...}>`** wraps a subtree and supplies the value; any descendant calls **`useContext(Context)`** to read the nearest Provider's `value`. If there's no Provider above, you get the default. In TypeScript you type the context with the shape you provide; a common idiom is to default to `null` and write a custom hook that throws if used outside a Provider, so the type is non-null for consumers. **Gotcha:** every consumer re-renders when the Provider's `value` changes — and an inline object `value={{ ... }}` is a new reference every render, so wrap it in `useMemo` if the Provider re-renders often. Context is for low-frequency global-ish data (theme, current user, locale), not a replacement for all state.

## Examples

### Create, provide, consume — with TS typing
```tsx
interface AuthCtx { user: User | null; logout: () => void; }
const AuthContext = createContext<AuthCtx | null>(null); // null = "no provider yet"

// Custom hook: narrows the type and guards against missing Provider
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx; // typed as AuthCtx (non-null) here
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const value = useMemo(() => ({ user, logout: () => setUser(null) }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Deep descendant — no prop drilling:
function Header() { const { user } = useAuth(); return <span>{user?.name}</span>; }
```

## Related Topics
- [[components-and-props|Components & Props]]
- [[usestate|useState]]
- [[custom-hooks|Custom Hooks]]
- [[usememo-usecallback|useMemo & useCallback]]

## Cards

```anki
START
Basic
Name the three pieces of the Context API and what each does.
Back: `createContext(default)` creates the context; `<Ctx.Provider value={...}>` supplies a value to its subtree; `useContext(Ctx)` reads the nearest Provider's value from a descendant.
<!--ID: 1782407009824-->
END

START
Basic
What does `useContext` return if there is no matching Provider above the component?
Back: The `defaultValue` passed to `createContext`. That's why a common pattern defaults to `null` and throws in a wrapper hook to catch missing Providers.
<!--ID: 1782407009827-->
END

START
Basic
Why does typing context as `createContext<T | null>(null)` plus a guarding custom hook improve the developer experience?
Back: It forces a Provider to exist (the hook throws otherwise) and narrows the type to non-null `T` for consumers, so they don't have to null-check everywhere.
<!--ID: 1782407009830-->
END

START
Basic
You pass `value={{ user, logout }}` inline to a Provider and notice every consumer re-renders constantly. Why, and the fix?
Back: The object literal is a new reference each render, so context value "changes" every time. Wrap it: `value={useMemo(() => ({ user, logout }), [user])}`.
<!--ID: 1782407009834-->
END

START
Basic
What kind of data is Context well-suited for, and what is it NOT a substitute for?
Back: Good for low-frequency, widely-needed data: theme, current user, locale. It is not a general state manager or a replacement for local component state.
<!--ID: 1782407009836-->
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
