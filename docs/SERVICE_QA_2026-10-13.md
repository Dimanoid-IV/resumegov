# ResumeGov customer-flow audit — 2026-10-13

## Fixed

- Cached optimization could be read before verifying analysis ownership. Ownership now precedes every cached-result read.
- Saving a rewrite and spending credit were separate operations. Migration 013 locks the user balance, checks ownership and plan, saves and charges atomically, and reuses a unique result per analysis. Production migration applied before code deployment.
- Legacy workflow/analyze endpoints bypassed canonical quotas and/or paid safety checks. They now delegate to canonical handlers.
- Legacy bullet relevance used mismatched requirement keys and randomized scores. Uses current keys, explicit ownership, and deterministic scores.
- Valid concise resumes were arbitrarily capped by word count; risk was also missing from the results query. Evidence scores no longer have arbitrary length caps. Word count is a layout estimate, not a universal minimum/maximum or eligibility test.
- Lightweight factual review falsely rejected explicit source facts. Paid editor, repair, and reviewer now use available `gpt-4.1`; review fails closed on malformed shape. Findings are readable strings and include missing critical facts. Applicant review remains necessary.
- Network failures could leave upload/checkout progress stuck or erase drafts. Upload inputs survive until success, with one-hour draft expiry; ambiguous failures tell users to inspect saved results before retrying.
- DOCX uses US Letter, 0.5-inch margins, 10.5pt Arial body / 14pt headings, strips Markdown markers, and retains factual source content.
- Checkout metadata from the legacy Stripe endpoint now matches fulfillment plan names; refund resolution supports both durable Checkout IDs and historical PaymentIntent IDs, with idempotency.
- Removed unimplemented KSA/priority-support sales promises and clarified lexical keyword coverage versus actual qualification evidence.
- Updated compatible dependencies including Next.js 16.4.0 and XML/document transitive security fixes. No forced downgrades.

## Verification

- Automated unit/route tests: 24 passing; authorization, checkout, subscription state, refunds (mocks only), scoring, DOCX, legacy quotas and deterministic relevance.
- Local PostgreSQL migration regression: migration twice; finite/unlimited credits, no-credit/free/unowned rejection, replay, server-only RPC permission.
- Real OpenAI and production Supabase integration through local Next.js: isolated synthetic QA account, authenticated free analysis, free-plan rewrite block, paid rewrite after fixture credit, persisted results page, one-credit spending, repeated result reuse, missing/unowned ID rejection.
- Two concurrent production database persistence calls for that same synthetic analysis returned one result and consumed one credit.
- Synthetic TXT/DOCX extraction, valid rendered PDF extraction, and malformed PDF rejection tested against actual routes.
- Exported actual application DOCX rendered with bundled LibreOffice and inspected visually. The first 447-word example rendered to two pages; later improved example to one page. Page count is example-specific, not a guarantee for all resumes.
- QA accounts removed after each run. No customer resume was used, no buyer credit was spent, and no Stripe charge/refund was made during this audit.
- Production build and TypeScript check passed. Changed application code linted; pre-existing internal checkout navigation warning is not a build failure.

## Limits / remaining work

- No finite audit proves every future AI output correct. Applicant must review and verify the final resume, actual rendered page count and vacancy-specific instructions.
- Actual subscription renewal, cancellation and financial refunds were not performed; covered by regression tests, not live financial actions. Earlier real Analyst purchase fulfillment was recovered and replay-tested separately.
- Magic-link delivery and password-reset email deliverability were not exercised end-to-end in this run.
- Successful credit activation must be confirmed from profile/backend, not inferred solely from a success URL. Existing generic upgrade banner remains URL-triggered; optimization itself checks the actual balance.
- GA4 Measurement Protocol secret was absent at audit time; server-side purchase analytics is not yet fully configured.
- `npm audit` still reports development-tool glob vulnerabilities and mammoth CLI's `sprintf-js` chain. Suggested fixes force incompatible downgrades; no such downgrade applied. This is not a complete security audit.

Manual integration runner: `tests/quality/customer-flow.ts`. It creates and removes only its own synthetic account, never uses customer accounts or Stripe charges. Requires existing environment credentials; outputs are ignored under `.qa-output/`.
