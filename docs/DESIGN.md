# Fajicat Design System

Rules to keep every page, table, and component looking like the same store.
If a rule below conflicts with something you're about to write, change what
you're writing — don't add a one-off exception.

Companion rules (mobile-first, form-submit) live in [`CLAUDE.md`](../CLAUDE.md)
and always apply on top of this doc.

---

## 1. Brand palette

All colors are defined once in [`src/app/globals.css`](../src/app/globals.css)
under `@theme`. Use the Tailwind utilities they generate — never a raw hex.

| Token         | Hex        | Tailwind utility           | Use for                                                          |
| ------------- | ---------- | -------------------------- | ---------------------------------------------------------------- |
| Orange        | `#EE7F1A`  | `bg-brand-orange`          | Primary CTAs, badges, active accents, "look here" headings       |
| Orange dark   | `#D96E0C`  | `bg-brand-orange-dark`     | Hover state for orange, gradient stop                            |
| Green         | `#8DBF3C`  | `bg-brand-green`           | Secondary accent, success, "why us" beats                        |
| Green dark    | `#6FA02A`  | `bg-brand-green-dark`      | Hover state for green, gradient stop, kicker text                |
| Blue          | `#6FC5E8`  | `bg-brand-blue`            | Info pills, decorative blobs, light background chips             |
| Brown         | `#9C6B4C`  | `bg-brand-brown`           | Reserved — logo cat only. Do not use as a UI color.              |
| Ink           | `#333B3B`  | `text-ink` / `bg-ink`      | All body text and dark UI                                        |
| Cream         | `#FAFAF7`  | `bg-cream`                 | Page background, table header, hover states                      |
| White         | `#FFFFFF`  | `bg-white`                 | Cards, panels, admin sidebar                                     |

**Muted text uses opacity on `ink`, not a separate gray.** Follow this scale:

- `text-ink` — primary
- `text-ink/70` — subheads, body on marketing
- `text-ink/60` — muted body, table cell values
- `text-ink/55` — trust bullets, timestamps
- `text-ink/50` — empty-state text, footer

Same for borders: `border-ink/10` (default), `border-ink/15` (mobile buttons /
higher-contrast outlines). Never introduce `text-gray-*` or `border-gray-*`.

### Gradients

Two blessed gradients — reuse them, don't invent new ones:

- **Headline gradient (text):**
  `bg-gradient-to-r from-brand-orange via-brand-orange-dark to-brand-green bg-clip-text text-transparent`
- **CTA banner (background):**
  `bg-gradient-to-br from-brand-orange via-brand-orange-dark to-brand-green`

---

## 2. Typography

Fonts are loaded once via `next/font` (Poppins + Pacifico) and exposed as
`--font-sans` / `--font-script`.

- **Body:** Poppins (default; no class needed).
- **Script accent:** `font-script` — Pacifico. Use for one word inside a
  heading, tops. Never for a full sentence or a button label.
- Weights in use: `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`
  (headlines only).

### Heading scale

| Level                         | Classes                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| Marketing H1 (home hero)      | `text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl` |
| Marketing H2 (section)        | `text-3xl font-bold sm:text-4xl`                                        |
| Marketing kicker (above H2)   | `text-sm font-semibold text-brand-orange` (or `text-brand-green-dark`)  |
| Admin page title              | `text-2xl font-bold text-ink`                                           |
| Card title                    | `text-lg font-bold text-ink`                                            |
| Body                          | `text-base` (marketing) / `text-sm` (admin, tables, forms)              |
| Micro (badges, timestamps)    | `text-xs`                                                               |

**Never use `text-xs` on a tappable target** (see CLAUDE.md mobile rules).

---

## 3. Layout & spacing

- Page background is `bg-cream`. Content lives in `bg-white` cards on top.
- Content max widths:
  - Marketing sections: `max-w-6xl` (`max-w-5xl` for the CTA banner)
  - Storefront chrome (header, footer): `max-w-5xl`
  - Admin content: fills the main pane; individual cards use natural width
