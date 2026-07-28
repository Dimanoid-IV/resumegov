# Paid-flow E2E environment

This environment is intentionally isolated from `www.resumegov.com`.

## Safety invariants

- It runs in a separate Vercel project.
- Stripe uses a temporary sandbox and test prices.
- Supabase uses a dedicated test project.
- Checkout is disabled unless `BILLING_TEST_MODE=true`.
- Preview checkout rejects live Stripe keys.
- Preview checkout rejects the production ResumeGov hostname.
- Preview checkout rejects any Supabase URL that does not exactly match `TEST_SUPABASE_URL`.
- `/api/test/readiness` returns `404` in production.

## Test products

- Analyst: `$19.99` one-time, 3 optimization credits.
- Professional: `$39.99/month`, unlimited optimizations.

The non-secret test Price IDs are recorded in `docs/paid-test.env.example`.

## E2E checklist

1. Create an account in the test Supabase project.
2. Run a free analysis and confirm the result page opens.
3. Buy Analyst with Stripe test card `4242 4242 4242 4242`.
4. Confirm the webhook changes the plan to `basic` and grants exactly 3 credits.
5. Optimize the analyzed resume and confirm one credit is consumed.
6. Confirm the optimized text is stored and downloadable as DOCX.
7. Buy Professional in a fresh test account.
8. Confirm Stripe creates a subscription rather than a one-time payment.
9. Confirm the webhook changes the plan to `pro` and grants unlimited credits.
10. Cancel the Stripe test subscription and verify the application handles the resulting webhook.

Never use a real card or production user in this environment.
