---
tags: [spring, web, rest-api]
category: spring
related: [spring-core, spring-security, spring-boot-autoconfiguration]
---

## Description
Spring MVC maps HTTP requests onto controller methods so your code can focus on resources, validation, and response shapes instead of servlet plumbing. The important distinctions are about what part of the request each annotation reads from, whether a controller is returning views or serialized data, and where error-handling logic should live so controllers stay thin.

## Examples
```java
@RestController
@RequestMapping("/api/users")
class UserController {
    @GetMapping("/{id}")
    UserDto getUser(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping
    List<UserDto> search(@RequestParam(defaultValue = "0") int page,
                         @RequestParam(defaultValue = "20") int size,
                         @RequestHeader("X-Tenant") String tenant) {
        return service.search(page, size, tenant);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    UserDto create(@Valid @RequestBody CreateUserRequest request) {
        return service.create(request);
    }

    @PatchMapping("/{id}")
    UserDto patch(@PathVariable Long id,
                  @RequestBody UpdateUserRequest request,
                  @CookieValue(name = "locale", required = false) String locale) {
        return service.update(id, request, locale);
    }
}
```

```java
@RestControllerAdvice
class GlobalApiExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Map<String, String> handleNotFound(UserNotFoundException ex) {
        return Map.of("error", ex.getMessage());
    }
}
```

| Annotation | Pulls data from | Best for |
| --- | --- | --- |
| `@PathVariable` | URL path | Resource identity like `/users/{id}` |
| `@RequestParam` | Query string/form fields | Filtering, sorting, pagination |
| `@RequestBody` | HTTP body | Create/update payloads |
| `@ModelAttribute` | Bound form/query params into an object | MVC forms and simple binding |
| `@RequestHeader` / `@CookieValue` | Headers / cookies | Metadata like tenant, locale, auth-adjacent hints |
| `@Valid` / `@Validated` | Bean validation trigger | Input validation at the edge |
| `@ControllerAdvice` / `@RestControllerAdvice` | Cross-controller exception handling | Reusable API error policy |

## Related Topics
- [[spring-core]]
- [[spring-security]]
- [[spring-boot-autoconfiguration]]

## Cards

```anki
START
Basic
What's the difference between `@Controller` and `@RestController`?
Back: `@Controller` is for MVC handlers that usually return view names for template rendering. `@RestController` is `@Controller` + `@ResponseBody`, so return values are written directly to the HTTP response as JSON or XML. Use `@RestController` for APIs and `@Controller` for server-rendered pages.
END

START
Basic
How do `@PathVariable`, `@RequestParam`, and `@RequestBody` differ?
Back: `@PathVariable` reads from the URL path and usually identifies the resource, `@RequestParam` reads query/form values and is best for filters or pagination, and `@RequestBody` deserializes the whole body into an object. If you mix them up, your endpoint shape usually becomes a design smell.
END

START
Basic
How do you implement global exception handling in Spring?
Back: Put `@ExceptionHandler` methods inside a `@RestControllerAdvice` (or `@ControllerAdvice`) class. That centralizes error-to-response mapping for all controllers, keeps controllers free of repetitive try/catch blocks, and gives your API one consistent error format.
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