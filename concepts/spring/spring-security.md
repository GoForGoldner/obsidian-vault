---
tags: [spring, security, authentication]
category: spring
related: [spring-web-mvc, spring-core, spring-aop-testing]
---

## Description
Spring Security has two main enforcement layers: request security in the `SecurityFilterChain` and method security with annotations like `@PreAuthorize`. The filter chain decides whether a request may reach your controller at all; method security decides whether the current authenticated principal may execute a specific service or controller method. The most useful annotations either declare authorization rules, inject the current principal/security context, or help you fake authentication in tests.

## Examples
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reports/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults())
            .build();
    }
}

@RestController
@RequestMapping("/api/documents")
class DocumentController {
    private final DocumentService documentService;

    DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('document:read') and #id == authentication.principal.documentId")
    public DocumentDto one(@PathVariable Long id,
                           @AuthenticationPrincipal CustomUserDetails user,
                           @CurrentSecurityContext(expression = "authentication") Authentication authentication) {
        return documentService.findForUser(id, user.getId(), authentication.getName());
    }

    @PostMapping
    @Secured("ROLE_ADMIN")
    public DocumentDto create(@RequestBody DocumentDto dto) {
        return documentService.create(dto);
    }

    @DeleteMapping("/{id}")
    @RolesAllowed("ADMIN")
    public void delete(@PathVariable Long id) {}

    @GetMapping("/internal")
    @DenyAll
    public String internalOnlyMarker() {
        return "blocked";
    }
}
```

```java
@Service
class DocumentService {
    @PreAuthorize("hasRole('ADMIN') or #ownerId == authentication.principal.id")
    public DocumentDto findForUser(Long id, Long ownerId, String username) {
        return load(id);
    }

    @PostAuthorize("returnObject.ownerUsername == authentication.name")
    public DocumentDto load(Long id) {
        return repository.fetch(id);
    }

    @PreFilter("filterObject.ownerUsername == authentication.name")
    public void processDocuments(List<DocumentDto> documents) {
        documents.forEach(this::store);
    }

    @PostFilter("filterObject.ownerUsername == authentication.name")
    public List<DocumentDto> visibleDocuments() {
        return repository.findAll();
    }

    @PermitAll
    public String publicGreeting() {
        return "hello";
    }
}
```

```java
@WebMvcTest(DocumentController.class)
class DocumentControllerTest {
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN", "USER"})
    void admin_can_create_documents() {}

    @Test
    @WithUserDetails(value = "alice", userDetailsServiceBeanName = "customUserDetailsService")
    void loads_real_user_from_user_details_service() {}
}
```

| Annotation | Real syntax | Purpose |
| --- | --- | --- |
| `@EnableWebSecurity` | `@EnableWebSecurity class SecurityConfig {}` | Enable/customize web security |
| `@EnableMethodSecurity` | `@EnableMethodSecurity` | Activate method security annotations |
| `@PreAuthorize` / `@PostAuthorize` | `@PreAuthorize("hasRole('ADMIN')")` | SpEL authorization before/after method |
| `@Secured` / `@RolesAllowed` | `@Secured("ROLE_ADMIN")`, `@RolesAllowed("ADMIN")` | Simpler role checks |
| `@PreFilter` / `@PostFilter` | `@PostFilter("filterObject.ownerUsername == authentication.name")` | Filter collection args/results |
| `@AuthenticationPrincipal` | `reports(@AuthenticationPrincipal CustomUserDetails user)` | Inject current principal |
| `@CurrentSecurityContext` | `@CurrentSecurityContext(expression = "authentication")` | Inject current security context data |
| `@WithMockUser` / `@WithUserDetails` | `@WithMockUser(roles = "ADMIN")` | Fake authenticated user in tests |
| `@PermitAll` / `@DenyAll` | `@PermitAll public String ping()` | Explicit allow-all / deny-all |

## Related Topics
- [[spring-web-mvc]]
- [[spring-core]]
- [[spring-aop-testing]]

## Cards

```anki
START
Basic
What's the difference between `@PreAuthorize`, `@Secured`, and `@RolesAllowed`?
Back: `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")` is the most flexible because it uses SpEL and can inspect roles, authorities, method parameters, and beans.<br>`@Secured("ROLE_ADMIN")` and `@RolesAllowed("ADMIN")` are simpler role-only checks.<br>Use `@PreAuthorize` when the rule is more than just "has role X".
<!--ID: 1780580933157-->
END

