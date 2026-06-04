---
tags: [spring, web, rest-api]
category: spring
related: [spring-core, spring-security, spring-boot-autoconfiguration]
---

## Description
Spring Web MVC maps URLs, query parameters, headers, cookies, and request bodies onto controller method parameters. The core annotations answer two questions: what part of the HTTP request are you reading, and what should Spring write back to the response? For APIs, the most common flow is `@RestController` + request mapping annotations + validation + centralized exception handling with `@RestControllerAdvice`. For server-rendered forms, `@Controller`, `@ModelAttribute`, and `@SessionAttributes` are the key pieces.

## Examples
```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
class UserController {
    private final UserService userService;

    UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    List<UserDto> search(@RequestParam String q,
                         @RequestParam(defaultValue = "0") int page,
                         @RequestParam(defaultValue = "20") int size,
                         @RequestParam(required = false) String sort,
                         @RequestHeader("X-Tenant") String tenant,
                         @CookieValue(value = "locale", defaultValue = "en") String locale) {
        return userService.search(q, page, size, sort, tenant, locale);
    }

    @GetMapping("/{id}")
    UserDto getById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    UserDto create(@Valid @RequestBody CreateUserRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}")
    UserDto replace(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        return userService.replace(id, request);
    }

    @PatchMapping("/{id}")
    UserDto patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return userService.patch(id, updates);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
```

```java
@Controller
@RequestMapping("/signup")
@SessionAttributes("signupForm")
class SignupController {
    @ModelAttribute("signupForm")
    SignupForm signupForm() {
        return new SignupForm();
    }

    @GetMapping
    String showForm() {
        return "signup/form";
    }

    @PostMapping
    String submit(@Valid @ModelAttribute("signupForm") SignupForm form,
                  BindingResult bindingResult,
                  SessionStatus sessionStatus) {
        if (bindingResult.hasErrors()) {
            return "signup/form";
        }
        sessionStatus.setComplete();
        return "redirect:/signup/success";
    }
}
```

```java
@ResponseStatus(HttpStatus.NOT_FOUND)
class UserNotFoundException extends RuntimeException {
    UserNotFoundException(Long id) {
        super("User %d not found".formatted(id));
    }
}

@RestControllerAdvice
class GlobalApiExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    ErrorResponse handleNotFound(UserNotFoundException ex) {
        return new ErrorResponse("USER_NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        return new ErrorResponse("VALIDATION_FAILED", ex.getBindingResult().toString());
    }
}
```

| Annotation | Real syntax | Reads from / does |
| --- | --- | --- |
| `@RestController` / `@Controller` | `@RestController class UserController {}` | JSON/XML response body vs MVC view rendering |
| `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping` | `@GetMapping("/{id}")` | Map HTTP path + method |
| `@PathVariable` | `get(@PathVariable Long id)` | Bind URI template variable |
| `@RequestParam` | `search(@RequestParam(defaultValue = "0") int page)` | Bind query string or form param |
| `@RequestBody` | `create(@RequestBody CreateUserRequest request)` | Deserialize HTTP body |
| `@RequestHeader` / `@CookieValue` | `@RequestHeader("X-Tenant") String tenant` | Read headers or cookies |
| `@ModelAttribute` / `@SessionAttributes` | `@ModelAttribute("signupForm") SignupForm form` | Bind form fields and optionally store model attribute in session |
| `@Valid` / `@Validated` | `@Valid @RequestBody CreateUserRequest request` | Trigger bean validation |
| `@ResponseStatus` | `@ResponseStatus(HttpStatus.CREATED)` | Force HTTP status on method or exception |
| `@ExceptionHandler` / `@RestControllerAdvice` | `@ExceptionHandler(UserNotFoundException.class)` | Global exception-to-response mapping |
| `@CrossOrigin` | `@CrossOrigin(origins = "http://localhost:3000")` | Enable CORS for browser clients |

## Related Topics
- [[spring-core]]
- [[spring-security]]
- [[spring-boot-autoconfiguration]]

## Cards

