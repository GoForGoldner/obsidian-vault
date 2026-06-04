---
tags: [spring, core, dependency-injection]
category: spring
related: [spring-boot-autoconfiguration, spring-web-mvc, spring-data-jpa]
---

## Description
Spring Core is about how the container discovers objects, creates them, injects collaborators, and manages lifecycle. The most important annotation families are stereotypes (`@Component`, `@Service`, `@Repository`, `@Controller`), explicit factory methods (`@Configuration` + `@Bean`), dependency injection (`@Autowired`, constructor parameters, `@Qualifier`, `@Primary`), bean lifecycle (`@PostConstruct`, `@PreDestroy`, `@Lazy`, `@DependsOn`), and environment/wiring controls (`@Profile`, `@PropertySource`, `@Import`, `@Value`, `@Lookup`).

## Examples
```java
@Component
class IdGenerator {
    String nextId() {
        return UUID.randomUUID().toString();
    }
}

@Service
class CheckoutService {
    private final PaymentClient paymentClient;
    private final OrderRepository orderRepository;

    CheckoutService(@Qualifier("paypalClient") PaymentClient paymentClient,
                    OrderRepository orderRepository) {
        this.paymentClient = paymentClient;
        this.orderRepository = orderRepository;
    }

    void checkout(Order order) {
        paymentClient.charge(order.total());
        orderRepository.save(order);
    }
}

@Repository
class OrderRepository {
    private final JdbcTemplate jdbcTemplate;

    OrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    void save(Order order) {
        jdbcTemplate.update("insert into orders(id, total) values (?, ?)", order.id(), order.total());
    }
}

@Controller
class OrderPageController {
    private final CheckoutService checkoutService;

    OrderPageController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @GetMapping("/orders/{id}")
    String show(@PathVariable String id, Model model) {
        model.addAttribute("orderId", id);
        return "orders/detail";
    }
}
```

```java
@Component
class FieldInjectedExample {
    @Autowired
    private OrderRepository orderRepository;
}

@Component
class ConstructorInjectedExample {
    private final OrderRepository orderRepository;

    ConstructorInjectedExample(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}

@Configuration
@PropertySource("classpath:payment.properties")
@Import({MessagingConfig.class, MetricsConfig.class})
class AppConfig {
    @Bean
    @Primary
    PaymentClient stripeClient(@Value("${payment.stripe.key:dev-key}") String apiKey) {
        return new StripePaymentClient(apiKey);
    }

    @Bean
    @Qualifier("paypalClient")
    @Lazy
    PaymentClient paypalClient(@Value("${payment.paypal.url:https://sandbox.paypal.example}") String baseUrl) {
        return new PaypalPaymentClient(baseUrl);
    }

    @Bean
    @Profile("dev")
    Clock devClock() {
        return Clock.fixed(Instant.parse("2024-01-01T00:00:00Z"), ZoneOffset.UTC);
    }

    @Bean
    @Profile("prod")
    Clock prodClock() {
        return Clock.systemUTC();
    }
}
```

```java
@Component("startupLogger")
class StartupLogger {
    @PostConstruct
    void init() {
        System.out.println("Starting application...");
    }

    @PreDestroy
    void shutdown() {
        System.out.println("Shutting down application...");
    }
}

@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
class AuditContext {
    private final UUID id = UUID.randomUUID();

    UUID id() {
        return id;
    }
}

@Component
abstract class ReportService {
    @Lookup
    protected abstract AuditContext auditContext();

    void generateReport() {
        AuditContext ctx = auditContext();
        System.out.println("Using fresh prototype " + ctx.id());
    }
}

@Component
@DependsOn("startupLogger")
class OrderCreatedListener {
    @Order(1)
    @EventListener
    public void handle(OrderCreatedEvent event) {
        System.out.println("Order received: " + event.orderId());
    }
}

@Service
class OrderPublisher {
    private final ApplicationEventPublisher publisher;

    @Value("${app.timeout:5000}")
    private int timeout;

    OrderPublisher(ApplicationEventPublisher publisher) {
        this.publisher = publisher;
    }

    void publish(Order order) {
        publisher.publishEvent(new OrderCreatedEvent(order.id()));
    }
}
```

| Annotation | Real syntax | Main use |
| --- | --- | --- |
| `@Component` | `@Component class IdGenerator {}` | Generic scanned bean |
| `@Service` | `@Service class CheckoutService {}` | Business logic bean |
| `@Repository` | `@Repository class OrderRepository {}` | Data access + exception translation |
| `@Controller` | `@Controller class OrderPageController {}` | MVC controller returning views |
| `@Configuration` + `@Bean` | `@Bean @Primary PaymentClient stripeClient()` | Explicit bean creation for third-party or custom wiring |
| `@Autowired` | `@Autowired private OrderRepository repo;` | Inject dependency, usually avoided on fields in favor of constructors |
| `@Qualifier` / `@Primary` | `@Qualifier("paypalClient") PaymentClient client` | Choose among same-type beans |
| `@Value` | `@Value("${app.timeout:5000}") private int timeout;` | Inject one property or SpEL value |
| `@Scope` | `@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)` | Change bean lifetime |
| `@Lazy` | `@Lazy PaymentClient paypalClient()` | Defer bean creation until first use |
| `@Profile` | `@Profile("prod") Clock prodClock()` | Activate beans only for selected environments |
| `@PostConstruct` / `@PreDestroy` | `@PostConstruct void init()` | Run init/cleanup callbacks |
| `@EventListener` / `@Order` | `@Order(1) @EventListener void handle(OrderCreatedEvent e)` | React to application events with ordering |
| `@PropertySource` / `@Import` / `@DependsOn` / `@Lookup` | `@PropertySource(...)`, `@Import(...)`, `@DependsOn(...)`, `@Lookup` | Advanced wiring, startup ordering, and scoped lookup |

