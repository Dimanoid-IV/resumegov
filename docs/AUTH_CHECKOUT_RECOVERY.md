# Email login and checkout recovery — 2026-11-15

## Confirmed failure

A synthetic account and owned analysis in the production Supabase project
reproduced a session-scoped analysis read returning no row, while the server-side
read returned the row. Both checkout endpoints now use the server client only
after authenticating, and filter by BOTH analysis ID and authenticated user ID.
Policies, customer credits, prices, subscriptions and webhook fulfillment are unchanged.

Email callbacks logged missing PKCE verifier errors. The callback now accepts
Supabase email token hashes, persists the session cookies on its redirect, retains
legacy PKCE support, and uses allowlisted local return paths. Failed checkout
sign-ins preserve the selected plan for retry. Provider messages and tokens are
never put in application logs or error URLs.

## Release order

1. Test and deploy the callback and checkout code first.
2. In Supabase project `dehaqpjkklsbxupsdcze`, Authentication → Emails, update
   **Magic link or OTP** and **Confirm sign up**.
3. All current app email-login callers provide a callback URL containing
   `?next=...` as `.RedirectTo`. Use the following link in both templates:

```html
<a href="{{ .RedirectTo }}&amp;token_hash={{ .TokenHash }}&amp;type=email">Sign in to ResumeGov</a>
```

Do not change password recovery, invites, SMTP, expiry, redirect allowlists, or
other providers as part of this release. Never insert a real token into this file.

## Verification

- `npm test`: includes both checkout routes, hidden owned rows, unowned rows,
  failed database reads, unauthenticated requests, cookie propagation, expired
  tokens, legacy links, recovery, and redirect validation.
- `node --import tsx --experimental-test-module-mocks tests/quality/auth-checkout-recovery.mjs`:
  real Supabase email verification and database reads using an isolated synthetic
  account. Billing configuration, Stripe calls and analytics are fixtures. No
  email is delivered and no live Checkout session or payment is created.
- The smoke requires existing Supabase credentials. It removes only the account
  it just created and its cascade-deleted fixture rows.

## Rollback

Before rolling back the callback, restore both email templates' original link:
`<a href="{{ .ConfirmationURL }}">Log In</a>`. The original magic-link body was
`<h2>Magic Link</h2><p>Follow this link to login:</p>` followed by that link.
Keep the ownership-scoped checkout correction if possible.
