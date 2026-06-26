---
tags: [cypress, testing, assertions, web-dev]
category: web-dev
related: [cypress-overview-command-queue, cypress-selectors, cypress-actions, cypress-network-intercept, cypress-best-practices, dom-events]
---

## Description
Cypress assertions are built on Chai. The idiomatic form is the **implicit** assertion `.should('matcher', ...)` chained off a subject — crucially, `.should` **retries the whole preceding query** until the assertion passes or times out, which is how Cypress flushes out timing/race issues without manual waits. Chain more conditions with `.and(...)`. The **explicit** form `expect(value).to.equal(...)` (BDD/Chai) runs once, synchronously, with no retry — use it inside `.then()` callbacks on values you already have. For multi-step or computed checks, pass a callback `.should(($el) => {...})`; Cypress retries the entire callback until every `expect` inside it passes. Java contrast: there is no JUnit-style single-shot `assertEquals` at the top level — top-level assertions retry.

## Examples

### Implicit assertions: should / and (these retry)
```js
cy.get('[data-cy="title"]').should('have.text', 'Welcome');
cy.get('[data-cy="modal"]').should('be.visible');
cy.get('[data-cy="email"]')
  .should('have.attr', 'type', 'email')
  .and('be.enabled');             // .and = another should on the same subject
cy.get('[data-cy="rows"]').should('have.length', 3);
```

### Explicit Chai expect (single-shot, inside .then)
```js
cy.get('[data-cy="price"]').then(($el) => {
  const n = parseFloat($el.text().replace('$', ''));
  expect(n).to.be.greaterThan(0); // runs once; no retry
});
```

### Callback form: complex assertions that retry as a unit
```js
cy.get('[data-cy="item"]').should(($items) => {
  // entire callback retries until all expects pass or timeout
  expect($items).to.have.length(3);
  expect($items.first()).to.contain('Apple');
  expect($items.last()).to.have.class('selected');
});
```

## Related Topics
- [[cypress-overview-command-queue|Cypress Command Queue]]
- [[cypress-selectors|Cypress Selectors]]
- [[cypress-actions|Cypress Actions]]
- [[cypress-network-intercept|Cypress Network & Intercept]]
- [[cypress-best-practices|Cypress Best Practices]]
- [[dom-events|DOM Events]]

## Cards

```anki
START
Basic
What makes `.should('be.visible')` resilient to timing issues that a single-shot assertion would fail on?
Back: `.should` retries the entire preceding query + assertion until it passes or the command times out. So if the element appears slightly late, the assertion still passes once it does.
<!--ID: 1782407009954-->
END

START
Basic
What's the difference between `.should(...)` and Chai's `expect(...)` in Cypress regarding retries?
Back: `.should` (implicit) retries until pass/timeout. `expect` (explicit, BDD/Chai) runs once synchronously with no retry — use it inside `.then()` on values you already hold.
<!--ID: 1782407009957-->
END

START
Basic
Write a Cypress assertion that an element has text "Welcome" AND is enabled, in one chain.
Back: cy.get('[data-cy="x"]').should('have.text', 'Welcome').and('be.enabled');
<!--ID: 1782407009960-->
END

START
Basic
What does `.and()` do, and what is it equivalent to?
Back: `.and()` adds another assertion against the same current subject. `.and('be.visible')` is equivalent to chaining a second `.should('be.visible')`.
<!--ID: 1782407009964-->
END

START
Basic
You need to assert several computed things about a set of elements together, with retry. Which form do you use?
Back: The callback form: `.should(($els) => { expect(...); expect(...); })`. Cypress retries the whole callback until every `expect` inside passes or it times out.
<!--ID: 1782407009967-->
END

START
Basic
A Java dev expects a top-level `assertEquals` that runs once. How does Cypress's top-level assertion differ?
Back: Top-level Cypress assertions (`.should`) retry the preceding query until they pass or time out, rather than evaluating exactly once. Single-shot behavior only happens with `expect` inside a `.then` callback.
<!--ID: 1782407009970-->
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
