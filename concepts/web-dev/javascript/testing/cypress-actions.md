---
tags: [cypress, testing, e2e, web-dev]
category: web-dev
related: [cypress-overview-command-queue, cypress-selectors, cypress-assertions, cypress-best-practices, dom-events]
---

## Description
Action commands simulate user interaction on the yielded element: `.click()`, `.type()`, `.clear()`, `.check()`/`.uncheck()`, `.select()`, and the lower-level `.trigger()`. Before acting, Cypress checks **actionability** — the element must be visible, not disabled, not covered, and scrolled into view — and **auto-waits/retries** until it becomes actionable or times out. `cy.visit(url)` loads a page (typically in `beforeEach`). In `.type()`, curly-brace tokens like `{enter}`, `{backspace}`, and `{selectall}` send special keys rather than literal text. This auto-waiting is the big contrast with Selenium-style frameworks where you manually wait for elements before interacting.

## Examples

### Typing, special characters, clearing
```js
cy.get('[data-cy="email"]')
  .type('user@example.com{enter}'); // {enter} submits — sends the Enter key

cy.get('[data-cy="search"]')
  .clear()                          // empty the field first
  .type('cypress{enter}');

cy.get('[data-cy="pin"]').type('1234{backspace}'); // ends as "123"
```

### Checkboxes, radios, selects
```js
cy.get('[data-cy="agree"]').check();          // check a checkbox/radio
cy.get('[data-cy="newsletter"]').uncheck();   // uncheck
cy.get('[data-cy="role"]').select('Admin');   // <select>: by visible text or value
cy.get('[data-cy="tags"]').select(['a', 'b']); // multi-select
```

### click variants, trigger, visit
```js
cy.visit('/login');                  // load the page
cy.get('[data-cy="submit"]').click();
cy.get('[data-cy="menu"]').click({ force: true }); // skip actionability checks (last resort)
cy.get('[data-cy="slider"]').trigger('mousedown', { which: 1 }); // raw DOM event
```

## Related Topics
- [[cypress-overview-command-queue|Cypress Command Queue]]
- [[cypress-selectors|Cypress Selectors]]
- [[cypress-assertions|Cypress Assertions]]
- [[cypress-best-practices|Cypress Best Practices]]
- [[dom-events|DOM Events]]

## Cards

```anki
START
Basic
Before Cypress performs `.click()` or `.type()`, what does it verify, and what does it do if those conditions aren't met yet?
Back: It checks "actionability" — the element is visible, not disabled, not covered by another element, and scrolled into view. If not yet actionable, it auto-waits/retries until it is or the command times out.
<!--ID: 1782407009930-->
END

START
Basic
In `cy.get('#i').type('hello{enter}')`, what does `{enter}` do?
Back: It sends the Enter key, not the literal text "{enter}". Curly-brace tokens in `.type()` are special-key sequences (e.g. `{enter}`, `{backspace}`, `{selectall}`, `{esc}`).
<!--ID: 1782407009933-->
END

START
Basic
How do you empty an input before typing a new value in Cypress?
Back: Chain `.clear()` before `.type()`, e.g. `cy.get('#q').clear().type('new')`. `.type()` does not replace existing content on its own.
<!--ID: 1782407009937-->
END

START
Basic
Which command sets the value of a `<select>` dropdown, and what arg do you pass?
Back: `.select(value)` — pass the option's visible text or its `value` attribute. Pass an array for multi-selects.
<!--ID: 1782407009942-->
END

START
Basic
What does `{ force: true }` do on a Cypress action, and why is it a last resort?
Back: It skips actionability checks (visibility, coverage, disabled), forcing the event to fire. It's a last resort because it can mask real bugs where a user couldn't actually interact with the element.
<!--ID: 1782407009946-->
END

START
Basic
When would you use `.trigger()` instead of `.click()` or `.type()`?
Back: When you need to dispatch a low-level DOM event that the high-level commands don't model directly — e.g. `mousedown`, `mouseover`, `mousemove` for drag/hover behavior.
<!--ID: 1782407009950-->
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
