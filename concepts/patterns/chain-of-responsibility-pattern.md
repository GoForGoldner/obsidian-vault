---
tags: [design-pattern, behavioral]
category: patterns
related: [decorator-pattern, command-pattern, mediator-pattern]
---

## Description
A pattern that passes requests down a chain of handlers until one handles it. Each handler decides whether to process the request or pass it to the next handler.

## Benefits
- Loose coupling between sender and receiver
- Easy to add/remove/reorder handlers dynamically
- Handlers can modify the request as it passes through

## Downsides
- Request might go through the entire chain unhandled
- Harder to debug which handler processed what


## Examples
```java
abstract class Handler {
    private Handler next;
    Handler setNext(Handler h) { next = h; return h; }

    void handle(Request req) {
        if (next != null) next.handle(req);
    }
}

class AuthHandler extends Handler {
    void handle(Request req) {
        if (!req.isAuthenticated()) throw new UnauthorizedException();
        super.handle(req);  // pass to next handler
    }
}

class LoggingHandler extends Handler {
    void handle(Request req) {
        System.out.println("Request: " + req);
        super.handle(req);  // pass to next handler
    }
}

// Build the chain
Handler chain = new LoggingHandler();
chain.setNext(new AuthHandler()).setNext(new RateLimitHandler());
chain.handle(request);
```

## Related Topics
- [[decorator-pattern|Decorator Pattern]]
- [[chain-of-responsibility-pattern|Middleware]]
- [[command-pattern|Command Pattern]]
- [[mediator-pattern|Mediator Pattern]]

## Cards
```anki
START
Basic
You see: a request needs to pass through multiple handlers in sequence. What pattern?
Back: Chain of Responsibility - link handlers in a chain, each can process or forward the request. Real-world example: HTTP middleware pipelines (logging -> auth -> CORS -> handler).
<!--ID: 1773439958589-->
END
```

```dataviewjs
const cards = [
  {
    front: "You see: object has many optional parameters and the constructor is getting out of control. What pattern?",
    back: "Builder - construct step by step with a fluent interface. Each setter returns the builder for chaining, call .build() at the end. Beats telescoping constructors."
  }
];

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const wrap = document.createElement('div');
wrap.className = 'anki-cards-container';
cards.forEach(({front, back}) => {
  wrap.innerHTML += '<div class="anki-card">'
    + '<div class="anki-card-front">'
    + '<span class="anki-label anki-label-q">QUESTION</span>'
    + '<div class="anki-front-text">' + esc(front) + '</div>'
    + '</div>'
    + '<div class="anki-card-back">'
    + '<span class="anki-label anki-label-a">* ANSWER</span>'
    + '<div class="anki-back-text">' + esc(back) + '</div>'
    + '</div>'
    + '</div>';
});
this.container.appendChild(wrap);
```
