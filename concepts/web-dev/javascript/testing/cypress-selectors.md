---
tags: [cypress, testing, selectors, web-dev]
category: web-dev
related: [cypress-overview-command-queue, cypress-actions, cypress-assertions, cypress-best-practices, document-and-selectors, dom-events]
---

## Description
Selector commands locate elements in the DOM and yield them (as jQuery-wrapped objects) to the next command. `cy.get(selector)` takes a **CSS selector** and retries until it matches; `cy.contains(text)` finds by visible text. Once you have a subject, `.find()` searches its descendants, `.within()` scopes following commands inside it, and `.first()`/`.eq(n)`/`.last()` narrow a multi-element result. Unlike raw `document.querySelector` (which runs once, synchronously, and returns `null` if absent), `cy.get` keeps retrying and fails the test on timeout. The strong best practice is to select by a dedicated `[data-cy=...]` or `[data-testid=...]` attribute so tests don't break when CSS classes or text change.

## Examples

### cy.get with CSS selectors and the data-cy convention
```js
cy.get('.btn-primary')          // CSS class — brittle if styling changes
cy.get('#login')                // CSS id
cy.get('[data-cy="submit"]')    // BEST: stable test-only hook
```

### contains, find, within
```js
cy.contains('Log out').click();           // find by visible text
cy.get('[data-cy="card"]').find('.title') // search descendants of the card
  .should('have.text', 'Hello');

cy.get('[data-cy="form"]').within(() => {  // scope: cy.get below only looks inside the form
  cy.get('input[name="email"]').type('a@b.com');
  cy.get('button').click();
});
```

### first / eq / filtering a list
```js
cy.get('[data-cy="row"]').first().click();  // first matching element
cy.get('[data-cy="row"]').eq(2).click();    // zero-indexed: the 3rd row
cy.get('li').contains('Settings').click();  // contains scoped to the li set
```

## Related Topics
- [[cypress-overview-command-queue|Cypress Command Queue]]
- [[cypress-actions|Cypress Actions]]
- [[cypress-assertions|Cypress Assertions]]
- [[cypress-best-practices|Cypress Best Practices]]
- [[document-and-selectors|document.querySelector & DOM Selectors]]
- [[dom-events|DOM Events]]

## Cards

```anki
START
Basic
What kind of selector does `cy.get()` accept, and how does its behavior differ from `document.querySelector`?
Back: It accepts a CSS selector. Unlike `querySelector` (runs once, returns null if not found), `cy.get` retries until the element appears or the command times out, then fails the test.
<!--ID: 1782407010029-->
END

START
Basic
You need to select an element by its visible text rather than a CSS selector. Which command?
Back: `cy.contains('text')` — yields the first element containing that text. Can be chained off a subject to scope the search, e.g. `cy.get('li').contains('Settings')`.
<!--ID: 1782407010032-->
END

START
Basic
What's the difference between `.find()` and `cy.get()` when chained off an existing element?
Back: `.find(sel)` searches only within the descendants of the current subject. `cy.get(sel)` starts a fresh query against the whole document, ignoring the previous subject.
<!--ID: 1782407010035-->
END

START
Basic
What does `.within(() => {...})` do and when do you use it?
Back: It scopes all `cy.get`/`cy.contains` calls inside the callback to descendants of the current subject. Use it to disambiguate selectors inside a specific form, card, or row.
<!--ID: 1782407010039-->
END

START
Basic
Why prefer `[data-cy="submit"]` over `cy.get('.btn-primary')` or `cy.contains('Submit')`?
Back: data-cy/data-testid attributes are dedicated test hooks decoupled from styling and copy. CSS classes change with redesigns and visible text changes with i18n/wording, both of which silently break selector-by-class/text tests.
<!--ID: 1782407010042-->
END

START
Basic
Given many matching elements, how do you pick the first one vs the element at index 2?
Back: `.first()` for the first match; `.eq(2)` for the zero-indexed third element. (`.last()` for the final one.)
<!--ID: 1782407010045-->
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