- Horizontal padding: `px-4 sm:px-6` on marketing sections; admin main uses
  `p-4 sm:p-10`.
- Vertical rhythm on marketing sections: `py-14 sm:py-20`.
- Grid gutters: `gap-5` (product cards), `gap-6` (2-col info), `gap-12`
  (hero-style 2-col).

---

## 4. Radii, borders, shadows

Pick one from the ladder — don't mix radii inside one component.

| Element                                    | Radius              |
| ------------------------------------------ | ------------------- |
| Buttons, pills, badges, status chips       | `rounded-full`      |
| Inputs, small controls                     | `rounded-lg`        |
| Cards, admin tables, panels                | `rounded-2xl`       |
| Feature cards, hero photo frame, CTA banner | `rounded-3xl` or `rounded-[2.5rem]` |

Borders default to `border border-ink/10`. Use `border-ink/15` only where a
control needs to read as tappable on white (e.g., mobile cart button).

Shadows:

- `shadow-sm` — resting card
- `shadow-md` — hovered card (`hover:shadow-md`)
- `shadow-lg shadow-brand-orange/30` — floating orange CTA / step numbers
- `shadow-xl` — hero photo, featured images
- `shadow-2xl` — CTA banner, hero frame

---

## 5. Buttons

All buttons are pill-shaped (`rounded-full`) and have a visible hover.

### Primary (orange)

```tsx
className="rounded-full bg-brand-orange px-6 py-3 font-semibold text-white
           shadow transition hover:bg-brand-orange-dark
           disabled:cursor-not-allowed disabled:opacity-50"
```

Marketing/hero variant adds `shadow-lg shadow-brand-orange/30` and a subtle
scale-up: `hover:scale-[1.02] hover:bg-brand-orange-dark`.

### Secondary (outline)

```tsx
className="rounded-full border-2 border-ink/15 bg-white px-6 py-3
           font-semibold text-ink transition
           hover:border-brand-green hover:text-brand-green-dark"
```

### Ghost / tertiary link

For "Ver todos →", "Volver", etc. Just `text-sm font-semibold
text-brand-orange hover:underline`.

### Danger (destructive)

Reserved for delete confirmations. `bg-red-600 text-white
hover:bg-red-700`. No brand red — use plain Tailwind red so it reads as a
warning, not the brand.

### Rules

- **In `<form action={serverAction}>`, always use
  [`SubmitButton`](../src/components/admin/SubmitButton.tsx)** — it wires
  `useFormStatus` for a spinner + auto-disable. Never write a bare
  `<button type="submit">` in a form. (Also enforced by CLAUDE.md.)
- Tap target ≥ 40px. Use `py-3` minimum on any button. Never `text-xs`.
- Icon-only buttons: `flex h-10 w-10 items-center justify-center rounded-lg`.

---

## 6. Forms

### Input

```tsx
className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2
           text-sm text-ink placeholder:text-ink/40
           focus:border-brand-orange focus:outline-none
           focus:ring-2 focus:ring-brand-orange/30"
```

### Label

```tsx
className="mb-1 block text-sm font-medium text-ink/80"
```

### Layout

- One column by default. Two columns only on `sm:` and up:
  `grid gap-4 sm:grid-cols-2`.
- Never bare `grid-cols-2` on a form — breaks at 375px.
- Group related fields in a card (`rounded-2xl border border-ink/10
  bg-white p-4 sm:p-6`).

---

## 7. Cards & panels

The canonical card:

```tsx
className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm
           transition hover:shadow-md"
```

Variants:

- **Feature card** (marketing): swap `rounded-2xl` for `rounded-3xl`, add
  `p-7`, drop the hover if not linked.
- **Numbered step card**: relative container with an absolute badge in
  `-top-5 left-7`, `bg-brand-orange text-white shadow-lg shadow-brand-orange/30`.
- **Info card behind a photo**: offset colored block using `absolute -left-5
  -top-5 h-full w-full rounded-3xl bg-brand-green/25` behind the image.

---

