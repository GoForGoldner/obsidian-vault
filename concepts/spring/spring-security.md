---
tags: [spring, security, authentication]
category: spring
related: [spring-web-mvc, spring-core, spring-aop-testing]
---

## Description
Spring Security answers two separate questions: who is the user, and what is that user allowed to do? The main conceptual split is between request-level security in the filter chain and method-level security on services/controllers. For annotations, the most useful distinctions are which authorization style is expressive enough for your rules and how to access or fake the current principal cleanly.

## Examples
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated())
            .build();
    }
}

@RestController
@RequestMapping("/api/admin")
class AdminController {
    @GetMapping("/reports")
    @PreAuthorize("hasRole('ADMIN')")
    ReportDto reports(@AuthenticationPrincipal CustomUserDetails user) {
        return service.loadReportsFor(user.getTenantId());
    }
}
```

```java
@WebMvcTest(AdminController.class)
class AdminControllerTest {
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void allows_admin() {}
}
```

| Annotation | Best use |
| --- | --- |
| `@EnableWebSecurity` | Activate/configure the web security filter chain |
| `@EnableMethodSecurity` | Turn on method-level authorization annotations |
| `@PreAuthorize` / `@PostAuthorize` | Flexible SpEL-based authorization before/after a method |
| `@Secured` / `@RolesAllowed` | Simpler role-only checks |
| `@PreFilter` / `@PostFilter` | Filter collection arguments/results by security rules |
| `@AuthenticationPrincipal` / `@CurrentSecurityContext` | Access the current authenticated user/context |
| `@WithMockUser` / `@WithUserDetails` | Security testing without real login flow |
| `@PermitAll` / `@DenyAll` | Explicitly allow or block all access |

## Related Topics
- [[spring-web-mvc]]
- [[spring-core]]
- [[spring-aop-testing]]

## Cards

```anki
START
Basic
What's the difference between `@PreAuthorize`, `@Secured`, and `@RolesAllowed`?
Back: `@PreAuthorize` is the most expressive because it supports SpEL, so it can check roles, authorities, and even method parameters. `@Secured` and `@RolesAllowed` are simpler role-based options. Prefer `@PreAuthorize` when authorization rules go beyond "does this user have role X?".
END

START
Basic
How do you access the currently authenticated user in a controller method?
Back: Use `@AuthenticationPrincipal` on a method parameter to inject the current principal directly. It's cleaner than manually reaching into `SecurityContextHolder`, and it keeps controller signatures honest about the data they need.
END

START
Basic
How do you test secured endpoints without a real login?
Back: Use `@WithMockUser` to create a fake authenticated user in the test, or `@WithUserDetails` when you want to load a real user from your `UserDetailsService`. That keeps security tests fast and focused on authorization behavior instead of authentication plumbing.
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