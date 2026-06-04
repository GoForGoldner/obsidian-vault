---
tags: [web-dev, devops]
category: web-dev
related: [testing-stradegies, docker]
---

## Description
CI (Continuous Integration) automatically builds and tests code every time someone pushes to the repo. CD (Continuous Delivery/Deployment) automatically deploys that code to production after tests pass.

## Benefits
- Catches broken code early (before it hits production)
- Fast and consistent releases
- Less manual work and fewer human errors in deployment

## Downsides
- Initial setup and maintenance cost
- Flaky tests slow down the entire pipeline
- Requires good test coverage to be useful


## Examples
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: mvn test                    # unit + integration tests
      - run: docker build -t myapp .     # build artifact
      - run: docker push myapp           # push to registry
      - run: kubectl apply -f deploy.yml # deploy to production
```

## Related Topics
- [[testing-stradegies|Testing Strategies]]
- [[docker|Docker]]
- [[ci-cd|GitHub Actions]]
- [[ci-cd|Infrastructure as Code]]

## Cards

```anki
START
Basic
Why does CI/CD matter and what breaks without it?
Back: CI catches broken code before it reaches production by auto-building and testing every push. CD auto-deploys after tests pass. Without CI: "works on my machine" bugs, integration hell at merge time, manual deploy errors. Flaky tests are the #1 CI killer — they erode trust and slow the pipeline.
<!--ID: 1773439959132-->
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
