---
tags: [css, web-dev, layout]
category: web-dev
related: [box-model, css-units, responsive-design]
---

## Description
Replaced elements like `<img>` and `<video>` have intrinsic dimensions, so they need special handling. **`object-fit`** controls how the media fills its box without distortion: `cover` (fill + crop), `contain` (fit + letterbox), `fill` (stretch, default). **`object-position`** sets which part stays visible when cropped. **`aspect-ratio`** reserves a fixed width:height ratio (e.g. `16 / 9`) — preventing layout shift. The responsive image baseline is `max-width: 100%; height: auto;`.

## Examples
```css
/* Make every image scale down but never overflow its container */
img { max-width: 100%; height: auto; display: block; }

/* Fill a fixed box, crop the excess, keep aspect ratio */
.avatar { width: 80px; height: 80px; object-fit: cover; border-radius: 50%; }

/* Lock a 16:9 box regardless of width — no layout shift */
.video { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }

/* Keep the top of the image in view when cropping */
.hero img { object-fit: cover; object-position: top; }
```

## Related Topics
- [[box-model|Box Model]]
- [[css-units|Units]]
- [[responsive-design|Responsive Design]]
- object-fit / object-position
- aspect-ratio / cumulative layout shift

## Cards

```anki
START
Basic
Write the CSS to make a square avatar that fills an 80×80 circle, cropping (not squishing) the image.
Back: `width: 80px; height: 80px; object-fit: cover; border-radius: 50%;` — `cover` fills and crops while preserving aspect ratio.
<!--ID: 1780758285648-->
END

START
Basic
What's the difference between `object-fit: cover` and `object-fit: contain`?
Back: `cover` scales the media to fill the box, cropping whatever overflows (no empty space). `contain` scales it to fit entirely inside the box, possibly leaving empty bars (letterboxing). Neither distorts; the default `fill` stretches and *does* distort.
<!--ID: 1780758285652-->
END

START
Basic
Write the CSS to reserve a 16:9 responsive box for a video so the page doesn't jump while it loads.
Back: `width: 100%; aspect-ratio: 16 / 9;` — the height is derived from the width, reserving space and preventing layout shift.
<!--ID: 1780758285657-->
END

START
Basic
What's the classic one-liner that makes images responsive (never overflow, keep proportions)?
Back: `img { max-width: 100%; height: auto; }` — caps width to the container and lets height scale proportionally.
<!--ID: 1780758285662-->
END

START
Basic
When an image is cropped by `object-fit: cover`, which property decides *which* part stays visible?
Back: `object-position` (e.g. `object-position: top;` keeps the top edge in frame). Default is `center`.
<!--ID: 1780758285666-->
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
