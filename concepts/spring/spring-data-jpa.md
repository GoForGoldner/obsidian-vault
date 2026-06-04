---
tags: [spring, jpa, database]
category: spring
related: [spring-core, spring-aop-testing, spring-web-mvc]
---

## Description
Spring Data JPA maps objects to relational tables and lets repositories express many queries declaratively. The high-value concepts are ownership of relationships, how entity shape affects SQL, where transaction boundaries belong, and when convenience features like derived queries stop being expressive enough. Most JPA pain comes from not knowing which side owns persistence or from letting persistence concerns leak out of the service layer.

## Examples
```java
@Entity
@Table(name = "posts")
class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Version
    private Long version;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
}

@Entity
@Table(name = "comments")
class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Enumerated(EnumType.STRING)
    private CommentStatus status;
}
```

```java
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTitleContaining(String keyword);

    @Lock(LockModeType.OPTIMISTIC)
    Optional<Post> findWithLockingById(Long id);

    @Query("select c from Comment c where c.post.id = :postId and c.status = :status")
    List<Comment> findComments(@Param("postId") Long postId, @Param("status") CommentStatus status);

    @Modifying
    @Query("update Comment c set c.status = :status where c.post.id = :postId")
    int bulkUpdateStatus(@Param("postId") Long postId, @Param("status") CommentStatus status);
}

@Service
class PostService {
    @Transactional
    public void updatePost(...) {
        // load, modify, commit atomically
    }
}
```

| Annotation area | What to watch |
| --- | --- |
| `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column` | Map class/fields to table structure |
| `@OneToMany`, `@ManyToOne`, `@OneToOne`, `@ManyToMany`, `@JoinColumn`, `@JoinTable` | Understand owning side and foreign-key placement |
| `@Embedded`, `@Embeddable`, `@ElementCollection` | Good for value objects, but can create hidden table complexity |
| `@Transient`, `@Lob`, `@Temporal`, `@Enumerated` | Control persistence shape for special field types |
| `@Inheritance`, `@DiscriminatorColumn`, `@DiscriminatorValue` | Inheritance is possible, but often adds query tradeoffs |
| `@Transactional`, `@Lock`, `@Version` | Protect consistency and concurrency |

## Related Topics
- [[spring-core]]
- [[spring-aop-testing]]
- [[spring-web-mvc]]

## Cards

```anki
START
Basic
What's the difference between `@OneToMany` and `@ManyToOne`, and which side owns the relationship?
Back: `@ManyToOne` is usually the owning side because it holds the foreign key. `@OneToMany` is typically the inverse side with `mappedBy`. In a `Post`-`Comment` relationship, `Comment` owns persistence through `post_id`, so changing that side is what actually updates the relationship in the database.
END

START
Basic
What does `@Transactional` do and where should you put it?
Back: It wraps a method in a database transaction so a group of reads/writes succeeds or fails together. Put it on service-layer methods, where business operations begin and end, not on controllers. `readOnly = true` is a useful optimization hint for query-only use cases.
END

START
Basic
How does `@Version` enable optimistic locking?
Back: A version column is read with the entity and incremented on update. If two transactions both read version 1, the first update succeeds and changes the row to version 2; the second update fails because its `where version = 1` no longer matches. That prevents silent lost updates without holding a database lock the whole time.
END

START
Basic
When do you use `@Query` vs derived query methods in Spring Data?
Back: Derived method names are best for simple, readable queries like `findByStatusOrderByCreatedAtDesc`. Use `@Query` when the query becomes too complex, needs joins/aggregations, or would become unreadable as a method name. Add `@Modifying` for update/delete JPQL and `@Param` for clarity with named parameters.
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