---
tags: [cypress, testing, e2e, web-dev]
category: web-dev
related: [cypress-selectors, cypress-actions, cypress-assertions, cypress-network-intercept, cypress-best-practices, dom-events]
---

## Description
Cypress is an end-to-end browser testing tool (13+/14) where every `cy.*` call **enqueues a command** onto an internal queue rather than executing immediately. The test function body runs to completion synchronously, building the queue; Cypress then drains it asynchronously. This is the #1 gotcha: `cy.*` commands look like promises but are **not** — you cannot `await` them, and the return value is a chainer, not the resolved subject. To act on a yielded value (DOM element, response, alias) you pass a callback to `.then()`. Each query command (like `cy.get`) has **built-in retry-ability**: it re-runs until it finds the element or times out, so Cypress automatically waits and you rarely insert manual waits.

## Examples

### Commands are enqueued, not awaited
```js
// WRONG — there is nothing to await; this does NOT do what a Java dev expects.
// const el = await cy.get('.title'); // el is a chainer, not the element

// RIGHT — Cypress runs these in order, retrying each until it passes
cy.get('.title')        // enqueue: find element (retries until found)
  .click()              // enqueue: runs AFTER the get resolves
cy.url().should('include', '/dashboard') // enqueue: runs after the click
```

### You cannot use the return value directly — use .then()
```js
// WRONG: returns a chainer object, not the text
// const text = cy.get('h1'); console.log(text) // logs an internal object

// RIGHT: the yielded subject arrives in the callback
cy.get('h1').then(($h1) => {
  // $h1 is a jQuery-wrapped element, available NOW inside the callback
  const text = $h1.text();
  expect(text).to.contain('Welcome');
});
```

### Synchronous test body builds the queue first
```js
it('runs in queued order, not source order of side effects', () => {
  let stamp = 0;
  cy.get('button').click().then(() => { stamp = 1; }); // runs later
  // stamp is STILL 0 here — the .then callback hasn't fired yet
  expect(stamp).to.equal(0); // passes
});
```

## Related Topics
- [[cypress-selectors|Cypress Selectors]]
- [[cypress-actions|Cypress Actions]]
- [[cypress-assertions|Cypress Assertions]]
- [[cypress-network-intercept|Cypress Network & Intercept]]
- [[cypress-best-practices|Cypress Best Practices]]
- [[dom-events|DOM Events]]

## Cards

```anki
START
Basic
In Cypress, what does a `cy.*` call actually do when the line executes, and when does the work happen?
Back: It enqueues a command onto Cypress's internal command queue and returns a chainer. The actual work runs later, asynchronously, when Cypress drains the queue in order — not at the moment the line is reached.
<!--ID: 1782407010011-->
END

START
Basic
Why can't you `await cy.get('.foo')` or assign it to a variable to use the element?
Back: `cy.*` commands are not promises — they return a chainer, not a resolved value. `await` yields the chainer object, not the element. To use the yielded subject you must pass a callback to `.then(($el) => {...})`.
<!--ID: 1782407010014-->
END

START
Basic
You need the text of an `<h1>` to do a computation in a Cypress test. Write the correct pattern.
Back: cy.get('h1').then(($h1) => {\n  const text = $h1.text();\n  // use text here\n});
<!--ID: 1782407010017-->
END

START
Basic
What is "retry-ability" in Cypress and which kind of command has it?
Back: Query commands like `cy.get`/`cy.contains` automatically re-run until they succeed (find the element) or hit the timeout. This is why Cypress auto-waits and you rarely need manual waits.
<!--ID: 1782407010020-->
END

START
Basic
A Java dev writes `let x = 0; cy.get('btn').click().then(() => x = 1); expect(x).to.eq(1)`. Why does the assertion see x as 0?
Back: The test body runs synchronously to build the queue. The `.then` callback only fires later when the queue drains, so at the `expect` line x is still 0. The assignment hasn't happened yet.
<!--ID: 1782407010023-->
END

START
Basic
Does Cypress run the lines of a test in the order they appear? What's the nuance?
Back: The enqueued cy.* commands run in source order, but the synchronous JS around them (variables, plain expects, console.log) executes immediately while the queue is still being built — before any command resolves.
<!--ID: 1782407010026-->
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
