# Checkout fulfillment verification

Stripe Checkout completion grants paid access through
`public.fulfill_checkout_session(text, uuid, text, integer)`. The function writes
the payment and updates the user's plan/credits in one transaction. The Checkout
session ID is the unique order reference; replays return false without granting
more credits.

## Required database migrations

Apply `011_atomic_checkout_fulfillment.sql`, followed by
`012_checkout_payment_reference_unique.sql`. Migration 012 also repairs legacy
dashboard-created databases that lack the UNIQUE constraint declared in 001.
It can safely be reapplied. It never removes or merges payment rows; duplicate
non-null references must be investigated before applying it.

Creating the fulfillment function alone does not verify that it can run. Before
release, check the actual database has the unique constraint:

```sql
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conrelid = 'public.payments'::regclass and contype = 'u';
```

The result must include `UNIQUE (stripe_payment_id)`. Without a matching unique
constraint/index, the function's `ON CONFLICT (stripe_payment_id)` raises an error
and Stripe receives HTTP 500.

## Regression test

Run this only against a new, empty, disposable local/test database:

```sh
psql -X -v ON_ERROR_STOP=1 -d checkout_test -f tests/checkout-fulfillment.sql
```

The fixture deliberately starts without order-reference uniqueness, matching
the legacy production schema. It applies the repair twice, verifies first
purchases and additional credit purchases, and verifies Checkout replays produce
one payment row and no additional credits.

## Recovering a confirmed payment

1. In Stripe, confirm the live Checkout session is paid, has the expected product
   and amount, and has the correct `userId`/`plan` metadata.
2. Inspect the user's plan/credits and the matching `payments` row.
3. Repair the verified underlying error, then resend the same
   `checkout.session.completed` event to ResumeGov's endpoint only.
4. Confirm Stripe receives HTTP 200 and the database contains exactly one
   completed payment keyed by the Checkout session ID. For a first Analyst
   purchase, the account should be `basic` with 3 paid optimization credits.
5. Confirm a replay leaves that payment count and balance unchanged. A replay of
   the webhook does not create a new charge.

Purchase analytics are emitted only for newly fulfilled orders; delivery retries
must not be counted as additional purchases.
