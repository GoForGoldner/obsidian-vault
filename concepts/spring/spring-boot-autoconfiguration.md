---
tags: [spring, spring-boot, auto-configuration]
category: spring
related: [spring-core, spring-web-mvc, spring-aop-testing]
---

## Description
Spring Boot auto-configuration is mostly a giant set of `@Configuration` classes guarded by `@Conditional*` annotations. Boot checks the classpath, existing beans, active environment, and external properties; if the right conditions match, it registers default beans. The value is not hidden magic but predictable conventions: defaults first, explicit application beans win, and configuration is externalized into typed properties objects instead of being hard-coded.

## Examples
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// `@SpringBootApplication` is shorthand for:
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(basePackages = "com.example")
class ApplicationBootstrap {}
```

```java
@ConfigurationProperties(prefix = "app.mail")
@Validated
public class MailProperties {
    @NotNull
    private String host;
    private int port = 587;
    private Duration timeout = Duration.ofSeconds(5);

    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    public Duration getTimeout() { return timeout; }
    public void setTimeout(Duration timeout) { this.timeout = timeout; }
}

@Configuration
@EnableConfigurationProperties(MailProperties.class)
class MailAutoConfiguration {
    @Bean
    @ConditionalOnClass(JavaMailSender.class)
    @ConditionalOnMissingBean
    MailClient mailClient(MailProperties props) {
        return new MailClient(props.getHost(), props.getPort(), props.getTimeout());
    }

    @Bean
    @ConditionalOnBean(DataSource.class)
    SchemaReporter schemaReporter(DataSource dataSource) {
        return new SchemaReporter(dataSource);
    }

    @Bean
    @ConditionalOnProperty(name = "feature.cache.enabled", havingValue = "true", matchIfMissing = false)
    CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users", "orders");
    }

    @Bean
    @ConditionalOnMissingClass("com.example.NoopMeterRegistry")
    MetricsBridge metricsBridge() {
        return new MetricsBridge();
    }

    @Bean
    @ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
    RequestTimingFilter requestTimingFilter() {
        return new RequestTimingFilter();
    }

    @Bean
    @ConditionalOnNotWebApplication
    BatchRunner batchRunner() {
        return new BatchRunner();
    }

    @Bean
    @ConditionalOnSingleCandidate(ObjectMapper.class)
    JsonPrinter jsonPrinter(ObjectMapper objectMapper) {
        return new JsonPrinter(objectMapper);
    }

    @Bean
    @ConditionalOnExpression("'${jobs.cleanup.enabled:true}' == 'true'")
    CleanupJob cleanupJob() {
        return new CleanupJob();
    }

    @Bean
    @ConditionalOnResource(resources = "classpath:banner.txt")
    BannerPrinter bannerPrinter() {
        return new BannerPrinter();
    }
}
```

```java
@Configuration
@EnableScheduling
@EnableAsync
class BackgroundWorkConfig {}

@Component
class MaintenanceJobs {
    @Scheduled(cron = "0 0 8 * * MON-FRI")
    public void sendDigestEmails() {
        System.out.println("weekday digest");
    }

    @Scheduled(fixedRate = 5000)
    public void pollQueue() {
        System.out.println("poll every 5 seconds regardless of completion");
    }

    @Scheduled(fixedDelay = 15000, initialDelay = 5000)
    public void cleanupAfterPreviousRunFinishes() {
        System.out.println("wait 15 seconds after the previous run ends");
    }

    @Async
    public CompletableFuture<String> rebuildSearchIndex() {
        return CompletableFuture.completedFuture("reindex complete");
    }
}
```

| Annotation | Real syntax | What it checks |
| --- | --- | --- |
| `@SpringBootApplication` | `@SpringBootApplication class Application {}` | Main Boot app entry point |
| `@SpringBootConfiguration` | `@SpringBootConfiguration class AppBootstrap {}` | Boot-flavored `@Configuration` |
| `@EnableAutoConfiguration` | `@EnableAutoConfiguration class AppBootstrap {}` | Import Boot's auto-configurations |
| `@ConfigurationProperties` | `@ConfigurationProperties(prefix = "app.mail")` | Bind external config to a typed object |
| `@EnableConfigurationProperties` | `@EnableConfigurationProperties(MailProperties.class)` | Register properties classes as beans |
| `@ConditionalOnClass` | `@ConditionalOnClass(JavaMailSender.class)` | Library exists on classpath |
| `@ConditionalOnMissingBean` | `@ConditionalOnMissingBean` | User did not already provide bean |
| `@ConditionalOnBean` | `@ConditionalOnBean(DataSource.class)` | Another bean already exists |
| `@ConditionalOnProperty` | `@ConditionalOnProperty(name = "feature.cache.enabled", havingValue = "true")` | Feature flag/property matches |
| `@ConditionalOnMissingClass` | `@ConditionalOnMissingClass("com.example.NoopMeterRegistry")` | Library/class is absent |
| `@ConditionalOnWebApplication` / `@ConditionalOnNotWebApplication` | `@ConditionalOnWebApplication(type = SERVLET)` | Servlet/reactive web app vs non-web app |
| `@ConditionalOnSingleCandidate` / `@ConditionalOnExpression` / `@ConditionalOnResource` | `@ConditionalOnSingleCandidate(ObjectMapper.class)` | Single bean candidate, SpEL condition, or resource presence |
| `@EnableScheduling` / `@Scheduled` | `@EnableScheduling` + `@Scheduled(fixedRate = 5000)` | Enable and declare scheduled jobs |
| `@EnableAsync` / `@Async` | `@EnableAsync` + `@Async` | Run methods on async executor threads |

## Related Topics
- [[spring-core]]
- [[spring-web-mvc]]
- [[spring-aop-testing]]

## Cards

```anki
START
Basic
What three annotations does `@SpringBootApplication` combine?
Back: `@SpringBootApplication` combines `@SpringBootConfiguration`, `@EnableAutoConfiguration`, and `@ComponentScan`.<br>Equivalent shape: `@SpringBootConfiguration @EnableAutoConfiguration @ComponentScan class ApplicationBootstrap {}`.<br>That means "this is the Boot config class, import auto-config, and scan this package tree".
<!--ID: 1780580933084-->
END

