---
epoch: 1780754050936
modelKey: "deepseek-v4-flash|deepseek"
topic: "SpringBoot ConfigurationProperties Example"



tags:
  - copilot-conversation
---

**user**: can you give me an example of ConfigurationProperties annotation in SpingBoot?
[Timestamp: 2026/06/06 09:54:10]

**ai**: Sure! Here's a quick example of how to use `@ConfigurationProperties` in Spring Boot:

---

### 1. Define a POJO with the annotation and a prefix
```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.datasource")
public class DatasourceProperties {
    private String url;
    private String username;
    private String password;
    private int maxPoolSize = 10; // default value

    // getters and setters omitted for brevity
}
```

### 2. Set values in `application.yml` (or `application.properties`)
```yaml
app:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: admin
    password: secret
    max-pool-size: 20
```
> In `application.properties`:
> ```
> app.datasource.url=jdbc:postgresql://localhost:5432/mydb
> app.datasource.username=admin
> app.datasource.password=secret
> app.datasource.max-pool-size=20
> ```

### 3. Enable configuration properties (if not using `@SpringBootApplication`)
Add `@EnableConfigurationProperties(DatasourceProperties.class)` to a configuration class, or just mark the POJO with `@Component` (as above) – the auto‑scan picks it up.

### 4. Inject and use
```java
@Service
public class DataService {
    private final DatasourceProperties props;

    public DataService(DatasourceProperties props) {
        this.props = props;
    }

    public void connect() {
        System.out.println("Connecting to " + props.getUrl());
    }
}
```

---

**Key points:**
- Binds external configuration to a strongly‑typed Java object.
- Supports nested properties, lists, and maps.
- Works with YAML or `.properties` files.
- Use `@Validated` to enable Bean Validation (`@NotNull`, etc.) on the fields.

Let me know if you'd like a more advanced example (e.g., nested POJOs, immutable properties with a constructor, or using `@ConfigurationPropertiesScan`).
[Timestamp: 2026/06/06 09:54:22]

**user**: What is a POJO?
[Timestamp: 2026/06/06 09:55:28]

**ai**: ## What is a POJO?

**POJO** stands for **Plain Old Java Object**. It's a simple Java class that does **not** depend on any framework-specific libraries, interfaces, or annotations — just the basic Java language.

### Characteristics
- No required inheritance (`extends` / `implements`) from framework classes.
- No framework annotations (like `@Entity`, `@Component`, etc.) are required, though it's common to add them later.
- Typically has private fields with public getters/setters (or records in modern Java).
- Can be serialized, instantiated, and used anywhere.

### Example
```java
public class Person {
    private String name;
    private int age;

    public Person() {} // no-arg constructor desirable

    // getters & setters
}
```

This is a POJO. If you add `@Entity` and extend `JpaRepository`, it's still a POJO in spirit, but purists say once it's tied to a framework, it's no longer "plain".

> **Key idea:** POJO = Java object without external constraints. It's the foundation for Spring beans, JPA entities, DTOs, etc.

---

Added [[POJO]] under `concepts/general`. Let me know if you want to explore the relationship between POJOs and JavaBeans or records!
[Timestamp: 2026/06/06 09:55:43]

**user**: are only values bonded that match parameters from the class?
[Timestamp: 2026/06/06 09:56:15]

**ai**: Yes, by default, only the configuration properties whose **keys match the field names of the class** (after applying relaxed binding, e.g., `max-pool-size` → `maxPoolSize`) are bound.

### What happens with unmatched properties?
- **Unknown properties** (e.g., `app.datasource.foo` when the class has no `foo` field) are **silently ignored** by default.
- If you want to fail on unknown properties, set `ignoreUnknownFields = false`:
  ```java
  @ConfigurationProperties(prefix = "app.datasource", ignoreUnknownFields = false)
  ```
- **Missing properties** (expected ones that aren't in the config) leave the field at its default value (or `null` for objects). You can enforce mandatory fields with `@Validated` and `@NotNull`.

### Example
```yaml
app:
  datasource:
    url: jdbc:...
    username: admin
    unknownProp: xyz   # ⬅️ silently ignored unless ignoreUnknownFields=false
```

Only `url` and `username` (and any others defined in the POJO) are bound.

---

So yes — only values that match the class parameters are bound, and the rest are ignored unless you explicitly configure otherwise.
[Timestamp: 2026/06/06 09:56:27]