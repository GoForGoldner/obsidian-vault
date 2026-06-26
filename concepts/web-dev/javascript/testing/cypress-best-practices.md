---
tags: [cypress, testing, best-practices, web-dev]
category: web-dev
related: [cypress-overview-command-queue, cypress-selectors, cypress-actions, cypress-assertions, cypress-network-intercept, dom-events]
---

## Description
The handful of habits that keep Cypress suites fast and non-flaky. **Select with `data-*` hooks**, not CSS classes or visible text, so tests survive restyling and copy changes. **Never `cy.wait(ms)`** to "let things settle" — rely on built-in retry-ability and `cy.wait('@alias')` instead. **Don't assign command return values to variables** — `cy.*` yields nothing usable synchronously; use `.then()` or aliases (`.as()`). **Keep tests independent**: each `it` should set up its own state and not depend on a previous test running first. Use `beforeEach` to reset and re-establish a clean starting point (visit, log in, seed stubs) before every test. These map directly to the asynchronous-queue model — most flakiness comes from fighting it.

## Examples

### Select by data-* not class/text
```js
// AVOID — breaks on restyle or wording change
cy.get('.btn.btn-lg.primary').click();
cy.contains('Submit Order').click();

// PREFER
cy.get('[data-cy="submit-order"]').click();
```

### Don't assign return values; use alias or .then
```js
// WRONG — `button` is a chainer, not an element
// const button = cy.get('[data-cy="save"]');

// RIGHT — alias it, reuse by name
cy.get('[data-cy="save"]').as('saveBtn');
cy.get('@saveBtn').click();
```

### beforeEach for independent tests
```js
describe('dashboard', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/me', { fixture: 'me.json' }).as('me');
    cy.visit('/dashboard');   // fresh starting state for EVERY test
    cy.wait('@me');
  });

  it('shows the user name', () => {
    cy.get('[data-cy="name"]').should('have.text', 'Ada');
  });

  it('opens settings', () => {           // does not depend on the test above
    cy.get('[data-cy="settings"]').click();
    cy.url().should('include', '/settings');
  });
});
```

## Related Topics
- [[cypress-overview-command-queue|Cypress Command Queue]]
- [[cypress-selectors|Cypress Selectors]]
- [[cypress-actions|Cypress Actions]]
- [[cypress-assertions|Cypress Assertions]]
- [[cypress-network-intercept|Cypress Network & Intercept]]
- [[dom-events|DOM Events]]

## Cards

```anki
START
Basic
What's the recommended way to select elements in Cypress, and why not CSS classes or text?
Back: Use dedicated `data-cy`/`data-testid` attributes. Classes change with restyling and visible text changes with wording/i18n — both silently break class- or text-based selectors. data-* hooks are decoupled from both.
<!--ID: 1782407009973-->
END

START
Basic
A teammate adds `cy.wait(3000)` to fix a flaky test. What's the better fix and why?
Back: Rely on built-in retry-ability and `cy.wait('@alias')` for network. Fixed ms waits are slow (always pay the delay) and still flaky (too short under load). Wait on the actual condition/request, not the clock.
<!--ID: 1782407009976-->
END

START
Basic
Why can't you write `const btn = cy.get('[data-cy="save"]')` and click `btn` later? What do you do instead?
Back: `cy.get` yields a chainer, not an element — there's nothing usable in the variable synchronously. Instead alias it: `.as('saveBtn')` then `cy.get('@saveBtn')`, or operate inside `.then()`.
<!--ID: 1782407009979-->
END

START
Basic
What does "keep tests independent" mean and why does it matter in Cypress?
Back: Each `it` must set up its own state and not rely on a prior test having run. Otherwise tests can't run in isolation/parallel/reordered, and one failure cascades into false failures downstream.
<!--ID: 1782407009982-->
END

START
Basic
What belongs in a `beforeEach` block for a Cypress suite?
Back: Per-test reset and clean setup: registering intercepts/stubs, `cy.visit` the page, logging in/seeding state — so every `it` starts from an identical, known baseline.
<!--ID: 1782407009986-->
END

START
Basic
Most Cypress flakiness traces back to fighting which underlying model?
Back: The asynchronous command-queue / retry-ability model. Manual sleeps, storing return values, and selector brittleness all stem from treating commands as synchronous/promise-like instead of trusting the queue's auto-waiting.
<!--ID: 1782407009989-->
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
