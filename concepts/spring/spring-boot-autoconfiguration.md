---
tags: [spring, spring-boot, auto-configuration]
category: spring
related: [spring-core, spring-web-mvc, spring-aop-testing]
---

## Description
Spring Boot auto-configuration creates sensible defaults by looking at the classpath, external properties, and beans you already defined. The key idea is not magic but conditional configuration: Boot contributes beans when the app looks like it needs them and backs off when you provide your own. That makes the main design question: when should you accept Boot defaults versus make configuration explicit?

## Examples
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// expands conceptually to:
@Configuration
@EnableAutoConfiguration
@ComponentScan
class ApplicationConfig {}
```

```java
@ConfigurationProperties(prefix = "app.mail")
public class MailProperties {
    private String host;
    private int port;
    private Duration timeout;
    // getters/setters
}

@Configuration
@EnableConfigurationProperties(MailProperties.class)
class MailConfig {
    @Bean
    @ConditionalOnMissingBean
    MailClient mailClient(MailProperties props) {
        return new MailClient(props.getHost(), props.getPort(), props.getTimeout());
    }
}
```

| Conditional annotation | What question it answers |
| --- | --- |
| `@ConditionalOnClass` | Is a required library on the classpath? |
| `@ConditionalOnMissingBean` | Has the app already defined this bean itself? |
| `@ConditionalOnBean` | Should this bean exist only if another bean already exists? |
| `@ConditionalOnProperty` | Is a feature flag/property enabled? |
| `@ConditionalOnMissingClass` | Should config activate only when some library is absent? |
| `@ConditionalOnWebApplication` | Are we running in a web app at all? |

```java
@EnableScheduling
@EnableAsync
@Configuration
class BackgroundWorkConfig {}

@Component
class CleanupJobs {
    @Scheduled(cron = "0 0 * * * *")
    public void cleanup() {}

    @Async
    public CompletableFuture<Void> reindex() {
        return CompletableFuture.completedFuture(null);
    }
}
```

## Related Topics
- [[spring-core]]
- [[spring-web-mvc]]
- [[spring-aop-testing]]

## Cards

```anki
START
Basic
What three annotations does `@SpringBootApplication` combine?
Back: `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. Together they say: this class can define beans, Boot should contribute conditional defaults, and Spring should scan this package tree for components.
END

START
Basic
How does Spring Boot auto-configuration decide which beans to create?
Back: It uses `@Conditional*` annotations to ask questions like: is a library on the classpath, does a property enable this feature, and has the app already defined a bean of this type? Auto-configuration is meant to provide defaults, so your explicit `@Bean` definitions usually win through conditions like `@ConditionalOnMissingBean`.
END

START
Basic
What's the difference between `@Value` and `@ConfigurationProperties` for external config?
Back: `@Value("${key}")` injects one property at a time, which is fine for simple cases but scatters configuration across classes. `@ConfigurationProperties` binds a whole prefix into a typed object, which is better for related settings, validation, and IDE support. Prefer `@ConfigurationProperties` for real application config.
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