```anki
START
Basic
What's the difference between `@Controller` and `@RestController`?
Back: `@Controller` is for MVC handlers that usually return a view name like `"signup/form"`.<br>`@RestController` is `@Controller` + `@ResponseBody`, so return values such as `UserDto` are written directly to the HTTP response as JSON.<br>Use `@RestController` for APIs and `@Controller` for server-rendered pages.
<!--ID: 1780580933175-->
END

START
Basic
How do `@PathVariable`, `@RequestParam`, and `@RequestBody` differ?
Back: `@PathVariable Long id` reads from the URL path like `/users/{id}`.<br>`@RequestParam(defaultValue = "0") int page` reads query string or form values like `?page=0`.<br>`@RequestBody CreateUserRequest request` deserializes the HTTP body into a Java object.
<!--ID: 1780580933177-->
END

START
Basic
How do you implement global exception handling in Spring?
Back: Put `@ExceptionHandler` methods in a `@RestControllerAdvice` class, for example `@ExceptionHandler(UserNotFoundException.class) ErrorResponse handleNotFound(...) { ... }`.<br>This centralizes error handling for all controllers and keeps controller methods free of repeated `try/catch` logic.
<!--ID: 1780580933178-->
END

START
Basic
`@RequestParam`: how do you handle optional parameters with defaults?
Back: Example: `@GetMapping("/search") List<Item> search(@RequestParam String q, @RequestParam(defaultValue = "0") int page, @RequestParam(required = false) String sort)`.<br>`required = false` means Spring passes `null` when the parameter is absent.<br>`defaultValue` provides a fallback string that Spring converts to the target type.
<!--ID: 1780580933180-->
END

START
Basic
`@Valid` vs `@Validated`: what's the difference?
Back: `@Valid @RequestBody CreateUserRequest request` triggers bean validation using Jakarta/Bean Validation annotations like `@NotBlank`.<br>`@Validated(OnCreate.class)` is Spring's variant and supports validation groups.<br>Use `@Valid` for simple request validation; use `@Validated` when you need group-based rules.
<!--ID: 1780580933181-->
END

START
Basic
`@ResponseStatus`: how do you set HTTP status on a method or exception?
Back: On a handler method: `@PostMapping @ResponseStatus(HttpStatus.CREATED) UserDto create(...)`.<br>On an exception class: `@ResponseStatus(HttpStatus.NOT_FOUND) class ResourceNotFoundException extends RuntimeException {}`.<br>The exception annotation is applied whenever that exception is thrown and not handled with a different status.
<!--ID: 1780580933183-->
END

START
Basic
`@ModelAttribute`: what does it do?
Back: At parameter level it binds request parameters or form fields into an object: `submit(@ModelAttribute UserForm form)`.<br>At method level it creates or adds an object to the model before handlers run: `@ModelAttribute("signupForm") SignupForm signupForm() { return new SignupForm(); }`.<br>It is central to MVC form handling.
<!--ID: 1780580933184-->
END

START
Basic
`@CrossOrigin`: how do you enable CORS?
Back: Add it to a controller or method, e.g. `@RestController @CrossOrigin(origins = "http://localhost:3000") class UserController {}` or `@CrossOrigin @GetMapping("/users")`.<br>That tells Spring to send the CORS response headers for matching requests.<br>For app-wide rules, configure `WebMvcConfigurer#addCorsMappings`.
<!--ID: 1780580933186-->
END

START
Basic
`@CookieValue` and `@RequestHeader`: how do you read them?
Back: Example: `@GetMapping void get(@RequestHeader("Authorization") String auth, @CookieValue(value = "sessionId", defaultValue = "") String sessionId)`.<br>Both annotations support `required = false` and `defaultValue`.<br>Use them for metadata that belongs in headers/cookies rather than the request body.
<!--ID: 1780580933188-->
END

START
Basic
What's the full `@RestControllerAdvice` pattern for API error handling?
Back: Create a class annotated `@RestControllerAdvice`, add methods like `@ExceptionHandler(UserNotFoundException.class)` and optionally `@ResponseStatus(HttpStatus.NOT_FOUND)`, and return a consistent error DTO such as `new ErrorResponse("USER_NOT_FOUND", ex.getMessage())`.<br>Spring routes matching exceptions from any controller to those handlers globally.
<!--ID: 1780580933189-->
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