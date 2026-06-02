---
tags: [system-design, interview-prep]
---

# Design a Payment System (like Stripe)

**Scale:** Billions of transactions/year — zero tolerance for double charges

> [!tip]- Guidance — expand if stuck
>
> **Clarify:** Card payments only or also bank transfers, wallets? Refunds? Recurring billing?
>
> **The hard problem — exactly-once payment processing:**
> Network failures cause retries. Without idempotency, the user gets charged twice.
>
> **Solution — idempotency keys:**
> Client generates a UUID per payment attempt. Server stores `(idempotency_key → result)`. On duplicate request, return stored result without re-charging.
>
> **Core components:**
> 1. **Payment API** — validates request, stores idempotency key, enqueues payment job
> 2. **Payment processor** — calls card network via acquiring bank. Retries with exponential backoff.
> 3. **Ledger** — append-only log of every financial transaction. Never update or delete — add a compensating entry for refunds.
> 4. **Wallet service** — current balance = sum of all ledger entries (or cached + incrementally updated)
> 5. **Webhook service** — notifies merchants of payment outcomes asynchronously
>
> **Double-entry bookkeeping:** Every transaction has a debit and a credit. Sum of all ledger entries always equals zero. Makes auditing reliable.
