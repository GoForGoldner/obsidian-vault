# Claude – Anki Card Generation Prompt

Use this file as context when asking Claude to generate Anki cards or Obsidian notes.

---

## Goal

Build a mental mind map of programming concepts so that when I see a problem or a codebase, I can immediately recognize patterns, recall templates, and understand tradeoffs — without having to look things up.

---

## What I'll give you

I'll provide a concept in one of these forms:
- A plain text description of something I just learned
- A code snippet I want cards built around
- An existing Obsidian note I want to expand or turn into cards
- A mix of the above

---

## Accuracy — top priority

Before writing anything, verify the technical accuracy of the concept being described. If I provide a code snippet or explanation, check it for correctness. If anything is wrong or imprecise, fix it in the output and list the corrections briefly at the top of your response before the note — one line per change. If something is ambiguous or has important nuance, reflect that in the description or examples section rather than stating something oversimplified as fact.

---

## Note format

Every note must follow this exact structure:

~~~markdown
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
A flat list of concepts that connect to this one. Don't mark them — I'll decide what's already in my vault.

## Cards

START
Basic
[front]
Back: [back]
END
~~~

---

## Card rules

**One card = one retrieval cue.** If the answer takes more than 30 seconds to recall, split the card.

**Card types to use (mix these):**

Recognition card — the most important type:
~~~
Front: You see: [specific signals in the problem]. What pattern/approach?
Back: [pattern name] — [one sentence on why and the key condition]
~~~

Template card — for things I need to write from memory:
~~~
Front: Write the [algorithm/pattern] template — specifically [the tricky part]
Back: [minimal skeleton, only the parts that are hard to remember]
~~~

Distinction card — for tradeoffs:
~~~
Front: When do you use [X] over [Y]?
Back: [X] when [condition]. [Y] when [condition].
~~~

Gotcha card — for the one thing that breaks everything if forgotten:
~~~
Front: What's the line/detail in [algorithm] that kills you if you forget it?
Back: [the specific line or detail] — [one sentence on why it matters]
~~~

Concept card — for understanding, not just recall:
~~~
Front: What does [variable/state/term] mean in [algorithm/pattern]?
Back: [plain English definition — no jargon]
~~~

---

## Code on cards

- For template cards: include the full skeleton but strip comments and anything obvious
- For gotcha/distinction cards: only include the specific critical line(s), not the whole algorithm
- Keep code to the minimum that actually tests recall — if I need to see the whole thing to answer the card, the card is too big

---

## Card front rules

- Use scenario-based fronts (You see X, what do you do?) for pattern recognition
- Use direct question fronts (What is X? When do you use X?) for concepts and distinctions
- Never start the front with the answer
- The front should be specific enough that there's only one right answer

---

## Card back rules

- No walls of text
- If the back needs more than 4 lines, the card should be split
- End with one sentence of insight if helpful: the "why it works" or "how to remember it"

---

## Example of a good note

~~~markdown
---
tags: [algorithms, graph, shortest-path]
category: algorithms
related: [[bfs]], [[bellman-ford]], [[union-find]]
---

## Description
Dijkstra finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights. It uses a min-heap to always process the cheapest unvisited node next.

## Examples
Finding the fastest route between two cities on a map where roads have different travel times. Each city is a node, each road is a weighted edge.

## Related Topics
- Bellman-Ford
- BFS
- Priority Queue
- A* Search

## Cards

START
Basic
You see: weighted graph, non-negative edges, shortest path from one source. What algorithm?
Back: Dijkstra. Min-heap of (cost, node), always process cheapest next.
END

START
Basic
What is the one line in Dijkstra you can't forget and why?
Back: if cost > dist[node]: continue
Skips stale heap entries. Without it you reprocess nodes with outdated costs.
END

START
Basic
When do you use Bellman-Ford over Dijkstra?
Back: When the graph has negative edge weights. Dijkstra breaks silently with negatives.
END

START
Basic
What does dist[node] represent in Dijkstra?
Back: The best known shortest distance from the source to that node so far.
END
~~~
