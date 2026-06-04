---
tags: [testing, comparison]
category: vs
related: [repository-pattern, dependency-injection-pattern]
---

## Description
Stubs provide canned responses to calls. they fake the data. Mocks verify that specific interactions happened. they track calls. Stubs test state (was the result correct?). Mocks test behavior (did the code call the right method?).
## Examples
```java
// Stub - fake data, test the result (state verification)
UserRepository stub = () -> new User("John");
UserService service = new UserService(stub);
assertEquals("John", service.getUser(1).getName());

// Mock - verify interactions happened (behavior verification)
EmailService mock = Mockito.mock(EmailService.class);
orderService.placeOrder(order);
verify(mock, times(1)).sendConfirmation(order.getEmail());
```

## Related Topics
- [[testing-stradegies|Unit Testing]]
- [[dependency-injection-pattern|Dependency Injection]]
- [[repository-pattern|Repository Pattern]]
- [[mock-vs-stub|Test Doubles]]

## Cards
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
