@AGENTS.md

# Mobile-first (non-negotiable)

The client runs the admin and the customers shop **from phones**. Every page must work at **375px**.

- Tailwind defaults are mobile; use `sm:` / `md:` to add desktop layout. Never the reverse.
- **Never** hide the only nav with `hidden sm:flex` without a mobile replacement (hamburger / drawer / bottom tabs).
- Multi-column grids: write `grid-cols-1 sm:grid-cols-2` (or similar) — never bare `grid-cols-2` for forms.
- **Tables**: 4+ columns must reflow to a stacked **card layout on mobile** (table hidden `sm:block`, cards `sm:hidden`). Smaller tables: at minimum wrap in `overflow-x-auto` (not `overflow-hidden`, which clips).
- Fixed-width content (e.g., A4 invoice at 210mm): wrap in `overflow-x-auto print:overflow-visible` so it doesn't break the mobile layout.
- Tap targets ≥ 40px (`h-10`, `py-3`, etc.). Don't ship `text-xs` buttons.
- Before saying a UI change is done, verify at **375px mobile viewport** in the preview, not just desktop.

Existing mobile patterns to reuse:
- `src/components/admin/MobileNav.tsx` — hamburger pattern for the admin
- `src/components/storefront/SiteHeader.tsx` — hamburger + sticky cart pattern for the storefront

# Forms (prevent duplicate submits)

- Every `<form action={serverAction}>` submit button uses `SubmitButton` from `src/components/admin/SubmitButton.tsx` — it uses `useFormStatus` to disable itself + show a spinner while the action is in flight.
- Server actions must also guard against duplicates server-side (don't rely on the UI alone). Example: case-insensitive name check in `createClientAction`.

# Build + verify

- Run `npm run build` after non-trivial changes. The Vercel deploy will fail otherwise.
- Routes prefixed with `/admin` are gated by the `AdminLayout` (requires `profile.role = 'admin'`).
- Migrations: `npm run db:new <name>` → edit SQL → `npm run db:push`. Do not paste SQL in the Supabase dashboard anymore.
