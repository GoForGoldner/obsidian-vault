---
tags: [spring, jpa, database]
category: spring
related: [spring-core, spring-aop-testing, spring-web-mvc]
---

## Description
Spring Data JPA combines JPA mapping annotations with repository abstractions. The mapping annotations decide how your Java model becomes SQL tables, foreign keys, join tables, value objects, and inheritance hierarchies; repository annotations decide how queries, updates, transactions, and locking behave. Most bugs come from not knowing which side owns a relationship, using the wrong fetch/update pattern, or putting transaction boundaries in the wrong place.

## Examples
```java
@Entity
@Table(name = "users")
class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Lob
    private String biography;

    @Transient
    private String displayLabel;

    @Embedded
    private Address address;

    @ElementCollection
    @CollectionTable(name = "user_tags", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();

    @Version
    private Long version;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserProfile profile;

    @ManyToMany
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
}

@Embeddable
class Address {
    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "zip_code")
    private String zipCode;
}
```

```java
@Entity
@Table(name = "orders")
class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}

@Entity
@Table(name = "user_profiles")
class UserProfile {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 500)
    private String avatarUrl;
}

@Entity
@Table(name = "roles")
class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;
}
```

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "payment_type")
abstract class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long id;

    @Column(nullable = false)
    private BigDecimal amount;
}

@Entity
@DiscriminatorValue("CARD")
class CardPayment extends Payment {
    private String last4;
}

@Entity
@DiscriminatorValue("WIRE")
class WirePayment extends Payment {
    private String iban;
}
```

```java
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByStatusAndNameContainingOrderByNameAsc(UserStatus status, String name);

    long countByStatus(UserStatus status);

    boolean existsByEmail(String email);

    @Query("select u from User u left join fetch u.roles where u.id = :id")
    Optional<User> findWithRoles(@Param("id") Long id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update User u set u.status = :status where u.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") UserStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from User u where u.id = :id")
    Optional<User> findForUpdate(@Param("id") Long id);
}

@Service
class UserService {
    private final UserRepository userRepository;

    UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED, propagation = Propagation.REQUIRED)
    public void activateUser(Long id) {
        User user = userRepository.findForUpdate(id).orElseThrow();
        user.setStatus(UserStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public Optional<User> find(Long id) {
        return userRepository.findWithRoles(id);
    }
}
```

| Annotation | Real syntax | Purpose |
| --- | --- | --- |
| `@Entity` / `@Table` | `@Entity @Table(name = "users")` | Map class to table |
| `@Id` / `@GeneratedValue` / `@Column` | `@Id @GeneratedValue(strategy = IDENTITY)` | Primary key and column details |
| `@Transient` / `@Lob` / `@Temporal` / `@Enumerated` | `@Enumerated(EnumType.STRING)` | Special persistence behavior for fields |
| `@Embedded` / `@Embeddable` | `@Embedded private Address address;` | Inline value object columns |
| `@ElementCollection` | `@ElementCollection Set<String> tags;` | Persist simple values in collection table |
| `@OneToMany` / `@ManyToOne` / `@JoinColumn` | `@ManyToOne @JoinColumn(name = "user_id")` | Foreign-key relationship mapping |
| `@OneToOne` / `@MapsId` | `@OneToOne @MapsId @JoinColumn(name = "user_id")` | Shared primary-key one-to-one |
| `@ManyToMany` / `@JoinTable` | `@ManyToMany @JoinTable(name = "user_roles", ...)` | Join-table many-to-many mapping |
| `@Inheritance` / `@DiscriminatorColumn` / `@DiscriminatorValue` | `@Inheritance(strategy = SINGLE_TABLE)` | Entity inheritance strategy |
| `@Query` / `@Modifying` / `@Lock` | `@Modifying @Query("update User u ...")` | Custom queries, bulk updates, locking |
| `@Transactional` / `@Version` | `@Transactional(readOnly = true)` | Transaction boundaries and optimistic locking |

## Related Topics
- [[spring-core]]
- [[spring-aop-testing]]
- [[spring-web-mvc]]

## Cards

```anki
START
Basic
What's the difference between `@OneToMany` and `@ManyToOne`, and which side owns the relationship?
Back: `@ManyToOne` is usually the owning side because it holds the foreign key column, e.g. `@ManyToOne @JoinColumn(name = "user_id") private User user;`.<br>`@OneToMany(mappedBy = "user") private List<Order> orders;` is normally the inverse side.<br>Changes to the owning side are what actually update the relationship in the database.
<!--ID: 1780580933133-->
END

START
Basic
What does `@Transactional` do and where should you put it?
Back: `@Transactional` wraps a method in a database transaction so multiple reads/writes succeed or fail together.<br>Put it on service-layer methods such as `@Transactional public void activateUser(Long id) { ... }`, not controllers.<br>Use `readOnly = true` for read paths and configure `propagation`/`isolation` only when needed.
<!--ID: 1780580933134-->
END

START
Basic
How does `@Version` enable optimistic locking?
Back: Add a version column with `@Version private Long version;`.<br>JPA includes the version in the update `where` clause, so if another transaction already changed the row, your update affects 0 rows and an optimistic locking exception is thrown.<br>This prevents silent lost updates without holding a DB lock for the whole transaction.
<!--ID: 1780580933136-->
END

START
Basic
When do you use `@Query` vs derived query methods in Spring Data?
Back: Use derived names for simple queries like `findByStatusAndNameContainingOrderByNameAsc(...)`.<br>Use `@Query("select u from User u left join fetch u.roles where u.id = :id")` when joins, fetches, projections, or complexity make the method name ugly.<br>Add `@Modifying` for update/delete JPQL.
<!--ID: 1780580933138-->
END

START
Basic
`@Entity` + `@Table`: what annotations do you need to map a class to a table?
Back: A minimal mapping looks like `@Entity @Table(name = "users") class User { @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id; @Column(nullable = false, length = 100) String name; }`.<br>`@Entity` makes the class JPA-managed, `@Table` customizes the table name, and `@Column` customizes column details.
<!--ID: 1780580933140-->
END

START
Basic
`@GeneratedValue`: what are the 4 strategies?
Back: `GenerationType.IDENTITY` uses DB auto-increment.<br>`GenerationType.SEQUENCE` uses a database sequence and is usually best for Hibernate batching.<br>`GenerationType.TABLE` simulates a sequence with a table.<br>`GenerationType.AUTO` lets the provider choose.<br>`IDENTITY` is simple but can reduce batch insert efficiency.
<!--ID: 1780580933142-->
END

START
Basic
`@Enumerated`: how do you persist enums?
Back: Use `@Enumerated(EnumType.STRING) private UserStatus status;` so the enum name is stored as text.<br>`EnumType.ORDINAL` stores the integer position, which is fragile because reordering enum constants corrupts meaning.<br>Use `STRING` almost always.
<!--ID: 1780580933144-->
END

START
Basic
`@Embedded` / `@Embeddable`: how do you use value objects?
Back: Define the value object with `@Embeddable class Address { String street; String city; }` and embed it with `@Entity class User { @Embedded Address address; }`.<br>The address fields are stored in the same table as `User`, not a separate table.<br>This is a clean way to group related columns.
<!--ID: 1780580933146-->
END

START
Basic
`@ManyToMany` with `@JoinTable`: how do you map it?
Back: Example: `@ManyToMany @JoinTable(name = "student_courses", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "course_id")) Set<Course> courses;`.<br>The side declaring `@JoinTable` owns the mapping and writes the join table rows.
<!--ID: 1780580933148-->
END

START
Basic
`@Inheritance`: what are the 3 JPA strategies?
Back: `SINGLE_TABLE` stores the whole hierarchy in one table and usually uses `@DiscriminatorColumn`.<br>`JOINED` uses one table per class and joins when reading.<br>`TABLE_PER_CLASS` gives each concrete class its own full table.<br>`SINGLE_TABLE` is often fastest and simplest for small hierarchies.
<!--ID: 1780580933151-->
END

START
Basic
Derived query methods: what naming conventions does Spring Data support?
Back: Common prefixes are `findBy`, `countBy`, `existsBy`, and `deleteBy`.<br>You can chain operators like `And`, `Or`, `Between`, `LessThan`, `GreaterThan`, `Containing`, `In`, and `OrderBy`.<br>Example: `List<User> findByAgeGreaterThanAndNameContainingOrderByNameAsc(int age, String name);`.
<!--ID: 1780580933153-->
END

START
Basic
`@Lock`: how do you use pessimistic locking?
Back: Use `@Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select u from User u where u.id = :id") Optional<User> findForUpdate(@Param("id") Long id);`.<br>The database row stays locked until the surrounding transaction commits or rolls back.<br>Use it for high-contention updates when optimistic retries are too expensive.
<!--ID: 1780580933155-->
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