---
tags: [spring, aop, testing]
category: spring
related: [spring-core, spring-security, spring-data-jpa]
---

## Description
Spring AOP lets you intercept matched method executions with advice so you can move cross-cutting concerns like logging, metrics, retries, and tracing out of business code. The important annotations define where advice applies (`@Pointcut`) and what kind of interception you want (`@Before`, `@After`, `@AfterReturning`, `@AfterThrowing`, `@Around`). Spring testing annotations solve a related scoping problem: load only the slice of the application you need, override collaborators cleanly, and control state with properties, SQL scripts, rollback, and context resets.

## Examples
```java
@Aspect
@Component
class LoggingAspect {
    @Pointcut("execution(* com.example.service..*(..))")
    void anyServiceMethod() {}

    @Pointcut("@annotation(com.example.Loggable)")
    void loggableMethod() {}

    @Pointcut("within(com.example.repository..*)")
    void repositoryPackage() {}

    @Before("anyServiceMethod()")
    void beforeCall(JoinPoint joinPoint) {
        log.info("calling {}", joinPoint.getSignature());
    }

    @After("repositoryPackage()")
    void afterRepositoryCall(JoinPoint joinPoint) {
        log.info("finished {}", joinPoint.getSignature());
    }

    @AfterReturning(pointcut = "anyServiceMethod()", returning = "result")
    void afterSuccess(JoinPoint joinPoint, Object result) {
        log.info("{} returned {}", joinPoint.getSignature(), result);
    }

    @AfterThrowing(pointcut = "anyServiceMethod()", throwing = "ex")
    void afterFailure(JoinPoint joinPoint, Throwable ex) {
        log.error("{} failed", joinPoint.getSignature(), ex);
    }

    @Around("anyServiceMethod() && !loggableMethod()")
    Object measureAndRetry(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.nanoTime();
        try {
            return joinPoint.proceed();
        } catch (TransientApiException ex) {
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
@TestPropertySource(properties = {"app.cache.enabled=false", "app.timeout=100"})
@ActiveProfiles("test")
class FullApplicationTest {
    @SpyBean NotificationService notificationService;

    @MockBean ExternalBillingClient externalBillingClient;
}

@WebMvcTest(UserController.class)
@ExtendWith(SpringExtension.class)
class UserControllerTest {
    @MockBean UserService userService;
}

@DataJpaTest
@Sql("/test-data.sql")
@Rollback
class UserRepositoryTest {}

@ContextConfiguration(classes = {UserService.class, StubConfig.class})
@ExtendWith(SpringExtension.class)
class UserServiceSliceTest {}

@TestConfiguration
class StubConfig {
    @Bean
    Clock testClock() {
        return Clock.fixed(Instant.parse("2024-01-01T00:00:00Z"), ZoneOffset.UTC);
    }
}

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ContextResettingTest {}
```

| Annotation | Real syntax | Purpose |
| --- | --- | --- |
| `@Aspect` / `@EnableAspectJAutoProxy` | `@Aspect @Component class LoggingAspect {}` | Register Spring AOP advice |
| `@Pointcut` | `@Pointcut("execution(* com.example.service..*(..))")` | Name reusable pointcut expressions |
| `@Before`, `@After`, `@AfterReturning`, `@AfterThrowing`, `@Around` | `@Around("anyServiceMethod()")` | Choose interception timing |
| `execution`, `within`, `@annotation` | `within(com.example.repository..*)` | Common pointcut designators |
| `@SpringBootTest` | `@SpringBootTest` | Full application integration test |
| `@WebMvcTest`, `@DataJpaTest` | `@WebMvcTest(UserController.class)` | Slice tests for specific layers |
| `@MockBean` / `@SpyBean` | `@MockBean UserService userService;` | Replace or spy on Spring beans in tests |
| `@TestConfiguration`, `@TestPropertySource`, `@ActiveProfiles` | `@TestPropertySource(properties = "app.timeout=100")` | Test-only beans and environment shaping |
| `@DirtiesContext`, `@Sql`, `@Rollback` | `@Sql("/test-data.sql")` | Reset or seed database/application state |
| `@ExtendWith(SpringExtension.class)` / `@ContextConfiguration` | `@ContextConfiguration(classes = StubConfig.class)` | Plain Spring test context without full Boot auto-config |

