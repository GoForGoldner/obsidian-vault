---
epoch: 1780760800941
modelKey: "deepseek-v4-flash|deepseek"
topic: "JPA SINGLE_TABLE vs JOINED"



tags:
  - copilot-conversation
---

**user**: Explain the difference between these and when I would see JPA: SINGLE_TABLE stores the whole hierarchy in one table and usually uses @DiscriminatorColumn.
JOINED uses one table per class and joins when reading.
TABLE_PER_CLASS gives each concrete class its own full table
[Timestamp: 2026/06/06 11:46:40]

**ai**: Great question — these three JPA inheritance strategies have very different trade-offs for performance, schema design, and querying.

**SINGLE_TABLE**  
All classes in the hierarchy map to one table. A discriminator column (e.g., `DTYPE`) tells JPA which subclass a row represents.  
- *Pros*: Fast reads (single table, no joins), simple schema.  
- *Cons*: Columns for subclasses must be nullable (since not every row uses them). The table can become wide, and constraints like `NOT NULL` are hard to enforce at the DB level.  
- *Use when*: The hierarchy is shallow, most columns are shared, and read performance is critical.

**JOINED**  
One table per class (abstract parent and each concrete subclass). Only common fields are in the parent table; subclass-specific fields go in their own table. JPA joins on the primary key when fetching a subclass.  
- *Pros*: Normalized schema, no nullable columns, good referential integrity.  
- *Cons*: Reads require joins (could be slow for deep hierarchies or many rows), inserts often need multiple statements.  
- *Use when*: Data integrity is important, the hierarchy is complex, or you need to query only the parent fields often.

**TABLE_PER_CLASS**  
Each concrete class gets its own full table containing all fields (including inherited ones). The parent class has no table.  
- *Pros*: No joins needed for concrete class queries. Each table is self-contained.  
- *Cons*: Polymorphic queries (`SELECT e FROM Animal e`) become **unions** over all tables, which can be slow. Schema duplication violates DRY.  
- *Use when*: You rarely query across the whole hierarchy and want each concrete type to be independent.

---

### When you "see" each strategy

- **SINGLE_TABLE** is the default for Hibernate if you don't specify `@Inheritance`. You'll see it in legacy code or simple enums/message types.  
- **JOINED** is common in properly normalized enterprise schemas where you want foreign keys to work cleanly.  
- **TABLE_PER_CLASS** is rare because of the performance penalty on polymorphic queries. You might see it when mapping legacy databases or when the types are truly disjoint.

Added [[jpa-inheritance-strategies]] in `concepts/database/` with three Anki cards for you.
[Timestamp: 2026/06/06 11:46:58]