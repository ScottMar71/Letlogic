# Changelog

Product UX and maintainability improvements tracked by improvement cycle.

## Cycle 2 — 2026-06-18 (Maintainability)

### Added
- **`AuthenticatedPage` / `AuthenticatedPageLoading`** — Shared shell for all signed-in routes (header, `#main-content`, container widths). Replaces duplicated page wrappers.
- **`MobileNavDrawer`** — Shared slide-out drawer with focus trap, keyboard backdrop dismiss, and scroll lock. Used by marketing and app mobile nav.
- **`useDialogFocus` hook** — Reusable focus trap for modals and drawers; adopted by buy-credits and upgrade-pro modals.
- **`lib/screening/session.ts`** — `React.cache`-backed `getAuthenticatedUser` and `getCachedCreditBalance` to dedupe auth/balance fetches per request.
- **`lib/format-date.ts`** — Centralised `formatDate`, `formatDateLong`, and `formatDateTime` (replaces inline `toLocaleDateString` calls).
- **Loading skeletons** — `screen/loading.tsx`, `properties/loading.tsx`, `screenings/[id]/loading.tsx` (dashboard loading now uses shell without server fetches).

### Improved
- **Mobile nav consolidation** — `mobile-nav.tsx` and `app-mobile-nav.tsx` share drawer logic; ~70 lines of duplication removed.
- **Credit balance fetching** — Header uses cached balance; Settings passes balance explicitly (no double-fetch).
- **Accessibility** — Skip link works on auth, 404, and error pages; mobile auth shows terms/privacy links; contact form `aria-busy`; login email field has explicit `id`; drawer backdrop is keyboard-dismissible with focus trap.
- **Guide breadcrumbs** — `GuideLayout` reuses `Breadcrumbs` component instead of hand-rolled markup.
- **Naming / structure** — `AppLayoutWidth` type shared across header and page shell; date formatting standardised.

### Removed
- **`lib/supabase/client.ts`** — Unused browser Supabase client (zero imports).
- **`getCreditBalanceForCurrentUser`** — Unused export from `app/actions/screening.ts`.
- **`app/documents/section-21/page.tsx`** — Replaced with permanent redirect to `/screen` in `next.config.ts`.

### Added
- **Marketing route group `(marketing)/`** — Shared layout with header, footer, and page shell for all public marketing routes. Per-route header config via `MarketingHeaderRoute` (`/pricing` hides pricing link, `/sample` uses narrow width).

### Improved
- **Marketing page boilerplate removed** — 15 pages no longer duplicate `MarketingHeader` + `MarketingFooter` + outer wrapper. `LegalPage` and `GuideLayout` now render content only.

### Audit backlog (next cycles)
- Extract `MarketingLandingPage` template for `for-landlords`, `for-hmo-landlords`, `for-letting-agents`
- Unify `Card` component vs `.card` CSS class on marketing pages
- Extend `Button` component to auth/contact forms (or document intentional `btn-*` usage)
- Dynamic-import PDF upload in `screening-workspace.tsx` to defer client bundle
- Run `npm run db:types` and commit `database.types.ts`
- Compact header logo sizing (`nav` variant is tall on mobile)

---

## Cycle 1 — 2026-06-18

### Added
- **Mobile app navigation** — Authenticated pages now use a slide-out menu on screens below `lg`, matching the marketing site pattern. Includes credit balance, buy credits, and sign out.
- **Dashboard loading skeleton** — Instant visual feedback while dashboard data loads.

### Improved
- **Credit balance in header** — `AppHeader` auto-fetches balance on all authenticated pages (Settings, Properties, screening reports, etc.), not only Dashboard and Screen.
- **Properties list** — Cards now match dashboard styling (icon, hover state, chevron, formatted rent).

### Fixed
- Removed duplicate `--color-info` tokens in `globals.css`.
