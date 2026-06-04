---
tags: [web-dev, api]
category: web-dev
related: [rest-vs-graphql, http-requests]
---

## Description
A high-performance RPC framework that uses HTTP/2 and Protocol Buffers for serialization. Instead of REST's JSON over HTTP/1.1, gRPC uses binary encoding for smaller payloads and supports streaming. The client calls server methods as if they were local functions.

## Benefits
- Much faster than REST (binary encoding, HTTP/2 multiplexing)
- Strongly typed contracts via .proto files
- Supports streaming (server, client, and bidirectional)

## Downsides
- Not browser-friendly (needs a proxy like grpc-web)
- Harder to debug (binary payloads, not human-readable)
- More setup than REST (proto files, code generation)


## Examples
```protobuf
// Define service in .proto file
service InventoryService {
  rpc CheckStock (StockRequest) returns (StockResponse);
}

message StockRequest { int32 item_id = 1; }
message StockResponse { int32 quantity = 1; }
```

```java
// Client calls it like a local method
StockResponse resp = inventoryStub.checkStock(
    StockRequest.newBuilder().setItemId(42).build()
);
// Binary protobuf over HTTP/2 - faster than JSON over HTTP/1.1
```

## Related Topics
- [[rest-vs-graphql|REST vs GraphQL]]
- [[gRPC|HTTP/2]]
- [[gRPC|Protocol Buffers]]
- [[microservices-vs-monolith|Microservices]]
- [[gRPC|Streaming]]

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
