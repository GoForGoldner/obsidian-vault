---
tags: [spring, core, dependency-injection]
category: spring
related: [spring-boot-autoconfiguration, spring-web-mvc, spring-data-jpa]
---

## Description
Spring's IoC container manages beans and their dependencies so application code focuses on behavior instead of manual wiring. Stereotype annotations mark classes for component scanning, while `@Configuration` + `@Bean` give explicit control over bean creation. The main design questions are usually: what layer does this bean belong to, how should it be injected, when should it be created, and how long should it live?

## Examples
```java
@Component
class GenericHelper {}

@Service
class BillingService {}

@Repository
class InvoiceRepository {}

@Controller
class InvoicePageController {}

@Configuration
class AppConfig {
    @Bean
    @Primary
    PaymentClient stripeClient() {
        return new StripePaymentClient();
    }

    @Bean
    @Qualifier("paypal")
    PaymentClient paypalClient() {
        return new PaypalPaymentClient();
    }
}

@Service
class CheckoutService {
    private final PaymentClient paymentClient;

    CheckoutService(@Qualifier("paypal") PaymentClient paymentClient) {
        this.paymentClient = paymentClient;
    }
}
```

| Annotation | Why you'd use it | Main gotcha/distinction |
| --- | --- | --- |
| `@Component` | Generic bean discovered by scanning | Base stereotype for the others |
| `@Service` | Business/service-layer class | Mostly semantic; same scanning behavior as `@Component` |
| `@Repository` | Persistence/data-access class | Adds exception translation to `DataAccessException` |
| `@Controller` | MVC web controller | For web requests/views; `@RestController` is different |
| `@Configuration` + `@Bean` | Explicit bean factory methods | Best when third-party classes or conditional wiring are involved |
| `@Autowired` | Inject dependency | Prefer constructor injection over fields |
| `@Qualifier` / `@Primary` | Resolve multiple candidates | `@Qualifier` beats `@Primary` |
| `@Value` | Inject a single property | Good for one-off values, not grouped config |
| `@Scope` / `@Lazy` / `@Profile` | Control lifetime, creation time, environment | Useful, but overuse can make wiring harder to reason about |
| `@PostConstruct` / `@PreDestroy` | Init and cleanup hooks | Run after injection / before shutdown |
| `@EventListener` / `@DependsOn` / `@Order` / `@Import` / `@PropertySource` / `@Lookup` | Advanced container coordination | Reach for these when lifecycle or wiring needs become non-trivial |

```text
Bean lifecycle
1. Instantiate bean
2. Inject dependencies (@Autowired / constructor)
3. Run initialization (@PostConstruct)
4. Bean is ready for use
5. On shutdown, run cleanup (@PreDestroy)
6. Destroy bean

Common scopes
- singleton: one shared bean per container (default)
- prototype: new bean each lookup
- request: one bean per HTTP request
- session: one bean per HTTP session
```

## Related Topics
- [[spring-boot-autoconfiguration]]
- [[spring-web-mvc]]
- [[spring-data-jpa]]

## Cards

```anki
START
Basic
What's the difference between `@Component`, `@Service`, `@Repository`, and `@Controller`?
Back: All are `@Component` specializations, so Spring scans and registers them the same way. The difference is meaning and framework behavior: `@Service` signals business logic, `@Repository` marks data access and adds automatic exception translation, and `@Controller` is for the web layer. Use the most specific stereotype for clarity and the extra behavior it unlocks.
END

START
Basic
What's the difference between `@Autowired` field injection vs constructor injection, and which should you prefer?
Back: Prefer constructor injection. It makes dependencies explicit, supports immutable `final` fields, and lets you instantiate the class in plain unit tests without Spring. Field injection hides dependencies and relies on reflection. Since Spring 4.3, `@Autowired` is optional on a single constructor.
END

START
Basic
How do you resolve ambiguity when multiple beans of the same type exist?
Back: Use `@Primary` to make one bean the default, or `@Qualifier("name")` at the injection point to choose a specific bean. `@Qualifier` overrides `@Primary`. If the choice depends on environment, use `@Profile` so only the relevant bean is active.
END

START
Basic
What is the bean lifecycle order in Spring?
Back: Instantiate → inject dependencies → run `@PostConstruct` → bean is ready → run `@PreDestroy` before shutdown → destroy. Put initialization that depends on injected collaborators in `@PostConstruct`, and cleanup such as closing resources in `@PreDestroy`.
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