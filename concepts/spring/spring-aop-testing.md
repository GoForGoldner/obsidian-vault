---
tags: [spring, aop, testing]
category: spring
related: [spring-core, spring-security, spring-data-jpa]
---

## Description
AOP exists to isolate cross-cutting concerns like logging, metrics, security, and transactions from business logic. Testing annotations solve a similar problem from the other side: load only the part of the application you need so tests stay fast and focused. The concept to remember is scope control—pointcuts control where advice applies, and test slices control how much of the application context you pay to start.

## Examples
```java
@Aspect
@Component
class TimingAspect {
    @Pointcut("execution(* com.example.service..*(..))")
    void serviceMethods() {}

    @Around("serviceMethods()")
    Object measure(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.nanoTime();
        try {
            return joinPoint.proceed();
        } finally {
            long elapsed = System.nanoTime() - start;
            log.info("{} took {} ns", joinPoint.getSignature(), elapsed);
        }
    }
}

@Configuration
@EnableAspectJAutoProxy
class AopConfig {}
```

```java
@SpringBootTest
class FullApplicationTest {}

@WebMvcTest(UserController.class)
class UserControllerTest {
    @MockBean UserService userService;
}

@DataJpaTest
class UserRepositoryTest {}

@TestConfiguration
class StubConfig {
    @Bean Clock testClock() {
        return Clock.systemUTC();
    }
}
```

| Test annotation | Why you'd choose it |
| --- | --- |
| `@SpringBootTest` | Full integration test with the whole application context |
| `@WebMvcTest` | Web layer only; controller-focused tests |
| `@DataJpaTest` | Repository/JPA slice with transactional rollback |
| `@MockBean` | Replace a bean entirely with a Mockito mock |
| `@SpyBean` | Wrap the real bean and override only selected behavior |
| `@TestConfiguration` / `@TestPropertySource` / `@ActiveProfiles` | Test-only beans and environment shaping |
| `@DirtiesContext` / `@Sql` / `@Rollback` | Reset or seed state when isolation matters |

## Related Topics
- [[spring-core]]
- [[spring-security]]
- [[spring-data-jpa]]

## Cards

```anki
START
Basic
What are the Spring Boot test slices and when do you use each?
Back: Use `@SpringBootTest` for full integration tests, `@WebMvcTest` when you only care about request/response behavior in the web layer, and `@DataJpaTest` when you want repository and mapping behavior without the whole app. Prefer slices when possible because they start faster and fail more locally.
END

START
Basic
What's the difference between `@MockBean` and `@SpyBean`?
Back: `@MockBean` replaces the bean with a Mockito mock, so nothing real runs unless you stub it. `@SpyBean` wraps the real bean, so real behavior still executes unless you override part of it. Mock when isolating; spy when you want mostly real behavior with a small seam.
END

START
Basic
How does `@Around` advice work in Spring AOP?
Back: `@Around` wraps the target method. Your advice runs before and after the real call, and you must call `joinPoint.proceed()` if you want the target method to execute. Because it controls the whole invocation, it's the most powerful advice type for timing, retries, exception handling, or short-circuiting.
END

START
Basic
When is AOP a good fit, and when is it a smell?
Back: AOP is a good fit for technical concerns that apply consistently across many methods, like logging, metrics, transactions, or security checks. It's a smell when it hides core business logic or makes behavior hard to trace. If understanding a use case requires mentally reconstructing advice chains, the aspect is probably doing too much.
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