---
tags: [aws, saa-c03, machine-learning, domain-3]
category: aws
related: [aws-analytics-ingestion, aws-security-services, aws-serverless-containers]
---
TARGET DECK: Study::AWS::ML Services

## Description
The SAA-C03 tests AI/ML services purely as **recognition**: a scenario describes a capability and you name the service. You never need to build a model, tune it, or know any algorithm. This is the lowest-effort, highest-certainty block on the exam — pure vocabulary, and worth doing last.

The single discriminator is **what kind of input, producing what kind of output**:

| Service | Input → Output |
|---|---|
| **Comprehend** | Text → **meaning**: sentiment, entities, key phrases, language, PII |
| **Textract** | Scanned document/PDF → **text, forms, and tables** (structure preserved) |
| **Rekognition** | Image/video → **objects, faces, celebrities, moderation, text in images** |
| **Transcribe** | **Speech → text** (audio in, transcript out) |
| **Polly** | **Text → speech** (the reverse of Transcribe) |
| **Translate** | Text in one language → **another language** |
| **Lex** | Text/voice → **conversational chatbot** (the engine behind Alexa) |
| **Kendra** | Documents → **intelligent enterprise search** with natural-language questions |
| **Forecast** | Historical time-series → **future predictions** (demand, inventory) |
| **Fraud Detector** | Transaction/signup data → **fraud likelihood** |
| **SageMaker** | Your own data → **build, train, and deploy custom models** |

The pairs the exam builds distractors from:
- **Transcribe vs Polly** — opposite directions. Speech→text is Transcribe; text→speech is Polly.
- **Textract vs Rekognition** — both read images, but Textract extracts **document structure** (forms, tables, key-value pairs) while Rekognition identifies **objects and faces**. "Scanned invoices/forms" → Textract.
- **Comprehend vs Kendra** — Comprehend analyzes what text *means*; Kendra *finds* the right document from a question.
- **Anything custom** → SageMaker. If the question says "build and train their own model," every managed service is wrong.

A common combined pipeline: **Transcribe → Comprehend** (transcribe support calls, then analyze sentiment), or **Textract → Comprehend** (digitize forms, then extract entities and redact PII).

## Examples
```
Scenario → service:

"Analyze customer reviews for sentiment"              → Comprehend
"Digitize scanned invoices, preserving tables"        → Textract
"Detect inappropriate images uploaded by users"       → Rekognition (content moderation)
"Identify faces in a security camera feed"            → Rekognition
"Generate an audio version of every article"          → Polly
"Produce searchable transcripts of support calls"     → Transcribe
"Localize the site into 12 languages"                 → Translate
"Natural-language chatbot for order status"           → Lex
"Employees ask questions across 10,000 internal docs" → Kendra
"Predict next quarter's inventory demand"             → Forecast
"Flag likely-fraudulent new account signups"          → Fraud Detector
"Data scientists train a bespoke model"               → SageMaker
```

```
Pipelines the exam likes:

  Support call (audio)
      → Transcribe   (speech to text)
      → Comprehend   (sentiment + entities)
      → dashboard

  Scanned form (PDF)
      → Textract     (text, forms, tables)
      → Comprehend   (detect and redact PII)
      → S3
```

## Related Topics
- Managed AI services vs custom models
- Natural language processing
- Computer vision
- Time-series forecasting

## Cards

```anki
START
Basic
AWS ML: Transcribe and Polly — which direction does each go?
Back: Transcribe is speech → text. Polly is text → speech. They're inverses, and the exam pairs them as distractors constantly.
Tags: cantrill::ml101
<!--ID: 1788209676765-->
END

START
Basic
AWS ML: A company scans paper invoices and needs the tables and form fields extracted, not just raw text. Which service?
Back: Amazon Textract — it preserves document structure (forms, tables, key-value pairs). Rekognition finds objects and faces, and would only give you loose text.
Tags: cantrill::ml101
<!--ID: 1788209676769-->
END

START
Basic
AWS ML: You need sentiment and named entities from thousands of product reviews. Which service?
Back: Amazon Comprehend — NLP for sentiment, entities, key phrases, language detection, and PII identification.
Tags: cantrill::ml101
<!--ID: 1788209676774-->
END

START
Basic
AWS ML: Employees need to ask natural-language questions across a large internal document repository. Comprehend or Kendra?
Back: Kendra — intelligent enterprise SEARCH, built to return the right document for a question. Comprehend analyzes what text means but doesn't retrieve documents.
Tags: cantrill::ml101
<!--ID: 1788209676779-->
END

START
Basic
AWS ML: The requirement says the team will build and train their own model on their own data. Which service, and why are the others wrong?
Back: SageMaker. Every other AI service is a pre-trained managed API — the moment a question says "custom model" or "train their own," they're all eliminated.
Tags: cantrill::ml101
<!--ID: 1788209676784-->
END

START
Basic
AWS ML: User-uploaded images must be screened for inappropriate content. Which service?
Back: Amazon Rekognition — content moderation is one of its built-in capabilities, alongside object, face, and celebrity detection.
Tags: cantrill::ml101
<!--ID: 1788209676788-->
END

START
Basic
AWS ML: Predict next quarter's product demand from three years of sales history. Which service?
Back: Amazon Forecast — purpose-built for time-series forecasting. SageMaker could do it but requires you to build the model yourself.
Tags: cantrill::ml101
<!--ID: 1788209676793-->
END

START
Basic
AWS ML: Describe the two-service pipeline for analyzing sentiment in recorded support calls.
Back: Transcribe converts the audio to text, then Comprehend extracts sentiment and entities from that text. Neither does the other's job.
Tags: cantrill::ml101
<!--ID: 1788209676798-->
END

START
Basic
AWS ML: Which service powers a conversational chatbot that understands intent from voice or text?
Back: Amazon Lex — the same engine behind Alexa, providing intents, slots, and speech recognition.
Tags: cantrill::ml101
<!--ID: 1788209676803-->
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