## Related Topics
- [[spring-core]]
- [[spring-security]]
- [[spring-data-jpa]]

## Cards

```anki
START
Basic
What are the Spring Boot test slices and when do you use each?
Back: Use `@SpringBootTest` for full integration tests, `@WebMvcTest(UserController.class)` for controller/request-response tests, and `@DataJpaTest` for repository/JPA mapping tests.<br>Slices start less of the application context, so they are faster and isolate failures better.
<!--ID: 1780580933191-->
END

START
Basic
What's the difference between `@MockBean` and `@SpyBean`?
Back: `@MockBean ExternalBillingClient client;` replaces the bean with a Mockito mock, so no real logic runs unless you stub it.<br>`@SpyBean NotificationService notificationService;` wraps the real bean and lets real behavior run unless you override part of it.<br>Mock when isolating; spy when you want mostly real behavior with a small seam.
<!--ID: 1780580933192-->
END

START
Basic
How does `@Around` advice work in Spring AOP?
Back: `@Around("anyServiceMethod()") Object measure(ProceedingJoinPoint pjp) throws Throwable { return pjp.proceed(); }` wraps the target call.<br>You control whether and when the target method runs by calling `proceed()`.<br>That makes `@Around` the most powerful advice for timing, retries, exception handling, or short-circuiting.
<!--ID: 1780580933194-->
END

START
Basic
When is AOP a good fit, and when is it a smell?
Back: AOP is a good fit for technical cross-cutting concerns like logging, metrics, tracing, retries, security, or transactions.<br>It becomes a smell when it hides core business rules or makes execution hard to follow.<br>If understanding a use case requires mentally reconstructing several advice chains, the aspect is probably doing too much.
<!--ID: 1780580933196-->
END

START
Basic
`@Pointcut` expression syntax: what are the common patterns?
Back: `execution(* com.example.service.*.*(..))` matches method executions by signature.<br>`@annotation(com.example.Loggable)` matches methods with a specific annotation.<br>`within(com.example.service..*)` matches all methods inside a package tree.<br>Combine expressions with `&&`, `||`, and `!`.
<!--ID: 1780580933197-->
END

START
Basic
`@Before`, `@After`, `@AfterReturning`, `@AfterThrowing`: how do they differ?
Back: `@Before` runs before the method.<br>`@After` runs after completion like a `finally` block.<br>`@AfterReturning` runs only when the method succeeds and can access the return value.<br>`@AfterThrowing` runs only when the method throws and can access the exception.<br>`@Around` wraps the whole invocation.
<!--ID: 1780580933199-->
END

START
Basic
`@TestPropertySource`: how do you override properties for tests?
Back: Use inline overrides like `@TestPropertySource(properties = {"app.cache.enabled=false", "app.timeout=100"})` or load a file with `@TestPropertySource(locations = "classpath:test.properties")`.<br>These test values override normal application properties for that test context.
<!--ID: 1780580933201-->
END

START
Basic
`@Sql`: how do you seed test data?
Back: `@Sql("/test-data.sql")` runs the SQL script before the test method by default.<br>You can also clean up after the test with `@Sql(scripts = "/cleanup.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)`.<br>This is especially useful in `@DataJpaTest` scenarios.
<!--ID: 1780580933202-->
END

START
Basic
`@DirtiesContext`: when do you use it?
Back: `@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)` tells Spring to rebuild the application context after each test method.<br>Use it when a test mutates shared state like caches, bean singletons, or embedded infrastructure in a way rollback cannot undo.<br>It is expensive, so avoid it unless isolation truly requires it.
<!--ID: 1780580933204-->
END

START
Basic
How do `@ExtendWith(SpringExtension.class)` and `@ContextConfiguration` fit into Spring tests?
Back: `@ExtendWith(SpringExtension.class)` integrates JUnit 5 with the Spring TestContext framework.<br>`@ContextConfiguration(classes = {UserService.class, StubConfig.class})` loads a small hand-picked Spring context without a full Boot application.<br>Use them for focused Spring tests when `@SpringBootTest` would be too heavy.
<!--ID: 1780580933206-->
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