## 8. Tables (admin)

**All admin lists follow the same shape.** Reference:
[`src/app/admin/pedidos/page.tsx`](../src/app/admin/pedidos/page.tsx).

### Wrapper (always)

```tsx
<div className="mt-6 rounded-2xl border border-ink/10 bg-white">
  {/* mobile cards + desktop table live inside */}
</div>
```

### Mobile (< sm): stacked list

```tsx
<ul className="divide-y divide-ink/10 sm:hidden">
  <li>
    <Link href={detailHref} className="block p-4 hover:bg-cream">
      <div className="flex items-baseline justify-between gap-2">
        <p className="truncate font-medium text-ink">{primary}</p>
        <p className="text-sm font-semibold text-ink">{amount}</p>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-ink/50">
        <span className="truncate">{secondary}</span>
        <span className="shrink-0 rounded-full bg-cream px-2 py-0.5 font-semibold text-ink/70">
          {statusLabel}
        </span>
      </div>
    </Link>
  </li>
</ul>
```

### Desktop (≥ sm): table

```tsx
<div className="hidden overflow-x-auto sm:block">
  <table className="w-full text-sm">
    <thead className="bg-cream text-left text-ink/60">
      <tr>
        <th className="px-4 py-3">…</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-ink/10">
      <tr className="hover:bg-cream">
        <td className="px-4 py-3">…</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Rules

- **4+ columns → you MUST provide the mobile card layout.** (Also in CLAUDE.md.)
- Header row: `bg-cream text-left text-ink/60`. Never `bg-gray-*`.
- Row divider: `divide-y divide-ink/10`. Row hover: `hover:bg-cream`.
- Primary column links use `font-medium text-ink hover:text-brand-orange`.
- Money is right-aligned when a table has more than one numeric column;
  otherwise leave it left. Always run through `formatCOP()` from
  [`src/lib/format.ts`](../src/lib/format.ts) — never hand-format pesos.
- Dates go through `.toLocaleDateString("es-CO")`.
- Always render an empty state (see §11).

### Totals row (new — use for pedidos, facturas, etc.)

When a table has money columns, add a totals footer that mirrors the row
shape and stays visible on mobile as a summary card above the list:

```tsx
{/* Above the wrapper, mobile + desktop */}
<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
  <SummaryTile label="Pedidos" value={count} />
  <SummaryTile label="Ingresos" value={formatCOP(revenue)} accent />
  <SummaryTile label="Pagados" value={paidCount} />
  <SummaryTile label="Pendientes" value={pendingCount} />
</div>
```

`SummaryTile`:

```tsx
<div className="rounded-2xl border border-ink/10 bg-white p-4">
  <p className="text-xs font-medium text-ink/55">{label}</p>
  <p className={`mt-1 text-lg font-bold ${accent ? "text-brand-orange" : "text-ink"}`}>
    {value}
  </p>
</div>
```

---

## 9. Status pills & badges

One shape (`rounded-full px-2 py-0.5 text-xs font-semibold`) — the color
tells you what it means.

| State                          | Classes                                  |
| ------------------------------ | ---------------------------------------- |
| Neutral (default / unknown)    | `bg-cream text-ink/70`                   |
| Info (channel = whatsapp, etc.)| `bg-brand-blue/15 text-ink/80`           |
| Success (paid, delivered)      | `bg-brand-green/20 text-brand-green-dark`|
| Warning (pending)              | `bg-brand-orange/15 text-brand-orange-dark` |
| Danger (cancelled, error)      | `bg-red-100 text-red-700`                |

Wrap in a small helper when you catch yourself repeating the map — put it in
`src/components/admin/StatusBadge.tsx` when you do. Until then, keep the
mapping colocated.

---

## 10. Search & filter bars

For any list page with more than ~20 potential rows, put filters directly
above the table wrapper. Same card look:

```tsx
<div className="mt-6 flex flex-col gap-3 rounded-2xl border border-ink/10
                bg-white p-4 sm:flex-row sm:items-center">
  <input
    type="search"
    placeholder="Buscar por cliente, #pedido…"
    className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm
               focus:border-brand-orange focus:outline-none
               focus:ring-2 focus:ring-brand-orange/30 sm:max-w-xs"
  />
  <select className="rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm">
    <option>Todos los estados</option>
    …
  </select>
