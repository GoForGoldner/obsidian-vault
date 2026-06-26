---
tags: [moc, web-dev, javascript, typescript, react, map-of-content]
category: web-dev
related: [typescript-overview, react-overview, document-and-selectors]
---

## Description
Map of content for becoming fluent in **JavaScript + TypeScript** and the web ecosystem (the DOM, React, Cypress, jQuery). Built for someone fluent in Java/CS fundamentals — every note focuses on JS/TS-specific syntax, semantics, gotchas, and idioms, with Java contrasts where they sharpen understanding. Work top to bottom: the JS core makes the DOM make sense, the DOM makes jQuery/Cypress make sense, and JS+TS together make React make sense.

## Suggested learning path
1. **JavaScript core** — the language itself. Don't skip; everything else assumes it.
2. **The DOM** — how JS talks to the page (`document`, events).
3. **TypeScript** — the type layer you read at work daily.
4. **React** — the framework (needs JS + TS + DOM first).
5. **Cypress / jQuery** — tooling & legacy you'll encounter (read as needed).

---

## 1. JavaScript core
The language: types, functions, objects, async.

- [[variables-scope-hoisting|Variables, Scope & Hoisting]] — `let`/`const`/`var`, TDZ
- [[types-and-coercion|Types & Coercion]] — primitives, `typeof`, truthy/falsy
- [[equality-and-nullish|Equality & Nullish]] — `===`, `null` vs `undefined`, `?.`, `??`
- [[functions-and-arrows|Functions & Arrows]] — declarations, arrows, rest/default params
- [[this-call-apply-bind|`this`, call/apply/bind]] — the #1 Java-dev gotcha
- [[closures|Closures]]
- [[objects-and-prototypes|Objects & Prototypes]] — the prototype chain, `class` sugar
- [[arrays-higher-order|Array Higher-Order Methods]] — `map`/`filter`/`reduce`
- [[destructuring-spread-rest|Destructuring, Spread & Rest]]
- [[template-literals|Template Literals]]
- [[async-promises|Async & Promises]] — the event loop
- [[async-await|async / await]]
- [[modules-import-export|Modules: import / export]]
- [[json-and-fetch|JSON & fetch]]
- [[error-handling|Error Handling]]

## 2. The DOM (`document`)
Vanilla browser JS — manipulating the page.

- [[document-and-selectors|`document` & Selectors]] — `querySelector`, NodeList vs array
- [[dom-manipulation|DOM Manipulation]] — `textContent` vs `innerHTML`, `classList`
- [[dom-events|DOM Events]] — `addEventListener`, bubbling, delegation
- [[dom-traversal|DOM Traversal]] — `closest`, siblings, children
- [[dom-forms-inputs|Forms & Inputs]] — `.value`, `.checked`, submit, `FormData`

## 3. TypeScript
The type system layered over JS.

- [[typescript-overview|TypeScript Overview]] — structural vs Java's nominal typing
- [[basic-types-annotations|Basic Types & Annotations]] — `any` vs `unknown`, `never`
- [[interfaces-vs-type-aliases|Interfaces vs Type Aliases]]
- [[union-intersection-narrowing|Unions, Intersections & Narrowing]] — discriminated unions
- [[generics-typescript|Generics]]
- [[utility-types|Utility Types]] — `Partial`, `Pick`, `Omit`, `Record`, `keyof`
- [[enums-literals-as-const|Enums, Literals & `as const`]]
- [[functions-typing|Typing Functions]] — overloads, call signatures
- [[type-assertions-and-satisfies|Assertions & `satisfies`]] — `as`, `!`
- [[typing-the-dom|Typing the DOM]] — `querySelector<T>`, event types

## 4. React
Modern React 19 — function components + hooks, with TS.

- [[react-overview|React Overview]] — the component model
- [[jsx|JSX]]
- [[components-and-props|Components & Props]] — typing props
- [[conditional-rendering-and-lists|Conditional Rendering & Lists]] — the `key` prop
- [[usestate|useState]]
- [[useeffect|useEffect]] — the dependency array
- [[useref|useRef]]
- [[usememo-usecallback|useMemo & useCallback]]
- [[usecontext|useContext]]
- [[custom-hooks|Custom Hooks]]
- [[react-events-and-forms|Events & Forms]] — controlled inputs
- [[rules-of-hooks|Rules of Hooks]]

## 5. Cypress (e2e testing)
- [[cypress-overview-command-queue|Overview & Command Queue]] — why you don't `await`
- [[cypress-selectors|Selectors]] — `cy.get`, `data-cy`
- [[cypress-actions|Actions]] — `click`, `type`, `select`
- [[cypress-assertions|Assertions]] — retrying `.should`
- [[cypress-network-intercept|Network Intercept]] — `cy.intercept`, aliases
- [[cypress-best-practices|Best Practices]]

## 6. jQuery (legacy / common at work)
- [[jquery-overview-and-selectors|Overview & Selectors]] — `$()` returns a collection
- [[jquery-dom-manipulation|DOM Manipulation]] — `.text`/`.html`/`.val`, `.attr` vs `.prop`
- [[jquery-events|Events]] — `.on`, delegation
- [[jquery-traversal|Traversal]] — `.find`, `.closest`, `.each`
- [[jquery-ajax|AJAX]] — `$.ajax`, `$.get`/`$.post`

## Cards

```anki
START
Basic
You're learning React but the docs assume you already know JS/TS. Which two foundations should you be solid on first, and why?
Back: JavaScript core (closures, `this`, async, array methods) and TypeScript (props are typed). React is just JS+TS applied to UI — gaps in the base show up as React confusion.
END

START
Basic
What's the relationship between the DOM, jQuery, and Cypress that makes learning them in that order pay off?
Back: jQuery and Cypress are both thin layers that select and act on DOM elements. Once `querySelector`/events/traversal click, `$('.x')` and `cy.get('.x')` are just different syntax over the same model.
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
