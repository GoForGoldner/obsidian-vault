---
epoch: 1780772501775
modelKey: "deepseek-v4-flash|deepseek"
topic: "PreAuthorize vs PostAuthorize Use Cases"



tags:
  - copilot-conversation
---

**user**: I’m confused about postauthorize and preauthorize. what are the use cases and when should they be used?
[Timestamp: 2026/06/06 15:01:41]

**ai**: Great question — `@PreAuthorize` and `@PostAuthorize` are both Spring Security method‑level annotations for **expression‑based access control**, but they fire at different points.

## @PreAuthorize
- **When:** Before the method executes.
- **Use case:** The decision depends only on the **method arguments** (or the current authentication).
- **Common pattern:** "Only allow if the caller owns the resource identified by an argument."

```java
@PreAuthorize("hasRole('ADMIN') or #document.owner == authentication.name")
public Document getDocument(@P("document") Document document) { ... }
```

## @PostAuthorize
- **When:** After the method returns (but before the result is returned to the caller).
- **Use case:** The decision depends on the **returned object**.
- **Common pattern:** "Only give back the data if the caller is allowed to see it, but we had to fetch it first."

```java
@PostAuthorize("returnObject.visibility == 'PUBLIC' or returnObject.owner == authentication.name")
public Document loadDocument(Long id) { ... }
```

## When to use which
| Situation | Use |
|-----------|-----|
| You have all the info needed from the request / arguments | `@PreAuthorize` |
| You must fetch the resource before you can decide | `@PostAuthorize` |

> ⚠️ `@PostAuthorize` **must** be on a method that returns a non‑null value. If the method throws or returns null, the expression will fail with an exception.

---

I’ve added a note to the vault:

**Added [[PreAuthorize vs PostAuthorize]]** `concepts/security/`

Here’s what was created:

```markdown
---
tags: [spring-security, authorization]
category: security
related: [@Secured, method-security, hasPermission]
---

## Description
@PreAuthorize and @PostAuthorize are Spring Security annotations for method‑level access control. @PreAuthorize evaluates before the method runs (based on arguments/authentication). @PostAuthorize evaluates after the method runs (based on the return value). Choosing the right one depends on whether you already have the information needed to decide access.

## Examples
- @PreAuthorize: "Only the owner of a document can delete it" – the owner identity is in the method argument.
- @PostAuthorize: "Only show the document if its visibility is PUBLIC" – you must load the document first.

## Related Topics
- [[@Secured vs @PreAuthorize]]
- [[Spring MVC method security]]
- [[hasAuthority vs hasRole]]

## Cards

START
Basic
@PreAuthorize vs @PostAuthorize – which one evaluates before the method call?
Back: @PreAuthorize evaluates before; @PostAuthorize evaluates after.
END

START
Basic
Which annotation would you use to restrict access based on the returned object's properties?
Back: @PostAuthorize (use `returnObject.property` in the SpEL expression).
END

START
Basic
What happens if you put @PostAuthorize on a void method?
Back: The `returnObject` will be null, causing a SpEL evaluation exception; only use @PostAuthorize on non‑void methods.
END
```

Three cards were generated using the format from [[claude-card-prompt]] — they’re now stored with the note.
[Timestamp: 2026/06/06 15:02:04]