</div>
```

Rules:

- Stack vertically on mobile, row on `sm:` and up. Never bare `flex-row`.
- Filters are a **form with a GET action**, not client-side JS, whenever
  possible — keeps URLs shareable and works without hydration.
- Clear-filters link on the right when any filter is active:
  `text-sm text-ink/55 hover:text-brand-orange`.

---

## 11. Empty states

Inside the table wrapper (or where content would go):

```tsx
<p className="px-4 py-8 text-center text-ink/50">
  Aún no hay pedidos.
</p>
```

For empty pages with an action, upgrade to:

```tsx
<div className="rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center">
  <p className="text-ink/60">No has creado clientes todavía.</p>
  <Link href="/admin/clientes/nuevo"
        className="mt-4 inline-flex rounded-full bg-brand-orange px-5 py-2.5
                   text-sm font-semibold text-white hover:bg-brand-orange-dark">
    + Nuevo cliente
  </Link>
</div>
```

---

## 12. Page shell (admin)

Every admin page starts the same way:

```tsx
export default async function AdminSomething() {
  // …data fetch
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Pedidos</h1>
        {/* optional right-side action button */}
      </div>
      {/* summary tiles → filters → table wrapper → empty state */}
    </div>
  );
}
```

No extra outer container — the layout in
[`src/app/admin/layout.tsx`](../src/app/admin/layout.tsx) already sets
`p-4 sm:p-10`.

---

## 13. Print (invoices)

Never modify the invoice layout at
[`src/app/admin/pedidos/[id]/factura/page.tsx`](../src/app/admin/pedidos/[id]/factura/page.tsx)
without checking print output. Rules that apply anywhere with a print view:

- Wrap fixed-width content (A4 = 210mm) in `overflow-x-auto
  print:overflow-visible` (CLAUDE.md).
- Anything chrome (admin sidebar, buttons) must be `print:hidden`.
- Use the `PrintButton` component, never a raw `window.print()`.

---

## 14. Icons & emoji

- Marketing pages use emoji as icons (`🚚 🔒 📏 🐾`). This is intentional —
  it matches the client's Instagram voice.
- Admin uses plain text labels, no emoji, except in status pills where a
  small ✓ or ✕ is OK.
- SVG icons: inline as a component (see the `Spinner` in `SubmitButton`).
  Don't add an icon library.

---

## 15. Do / Don't quick reference

**Do**

- Use `bg-brand-*` / `text-ink/*` — never raw hex or `gray-*`.
- Use `rounded-full` for buttons, `rounded-2xl` for cards, `rounded-lg` for
  inputs.
- Use `SubmitButton` in every server-action form.
- Give tables a mobile card layout when they have 4+ columns.
- Use `formatCOP()` for all pesos and `toLocaleDateString("es-CO")` for
  dates.
- Verify at 375px before saying a change is done.

**Don't**

- Hide the only nav with `hidden sm:flex` and no mobile replacement.
- Use `text-xs` on a tappable control.
- Introduce a new radius, shadow, or gray scale mid-page.
- Reach for `text-gray-500` — that's `text-ink/60`.
- Add a color that isn't in §1. If a new state genuinely needs a new color,
  add it to `@theme` in `globals.css` and update this doc in the same PR.

---

## 16. When adding a new admin list page (checklist)

1. `h1` with `text-2xl font-bold text-ink`.
2. Summary tiles row (money/counts) — §8.
3. Filter/search bar as a GET form — §10.
4. Table wrapper — §8, with mobile card layout if 4+ columns.
5. Empty state — §11.
6. Actions (Edit/Delete) use `SubmitButton` inside `<form action={…}>`.
7. Verify at 375px, `sm`, `md`, and print if the page has an invoice link.
