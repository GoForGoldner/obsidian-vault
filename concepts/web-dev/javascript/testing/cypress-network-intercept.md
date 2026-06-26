---
tags: [cypress, testing, network, mocking, web-dev]
category: web-dev
related: [cypress-overview-command-queue, cypress-selectors, cypress-actions, cypress-assertions, cypress-best-practices, dom-events]
---

## Description
`cy.intercept(method, url, response?)` lets you **spy on** or **stub** HTTP requests the app makes. With a response argument you mock the server (deterministic tests, no backend); without one you only observe. Give the interception an **alias** with `.as('name')`, then `cy.wait('@name')` blocks the queue until that request fires and yields the matched request/response so you can assert on it. Mock bodies often come from `cy.fixture('file.json')` (loaded from `cypress/fixtures`). The key discipline: prefer `cy.wait('@alias')` over `cy.wait(5000)` — waiting on the alias resolves the instant the request completes (fast and reliable), whereas a fixed millisecond wait is both slow (always pays the full delay) and flaky (may be too short under load).

## Examples

### Stub a response with inline body or a fixture
```js
// inline stub
cy.intercept('GET', '/api/users', {
  statusCode: 200,
  body: [{ id: 1, name: 'Ada' }],
}).as('getUsers');

// stub from a fixture file: cypress/fixtures/users.json
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');

cy.visit('/users');
cy.wait('@getUsers');                 // wait for the request to happen
cy.get('[data-cy="row"]').should('have.length', 1);
```

### Spy only (no stub) and assert on the request/response
```js
cy.intercept('POST', '/api/login').as('login'); // observe real request
cy.get('[data-cy="submit"]').click();
cy.wait('@login').then((interception) => {
  expect(interception.request.body).to.have.property('email');
  expect(interception.response.statusCode).to.eq(200);
});
```

### Why alias-wait beats a fixed wait
```js
// BAD: always sleeps 5s; still flaky if the request is slower
cy.wait(5000);
cy.get('[data-cy="row"]').should('exist');

// GOOD: resolves the moment the request completes
cy.wait('@getUsers');
cy.get('[data-cy="row"]').should('exist');
```

## Related Topics
- [[cypress-overview-command-queue|Cypress Command Queue]]
- [[cypress-actions|Cypress Actions]]
- [[cypress-assertions|Cypress Assertions]]
- [[cypress-best-practices|Cypress Best Practices]]
- [[cypress-selectors|Cypress Selectors]]
- [[dom-events|DOM Events]]

## Cards

```anki
START
Basic
What's the difference between `cy.intercept('GET', '/api/x')` with no third arg vs with a response object?
Back: With no response arg it only spies (observes the real request). With a response object (or `{ fixture }`) it stubs — Cypress returns your mock and the request never hits the real server.
<!--ID: 1782407009992-->
END

START
Basic
How do you make a test block until a specific intercepted request has fired, and get its request/response?
Back: Alias the intercept with `.as('name')`, then `cy.wait('@name')`. It blocks the queue until the request completes and yields the interception object (`.request`, `.response`).
<!--ID: 1782407009995-->
END

START
Basic
Why is `cy.wait('@getUsers')` preferred over `cy.wait(2000)`?
Back: Alias-wait resolves the instant the request completes — fast and reliable. A fixed ms wait always pays the full delay (slow) and is flaky: too short under load, wastefully long otherwise.
<!--ID: 1782407009998-->
END

START
Basic
Where do fixture files live and how do you use one as a stubbed response body?
Back: In `cypress/fixtures/`. Use it via `cy.intercept('GET', url, { fixture: 'users.json' })`, or load it directly with `cy.fixture('users.json')`.
<!--ID: 1782407010001-->
END

START
Basic
After `cy.wait('@login')`, write the pattern to assert the response status was 200.
Back: cy.wait('@login').then((interception) => {\n  expect(interception.response.statusCode).to.eq(200);\n});
<!--ID: 1782407010004-->
END

START
Basic
Why does stubbing with `cy.intercept` make tests more deterministic?
Back: It removes the real backend from the loop — responses are fixed and controlled, so tests don't fail due to backend data changes, latency, or downtime, and you can simulate edge cases (errors, empty lists) on demand.
<!--ID: 1782407010007-->
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
