# LetLogic

UK-focused **AI tenant screening aid** for landlords and letting agents. Paste applicant details and get an explainable risk score, summary, and recommendation — not a credit check or legal advice.

**Production:** [https://www.letlogic.app](https://www.letlogic.app)

## Stack

- Next.js 16 (App Router), React 19, Tailwind CSS
- Supabase (auth, Postgres, RLS)
- Stripe (credit packs + Pro subscription)
- OpenAI (`gpt-4o`)
- Sentry, Vercel Analytics

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values — never commit .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase

1. Create or link a Supabase project (`supabase link --project-ref <ref>`).
2. Apply migrations: `npm run db:push`
3. Generate types: `npm run db:types`
4. Auth hardening + Zoho SMTP (password reset email):
   - Confirm Zoho SMTP host (region + `smtp` vs `smtppro`) and create an app password
   - Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_ADMIN_EMAIL` in `.env.local`
   - `SUPABASE_ACCESS_TOKEN=... TURNSTILE_SECRET_KEY=... npm run configure:supabase-smtp`
   - `npm run verify:auth-config` — confirm Turnstile + SMTP (not Resend)
5. Branded auth emails:
   - `npm run generate:auth-email-templates` (local preview)
   - `SUPABASE_ACCESS_TOKEN=... npm run configure:auth-email-templates`

Add auth redirect URLs in Supabase → Authentication → URL configuration:

- `http://localhost:3000/auth/callback`
- `https://www.letlogic.app/auth/callback`
- `https://letlogic.app/auth/callback`

### Stripe

- Create credit pack and Pro subscription products/prices in Stripe Dashboard.
- Point webhook to `https://www.letlogic.app/api/webhooks/stripe` (events: `checkout.session.completed`, `invoice.paid`).
- Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and price IDs in env.

## Deploy (Vercel)

Project: **letlogic** on Vercel. Domains: `www.letlogic.app`, `letlogic.app`.

1. Connect repo and set all variables from `.env.example` in Vercel → Settings → Environment Variables.
2. Set `NEXT_PUBLIC_SITE_URL=https://www.letlogic.app`
3. Set Sentry env vars (see [Sentry setup](#sentry) below)
4. Promote deployment to production after CI passes

### Sentry

Create a Next.js project at [sentry.io](https://sentry.io), then set in Vercel (Production + Preview):

| Variable | Value |
|----------|--------|
| `SENTRY_DSN` | Project DSN (server) |
| `NEXT_PUBLIC_SENTRY_DSN` | Same DSN (browser) |
| `SENTRY_AUTH_TOKEN` | Auth token with `project:releases` + `org:read` — **required at build** for readable stack traces |
| `SENTRY_ORG` | Your org slug |
| `SENTRY_PROJECT` | Your project slug (e.g. `letlogic`) |

Source maps upload automatically on `next build` when `SENTRY_AUTH_TOKEN` is set. Events are tunneled via `/monitoring` to reduce ad-blocker drops.

Verify after deploy:

```bash
curl -s https://www.letlogic.app/api/sentry-example
# Check https://sentry.io/issues/ within ~30s
```

Session Replay records **only on errors**, with all text/inputs masked (applicant data may be on screen)..

### Pre-launch verification

```bash
npm run verify:production
```

For design-partner pilot before company incorporation:

```bash
ALLOW_PRE_INCORPORATION=1 npm run verify:production
```

Legal identity defaults to sole trader (`NEXT_PUBLIC_COMPANY_LEGAL_NAME=LetLogic`). No company number or public address is required.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright (marketing smoke + optional auth tests) |
| `npm run verify:production` | Live URL + env checks |
| `npm run grant:pilot` | Grant comp credits: `PARTNER_EMAIL=… npm run grant:pilot` |
| `npm run partner:status` | Partner pilot progress: `PARTNER_EMAIL=… npm run partner:status` |
| `npm run provision:e2e-user` | Grant credits to E2E test user |

### E2E auth tests (optional)

Set in `.env.local` or CI secrets:

```env
PLAYWRIGHT_TEST_EMAIL=test@example.com
PLAYWRIGHT_TEST_PASSWORD=...
```

Create the user in Supabase Auth first, then `npm run provision:e2e-user`.

## Design partner pilot

See [docs/product/Partner-Onboarding.md](docs/product/Partner-Onboarding.md).

## Linear

Go-live checklist: [AGE-108](https://linear.app/agentscale/issue/AGE-108) in the LetLogic project.
