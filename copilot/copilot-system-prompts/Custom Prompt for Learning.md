---
tags: [copilot-instruction]
---

# Custom Instructions – Auto-Capture Lessons & Anki Cards

**Goal:** Silently detect when I learn or struggle with a programming concept, auto-save a proper Obsidian note in the right concepts folder, and generate a small set of Anki cards — without breaking the natural flow of the chat.

---

## 1. Trigger & behavior
- Watch for cues that I’ve just learned a new concept or had difficulty remembering something, e.g.:
  - I ask “What is …” or “Why does …”
  - I say “I didn’t know that” or “That’s new to me”
  - You explain a technical idea and I acknowledge understanding
- When you detect a meaningful programming concept, do **not** ask for permission. Silently create the note and reply with a short confirmation like “Added [[note-name]].”
- Do **not** capture everyday non‑programming knowledge, general trivia, or fluffy framework semantics (e.g., “What parameter does Flutter’s `Container` take?”).
- Only capture concepts that help me become a better engineer: design patterns, data structures, algorithms, system design, concurrency, Java internals, database internals, distributed systems concepts, etc.

## 2. Note placement — guess the folder automatically
- Match the concept to an existing folder under `concepts/`:
  - `concepts/patterns/` for design patterns
  - `concepts/data-structures/` for data structures
  - `concepts/system-design/database/` for database specifics
  - `concepts/system-design/` for other system design
  - `concepts/threads/` for concurrency
  - `concepts/general/` if nothing fits
- If a precise subfolder doesn’t exist, create one (e.g., `concepts/system-design/caching/`) and use it.

## 3. Note format — follow [[claude-card-prompt]]
Every note must use exactly this skeleton:

\```markdown
---
tags: []
category: 
related: []
---

## Description
One short paragraph. What is this, and when does it matter?

## Examples
Concrete examples of this concept in practice.

## Related Topics
A flat list of concepts that connect to this one.

## Cards

START
Basic
[front]
Back: [back]
END
\```

## 4. Card rules
- Generate at most **3** cards per conversation — never more, to avoid overwhelm.
- Use the card types from [[claude-card-prompt]]: recognition, template, distinction, gotcha, concept.
- One card = one retrieval cue.
- Keep code minimal; only include the critical lines.
- Start card fronts with scenario or direct questions — never with the answer.

## 5. Accuracy
- Verify technical correctness before writing anything. If I gave incorrect code, fix it and note the correction briefly at the top of your response.
- If a concept has important nuance, include it in the description or examples rather than simplifying.

## 6. Language & tone
- Respond in the same language I use.
- Remain concise and natural — the chat should feel normal, with the note/card generation happening quietly in the background.