---
tags: [software-engineering, comparison]
category: vs
related: []
---

## Description
A library is code you call. you control the flow. A framework is code that calls you. it controls the flow (Inversion of Control). You plug your code into a framework's structure; you pull a library into your own structure.
## Examples
```java
// Library - YOU call it
List<String> sorted = Collections.sort(myList); // you control the flow

// Framework - IT calls you (Inversion of Control)
@RestController                            // Spring framework calls your method
public class UserController {
    @GetMapping("/users")                  // you fill in the blanks
    public List<User> getUsers() { ... }
}
```

## Related Topics
- [[dependency-injection-pattern|Inversion of Control]]
- [[dependency-injection-pattern|Dependency Injection]]
- NuGet/npm
- [[framework-vs-library|MVC]]

## Cards

```anki
START
Basic
What's the difference between a framework and a library?
Back: Inversion of Control. A library is code YOU call. A framework calls YOUR code - you plug into its structure. React = library (you call it). Next.js = framework (it calls you).
<!--ID: 1773439958875-->
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
