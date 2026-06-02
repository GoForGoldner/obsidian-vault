---
tags:
category: design-patterns
related: []
---

## Summary
The Builder pattern separates the construction of a complex object from its representation. Instead of a constructor with many parameters, you chain method calls on a builder object and call a final `Build()` to get the result. Most useful when an object has many optional fields or requires a specific construction order.

## When NOT to use it
Don't use it for simple objects with only a few required fields — a regular constructor or object initializer is cleaner. It's overkill if you're never varying the construction steps.

## Common Mistakes
- Forgetting to return `this` from each builder method — breaks method chaining
- Making the builder stateful across multiple builds without resetting it — causes bleed between objects
- Using it when a plain constructor with named parameters does the job fine

## Related Topics
- Factory Pattern
- Fluent Interface
- Method Chaining
- Object Initializers (C#)
- Director Pattern

## See Also

```anki
START
Basic
You see: object with many optional fields, messy constructor with 6+ parameters. What pattern?
Back: Builder. Chain setter methods on a builder object, call Build() at the end.
END
START
Basic
What must each method in a builder return and why?
Back: Return this (the builder itself). Without it you can't chain calls.
END
START
Basic
What is the difference between Builder and Factory pattern?
Back: Factory creates objects in one step and hides which type. Builder constructs one object incrementally across multiple steps.
END
START
Basic
Write the minimal C# Builder skeleton from memory.
Back:
public class QueryBuilder {
    private string _table;
    private string _where;

    public QueryBuilder From(string table) {
        _table = table;
        return this;
    }
    public QueryBuilder Where(string condition) {
        _where = condition;
        return this;
    }
    public string Build() {
        return $"SELECT * FROM {_table} WHERE {_where}";
    }
}
END
START
Basic
When does a Builder need a Director class?
Back: When the construction sequence needs to vary or be reused. Director encodes the steps, Builder encodes how each step executes.
<!--ID: 1773093630583-->
END
```

```dataviewjs
function renderCards() {
  const rendered = this.container.closest('.markdown-rendered');
  if (!rendered) return;
  const block = rendered.querySelector('code.language-anki');
  if (!block) return;
  const raw = block.innerText;
  const cards = [...raw.matchAll(/START\nBasic\n([\s\S]*?)(?=\nEND)/g)];
  if (!cards.length) return;
  const wrap = dv.el('div', '', {cls: 'anki-cards-container'});
  block.closest('pre').replaceWith(wrap);
  cards.forEach(m => {
    const content = m[1];
    const bi = content.indexOf('\nBack:');
    if (bi === -1) return;
    const front = content.slice(0, bi).trim();
    const back = content.slice(bi + 6).replace(/\n<!--ID:.*?-->/g, '').trim();
    wrap.innerHTML += '<div class="anki-card">'
      + '<div class="anki-card-front">'
      + '<span class="anki-label anki-label-q">QUESTION</span>'
      + '<div class="anki-front-text">' + front + '</div>'
      + '</div>'
      + '<div class="anki-card-back">'
      + '<span class="anki-label anki-label-a">✦ ANSWER</span>'
      + '<div class="anki-back-text">' + back + '</div>'
      + '</div>'
      + '</div>';
  });
}

renderCards.call(this);
setTimeout(() => renderCards.call(this), 100);
setTimeout(() => renderCards.call(this), 500);
```