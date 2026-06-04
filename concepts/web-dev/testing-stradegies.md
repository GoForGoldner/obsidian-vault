---
tags: [web-dev, testing]
category: web-dev
related: [mock-vs-stub, ci-cd]
---

## Description
Different levels of testing that catch different kinds of bugs. Unit tests verify individual functions in isolation. Integration tests verify that components work together. End-to-end (E2E) tests verify the entire system from the user's perspective. The testing pyramid says: many unit tests, fewer integration tests, fewest E2E tests.
## Examples
```java
// Unit test - single function, isolated, fast
@Test
void calculateTotal_returnsSum() {
    assertEquals(30, calculator.total(List.of(10, 20)));
}

// Integration test - components working together
@Test
void createOrder_savesToDatabase() {
    orderService.create(order);
    assertNotNull(orderRepo.findById(order.getId()));
}

// E2E test - full system from user perspective (Selenium/Playwright)
// Click "Add to Cart" → Click "Checkout" → Verify confirmation page
```

## Related Topics
- [[mock-vs-stub|Mock vs Stub]]
- [[ci-cd|CI/CD]]
- [[testing-stradegies|Test-Driven Development]]
- [[dependency-injection-pattern|Dependency Injection]]

## Cards

```anki
START
Basic
What's the difference between unit, integration, and E2E tests — and why is the testing pyramid shaped that way?
Back: Unit: single function, isolated, milliseconds. Integration: components together (DB, APIs). E2E: full system from user perspective, slow and brittle. Pyramid shape (many unit → few E2E) because lower tests are faster, cheaper, and pinpoint failures. E2E tests catch real bugs but are expensive to maintain.
<!--ID: 1773439959138-->
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