START
Basic
How does Spring Boot auto-configuration decide which beans to create?
Back: Boot uses `@Conditional*` annotations on `@Configuration` classes and `@Bean` methods.<br>Examples: `@ConditionalOnClass`, `@ConditionalOnBean`, `@ConditionalOnMissingBean`, and `@ConditionalOnProperty`.<br>If conditions match, Boot creates the bean; if you define your own bean, conditions like `@ConditionalOnMissingBean` make Boot back off.
<!--ID: 1780580933087-->
END

START
Basic
What's the difference between `@Value` and `@ConfigurationProperties` for external config?
Back: `@Value("${app.mail.host}")` injects a single property into one field.<br>`@ConfigurationProperties(prefix = "app.mail") class MailProperties { private String host; private int port; }` binds a whole config group into one typed object.<br>Use `@ConfigurationProperties` for grouped settings, validation, and cleaner code.
<!--ID: 1780580933089-->
END

START
Basic
`@ConfigurationProperties`: show the full pattern with validation.
Back: `@ConfigurationProperties(prefix = "app.mail") @Validated class MailProperties { @NotNull private String host; private int port = 587; }`.<br>Register it with `@EnableConfigurationProperties(MailProperties.class)`.<br>Then Boot binds `app.mail.host` and `app.mail.port` from `application.yml` or `application.properties`.
<!--ID: 1780580933091-->
END

START
Basic
`@ConditionalOnMissingBean`: why is it the key to auto-config?
Back: Auto-config uses `@Bean @ConditionalOnMissingBean MailClient mailClient(...) { ... }` so Boot supplies a default only when you did not already define one.<br>If your app declares its own `MailClient` bean, the auto-config method is skipped.<br>That is Boot's "opinionated defaults, easy overrides" model.
<!--ID: 1780580933093-->
END

START
Basic
`@Scheduled`: what are the three scheduling modes?
Back: Cron: `@Scheduled(cron = "0 0 8 * * MON-FRI")`.<br>Fixed rate: `@Scheduled(fixedRate = 5000)` starts every 5 seconds measured from the previous start time.<br>Fixed delay: `@Scheduled(fixedDelay = 5000)` waits 5 seconds after the previous execution finishes.<br>All require `@EnableScheduling`.
<!--ID: 1780580933095-->
END

START
Basic
`@Async`: how do you make a method run in a background thread?
Back: Mark the method `@Async public CompletableFuture<Result> process() { return CompletableFuture.completedFuture(result); }` and enable async execution with `@EnableAsync`.<br>The caller gets the `CompletableFuture` immediately.<br>Gotcha: `@Async` only works when the method is invoked through the Spring proxy, not from another method in the same class.
<!--ID: 1780580933098-->
END

START
Basic
`@ConditionalOnProperty`: how do you conditionally enable a feature?
Back: Use `@Bean @ConditionalOnProperty(name = "feature.cache.enabled", havingValue = "true", matchIfMissing = false) CacheManager cacheManager() { ... }`.<br>The bean is created only when the property exists and equals `true`.<br>`matchIfMissing` controls what happens when the property is absent.
<!--ID: 1780580933102-->
END

START
Basic
`@SpringBootConfiguration` vs `@Configuration`: what's the difference?
Back: `@SpringBootConfiguration` is a specialization of `@Configuration` used by Boot on the main application class.<br>`@SpringBootApplication` already includes it, so you rarely write it directly.<br>Regular `@Configuration` is still what you use for most custom config classes.
<!--ID: 1780580933105-->
END

START
Basic
How do the main `@Conditional*` annotations differ in practice?
Back: `@ConditionalOnClass(JavaMailSender.class)` checks the classpath.<br>`@ConditionalOnBean(DataSource.class)` requires another bean to exist.<br>`@ConditionalOnMissingClass("com.example.LegacyClient")` activates only when a class is absent.<br>`@ConditionalOnWebApplication` and `@ConditionalOnNotWebApplication` switch config based on app type.
<!--ID: 1780580933106-->
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