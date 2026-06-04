---
tags: [system-design, devops]
category: system-design
related: [ci-cd, microservices-vs-monolith]
---

## Description
A platform that packages your application and all its dependencies into a container, a lightweight isolated portable unit. Containers share the host OS kernel (unlike VMs which have their own OS), making them fast to start and resource-efficient.

## Benefits
- Portable: same container runs anywhere (dev, staging, prod)
- Lightweight: starts in seconds, shares host OS kernel
- Reproducible: dependencies are baked into the image
- Easy multi-service setup with Docker Compose

## Downsides
- Less isolation than VMs (shared kernel)
- Image sizes can get large if not optimized
- Networking and volumes have a learning curve


## Examples
```dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY target/myapp.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

```bash
docker build -t myapp .          # image = blueprint
docker run -p 8080:8080 myapp    # container = running instance of an image
docker-compose up                # spin up multiple containers (app + db + redis)
```

```
Container: shares host OS kernel, lightweight, starts in seconds
VM: runs its own full OS, heavier, more isolated, starts in minutes
```

## Related Topics
- [[ci-cd|CI/CD]]
- [[microservices-vs-monolith|Microservices]]
- [[docker|Kubernetes]]
- [[docker|Docker Compose]]
- [[docker|Virtual Machines]]

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
