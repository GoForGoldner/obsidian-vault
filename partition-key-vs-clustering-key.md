---
tags: [database, cassandra, distributed-systems]
category: system-design/database
related: [primary-key, data-modeling, cassandra-internals]
---

## Description
In column‑family databases (Cassandra, ScyllaDB), the primary key is a composite of the **partition key** (decides which node stores the row) and optionally one or more **clustering columns** (decides the sort order of rows within a partition). They solve different problems: distribution vs. ordering.

## Examples
- `PRIMARY KEY ((user_id), order_time)` → partition key = `user_id` (all of Alice’s orders on one node), clustering key = `order_time` (orders sorted by time within her partition).
- `PRIMARY KEY ((id))` → partition key = `id`, no clustering — each row is its own partition.

## Related Topics
- [[primary-key]]
- [[data-modeling]]
- [[cassandra-internals]]

## Cards

START
Basic
Scenario: You have a table `PRIMARY KEY ((user_id), order_id)`.  
Is `order_id` the partition key or the clustering key?
Back: Clustering key. The partition key is `user_id` (inside the extra parentheses).
END

START
Basic
If the primary key is `PRIMARY KEY ((a, b), c, d)`, how many clustering columns are there?
Back: Two: `c` and `d`. The partition key is the composite `(a, b)`.
END

START
Concept
Why can’t a column be both the partition key and a clustering column?
Back: Because the partition key determines which node stores the row, while the clustering key determines order within that partition. A single column would force each row into its own partition (since values are unique), making clustering irrelevant.
END