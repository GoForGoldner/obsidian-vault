class AnkiCards {
  render() {
    // Find all anki code blocks
    document.querySelectorAll('code.language-anki').forEach(block => {
      if (block.dataset.ankiProcessed) return;
      block.dataset.ankiProcessed = 'true';

      const raw = block.innerText;
      const cardMatches = [...raw.matchAll(/START\nBasic\n([\s\S]*?)(?=\nEND)/g)];

      if (!cardMatches.length) return;

      const container = document.createElement('div');
      container.className = 'anki-cards-container';

      cardMatches.forEach(match => {
        const content = match[1];
        const backIndex = content.indexOf('\nBack:');
        if (backIndex === -1) return;

        const front = content.slice(0, backIndex).trim();
        const back = content.slice(backIndex + 6)
          .replace(/\n<!--ID:.*?-->/g, '')
          .trim();

        const card = document.createElement('div');
        card.className = 'anki-card';
        card.innerHTML = `
          <div class="anki-card-front">
            <span class="anki-label anki-label-q">QUESTION</span>
            <div class="anki-front-text">${front}</div>
          </div>
          <div class="anki-card-back">
            <span class="anki-label anki-label-a">✦ ANSWER</span>
            <div class="anki-back-text"><pre>${back}</pre></div>
          </div>
        `;
        container.appendChild(card);
      });

      block.parentElement.replaceWith(container);
    });
  }
}