```text
Bean lifecycle
1. Instantiate bean or call @Bean factory method
2. Inject constructor, field, or setter dependencies
3. Resolve @Value properties and proxies such as @Lazy
4. Run initialization callbacks such as @PostConstruct
5. Bean is available for use
6. On shutdown, run @PreDestroy for singleton beans

Common scopes
- singleton: default, one bean per application context
- prototype: new bean every lookup or injection point resolution
- request: one bean per HTTP request
- session: one bean per HTTP session
- application: one bean per ServletContext
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
Back: All are `@Component` specializations, so component scanning registers them as beans.<br>`@Component class GenericHelper {}` is generic.<br>`@Service class BillingService {}` marks business logic.<br>`@Repository class InvoiceRepository {}` marks persistence code and enables exception translation.<br>`@Controller class InvoicePageController {}` handles MVC requests/views.
END

START
Basic
What's the difference between `@Autowired` field injection vs constructor injection, and which should you prefer?
Back: Prefer constructor injection: `class CheckoutService { private final OrderRepository repo; CheckoutService(OrderRepository repo) { this.repo = repo; } }`.<br>Field injection hides dependencies: `@Autowired private OrderRepository repo;`.<br>Constructor injection supports `final` fields, easier tests, and clearer required dependencies. `@Autowired` is optional on a single constructor.
END

START
Basic
How do you resolve ambiguity when multiple beans of the same type exist?
Back: Mark one bean as default with `@Primary`: `@Bean @Primary PaymentClient stripeClient() { ... }`.<br>Pick a specific bean with `@Qualifier`: `CheckoutService(@Qualifier("paypalClient") PaymentClient client) { ... }`.<br>`@Qualifier` beats `@Primary`. Use `@Profile("prod")` if the choice depends on environment.
END

START
Basic
What is the bean lifecycle order in Spring?
Back: Instantiate bean or call `@Bean` method → inject dependencies and `@Value` properties → run `@PostConstruct` → bean is ready → on shutdown run `@PreDestroy` for singleton beans → destroy bean.<br>Put init that needs injected collaborators in `@PostConstruct`; put cleanup like closing clients in `@PreDestroy`.
END

START
Basic
`@Value` syntax: how do you inject a property with a default value?
Back: Use `@Value("${app.timeout:5000}") private int timeout;`.<br>The `:5000` part is the fallback if `app.timeout` is missing.<br>You can also inject SpEL, e.g. `@Value("#{systemProperties['user.home']}") private String home;`.
END

START
Basic
`@Scope`: what are the available scopes and how do you declare prototype?
Back: Declare prototype with `@Component @Scope("prototype") class PrototypeBean {}` or `@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)`.<br>Common scopes are `singleton` (default), `prototype`, `request`, `session`, and `application`.<br>Prototype means Spring returns a new instance on each lookup/injection resolution.
END

START
Basic
`@Lazy`: what does it do and when would you use it?
Back: `@Component @Lazy class ExpensiveService {}` delays bean creation until first requested.<br>You can also lazy-inject a dependency: `@Autowired @Lazy private ExpensiveService service;`.<br>Use it for expensive startup work or to break certain circular dependency situations.
END

START
Basic
`@EventListener`: how do you publish and listen to application events?
Back: Publish with `applicationEventPublisher.publishEvent(new OrderCreatedEvent(order));`.<br>Listen with `@EventListener public void handle(OrderCreatedEvent e) { ... }`.<br>The listener method parameter type decides which event it receives, and `@Order(1)` controls listener ordering.
END

START
Basic
`@PostConstruct` vs constructor: when do you use each?
Back: The constructor runs when the bean is instantiated: `CheckoutService(PaymentClient client) { this.client = client; }`.<br>`@PostConstruct void init() { client.warmUp(); }` runs after dependency injection is complete.<br>Use `@PostConstruct` when init logic depends on injected collaborators; with constructor injection, simple setup often belongs in the constructor.
END

START
Basic
`@PropertySource`: how do you load custom properties?
Back: Put it on a configuration class: `@Configuration @PropertySource("classpath:custom.properties") class AppConfig {}`.<br>Then read values with `@Value("${custom.key}")` or `environment.getProperty("custom.key")`.<br>It adds an extra properties file into Spring's `Environment`.
END

START
Basic
`@Lookup`: how do you inject a prototype bean into a singleton?
Back: Use an abstract lookup method: `@Component abstract class MySingleton { @Lookup protected abstract PrototypeBean getPrototype(); }`.<br>Spring overrides that method at runtime and returns a fresh prototype each call.<br>This solves the singleton-needs-new-prototype-instance problem.
END

START
Basic
How do `@Profile`, `@Import`, and `@DependsOn` change bean wiring?
Back: `@Profile("dev") @Bean Clock devClock()` activates only in the `dev` profile.<br>`@Import({MessagingConfig.class, MetricsConfig.class})` pulls in other `@Configuration` classes.<br>`@DependsOn("startupLogger")` forces one bean to initialize after another when startup order matters.
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