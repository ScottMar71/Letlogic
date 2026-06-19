# M2 — Organic validation metrics

**Policy:** No starter credits. `/sample` is the free trial. First real screening requires purchase.

## Funnel events (Vercel Analytics)

| Event | When it fires |
|-------|----------------|
| `sample_viewed` | `/sample` page load |
| `pricing_viewed` | `/pricing` page load |
| `signup_completed` | Account created (immediate or email confirmation sent) |
| `dashboard_viewed` | Authenticated `/dashboard` load |
| `screen_started` | `/screen` page load |
| `checkout_started` | User clicks through to Stripe checkout |
| `first_screen_complete` | User's first successful assessment |

## Weekly CLI snapshot

```bash
npm run funnel:metrics
npm run funnel:metrics -- --days=14
```

Requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

Optional: `FOUNDER_EMAILS=you@example.com` (comma-separated) to exclude founders from organic signup count.

## Weekly review template

**Week of:** ___________

### Vercel Analytics (manual)

- `sample_viewed` → `signup_completed` conversion: ___
- `signup_completed` → `checkout_started`: ___
- `checkout_started` → `first_screen_complete`: ___

### Supabase (`funnel:metrics`)

- New signups (non-founder): ___
- Purchases: ___
- Assessments: ___
- Paid → screened users: ___

### GSC (manual)

- Impressions / clicks trend: ___
- Top landing pages: ___

### Decision

- Biggest drop-off step: ___
- One change to ship next week: ___

## M2 success (by end of week 6)

- [ ] 3+ non-founder signups
- [ ] 1+ organic user with `checkout_started` + `first_screen_complete`
- [ ] 2+ weekly reviews completed