START
Basic
How do you access the currently authenticated user in a controller method?
Back: Use `@AuthenticationPrincipal` on a method parameter, e.g. `one(@AuthenticationPrincipal CustomUserDetails user)`.<br>You can also inject the broader context with `@CurrentSecurityContext(expression = "authentication") Authentication auth`.<br>This is cleaner than manually calling `SecurityContextHolder`.
<!--ID: 1780580933159-->
END

START
Basic
How do you test secured endpoints without a real login?
Back: `@WithMockUser(username = "admin", roles = {"ADMIN"})` creates a fake authenticated user for the test.<br>`@WithUserDetails("alice")` loads a real user through your `UserDetailsService`.<br>Both let you test authorization without performing the full login flow.
<!--ID: 1780580933161-->
END

START
Basic
`@PreAuthorize` with SpEL: what expressions can you use?
Back: Common examples are `@PreAuthorize("hasRole('ADMIN')")`, `@PreAuthorize("hasAuthority('user:write')")`, and `@PreAuthorize("#userId == authentication.principal.id")`.<br>You can reference method parameters with `#paramName`, the current auth object with `authentication`, and beans with `@beanName`.
<!--ID: 1780580933163-->
END

START
Basic
`@PostAuthorize`: when do you use it instead of `@PreAuthorize`?
Back: Use it when you must load the object before checking authorization, e.g. `@PostAuthorize("returnObject.ownerUsername == authentication.name")`.<br>The check runs after the method and can inspect `returnObject`.<br>`@PreAuthorize` is more common because it can block work earlier.
<!--ID: 1780580933166-->
END

START
Basic
`@PreFilter` and `@PostFilter`: how do they work?
Back: `@PreFilter("filterObject.ownerUsername == authentication.name") void process(List<DocumentDto> docs)` removes non-matching input elements before the method runs.<br>`@PostFilter("filterObject.ownerUsername == authentication.name")` filters the returned collection after the method completes.<br>`filterObject` refers to each collection element.
<!--ID: 1780580933167-->
END

START
Basic
`SecurityFilterChain`: how do you configure URL-based security?
Back: Build rules with `http.authorizeHttpRequests(auth -> auth.requestMatchers("/public/**").permitAll().requestMatchers("/api/admin/**").hasRole("ADMIN").anyRequest().authenticated())`.<br>Put more specific matchers before broader ones.<br>`anyRequest()` is the catch-all fallback.
<!--ID: 1780580933169-->
END

START
Basic
`@EnableMethodSecurity`: what does it enable?
Back: It activates method-level annotations like `@PreAuthorize`, `@PostAuthorize`, `@PreFilter`, and `@PostFilter` on Spring beans.<br>Without `@EnableMethodSecurity` on a `@Configuration` class, those annotations are ignored.<br>It replaces the older `@EnableGlobalMethodSecurity` style in modern Spring Security.
<!--ID: 1780580933171-->
END

START
Basic
`@WithMockUser`: how do you customize the mock user?
Back: Example: `@WithMockUser(username = "admin", roles = {"ADMIN", "USER"}, password = "secret")`.<br>`roles` automatically adds the `ROLE_` prefix.<br>If you need exact authorities without the prefix, use `authorities = {"document:read", "document:write"}` instead.
<!--ID: 1780580933172-->
END

START
Basic
What do `@PermitAll` and `@DenyAll` do?
Back: `@PermitAll` allows any caller to invoke the method, even unauthenticated users, e.g. `@PermitAll public String health() { return "ok"; }`.<br>`@DenyAll` blocks every caller.<br>Use them when you want the method-level rule to be explicit rather than inherited from broader config.
<!--ID: 1780580933174-->
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