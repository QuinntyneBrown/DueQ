# DueQ — End-to-End Implementation Plan

> **Goal:** Take the existing DueQ scaffold to a complete, gold-standard, production-ready application. Every Playwright spec passes on every viewport. The Angular UI has pixel-perfect visual parity with `docs/mocks/` (within reason — see §"Visual parity policy"). No temporary stubs, no placeholder data, no skipped tests.
>
> **Method:** ATDD per slice. For each slice the order is **(a) confirm the failing Playwright test → (b) implement the smallest vertical change → (c) the test goes green → (d) visual diff against the mock → (e) commit**. Speed is *not* a goal; clarity, correctness, simplicity are.

---

## 1. Where we are today

### Backend — substantially complete
- `DueQ.Domain` — `Bill`, `Payment`, `Household` entities with `BillStatus` / `PaymentMethod` enums.
- `DueQ.Application` — CQRS use cases (one folder each) for:
  - Bills: `Create`, `Update`, `Delete`, `Settle`, `GetBill`, `ListBills` (+ validators)
  - Payments: `Create`, `Delete`, `ListPayments` (+ validators)
  - Settings: `Update`, `GetSettings` (+ validator)
  - Dashboard: `GetDashboard` (computes balance, this-month/received/behind-by, recent activity)
  - History: `GetHistory` (running balance + monthly grouping)
- `DueQ.Infrastructure` — `DueQContext` (EF Core 10 + SQL Server), per-aggregate `*Configuration` classes, `InitialCreate` migration applied.
- `DueQ.Api` — controllers for Bills, Payments, Settings, Dashboard, History; `ExceptionHandlingMiddleware`; wide-open CORS; OpenAPI in dev.
- `DueQ.Application.Tests` — handler tests for `CreateBill`, `SettleBill`, `CreatePayment`, `GetDashboard`, `GetHistory` (xUnit + EF InMemory).

### Frontend — libraries complete, app empty
- **`api` lib** — every model, service contract (`I…Service` + `…_SERVICE` token), and concrete HTTP service exists for Bills, Payments, Settings, Dashboard, History. `provideApi({ baseUrl })` composition helper is in place.
- **`domain` lib** — placeholder only (not currently used; can be left alone or deleted at end).
- **`components` lib** — every presentational component scaffolded (balance card, stat row, activity row/list, bill list item/group, chip group, detail header/amount, split bar/legend, key-value list, note card, form fields, segmented control, preview block, button, running-balance card, timeline group/row, person card, brand mark, nav link/item, FAB, avatars, page head, section head, back link, icon tile, badge). Most have an `OnPush`, `input()`/`output()`, signal-based template. Their visual styling already references the same CSS custom properties as the mocks.
- **`due-q` app** — bare scaffold:
  - `app.routes.ts` is `[]`
  - `app.ts` renders only `<router-outlet>`
  - `app.config.ts` has no `provideHttpClient`, no `provideApi(...)`, no API base URL
  - no feature pages, no shell, no global styles imported from the mocks
  - no environment configuration

### E2E — complete suite, all currently fail
8 specs (`dashboard`, `bills`, `bill-detail`, `add-bill`, `record-payment`, `history`, `settings`, `navigation`) × 5 Playwright projects (`mobile-xs`, `mobile-sm`, `tablet-md`, `desktop-lg`, `desktop-xl`). Page Objects fully written and use stable `data-testid` hooks plus accessible roles.

**Conclusion:** the platform is built; the *composition* is missing. The work is wiring services into a routed app, building seven page components from existing primitives, and ensuring backend seeding/integration so the suite is exercising real data.

---

## 2. Cross-cutting decisions (apply to every slice)

| Topic | Decision | Reason |
|---|---|---|
| Routes | `/dashboard`, `/bills`, `/bills/new`, `/bills/:id`, `/payments/new`, `/history`, `/settings`. Root redirects to `/dashboard`. | Matches every `path` in `e2e/pages/*` and every URL assertion in specs. |
| API base URL | Provided in `app.config.ts` via `provideApi({ baseUrl: 'http://localhost:5000' })` (or `environment.apiBaseUrl` once an `environments/` folder is added). Backend dev port read from `backend/src/DueQ.Api/Properties/launchSettings.json` and pinned. | Single composition root; no per-component knowledge of the URL. |
| HTTP | `provideHttpClient(withFetch())` at the app config. | Required by the api lib's services. |
| Routing | Standalone components + `loadComponent` lazy routes per feature page. | Keeps each page independently testable and bootable. |
| State | No store. Each page resolves data with `inject(SERVICE).<method>()` in a `resource()` or via `takeUntilDestroyed()` subscription. Mutations re-fetch the affected query. | "Radically simple, very narrowly scoped" — matches `docs/idea.md`. |
| Forms | Reactive Forms. Validation messages rendered via `lib-form-field` `error` slot. | Required by `add-bill.spec.ts` and `record-payment.spec.ts` validation assertions. |
| Data seeding | A `DueQContextSeeder` runs at startup *only when the DB is empty* and writes the fixture from the mocks (28 bills total, 4 unsettled in May 2026, 2 payments, household `{ "Quinntyne Brown", "Sam" }`). Idempotent. | Specs assume populated data (e.g. "May 2026 month group is visible"). Without a seed they'd fail on a fresh box. The seeder is *production code*, not test code, because the empty-DB single-household scenario is the legitimate first-run UX. |
| Test data resets | A dedicated `[ApiController("api/_test")]` exists *only in `Development`* with `POST /reset` that re-seeds. Playwright global setup calls it before the suite. | Tests must be deterministic. The controller is registered conditionally in `Program.cs` (`if (app.Environment.IsDevelopment()) { … }`). It is **not** a "temporary stub" — it is a documented dev-only seam, equivalent to `dotnet ef database update` in CI. |
| Greeting | `Good morning` (00–11), `Good afternoon` (12–17), `Good evening` (18–23) computed in the dashboard page from `new Date()`, suffixed with first name from `GetSettings`. | Spec: `/Quinntyne|good (morning|afternoon|evening)/i`. |
| Currency formatting | `CurrencyPipe` with `'USD'`/`'$'` symbol, `'1.2-2'` digits. | Specs match `/^\$\d[\d,]*\.\d{2}$/`. |
| Date formatting | `DatePipe` with `'MMM d'` for rows, `'MMMM yyyy'` for month group headings, `'MMMM d, yyyy'` for detail pages. | Matches mocks. |
| Icons | Use the same Unicode glyphs as the mocks (`⌂`, `▤`, `↻`, `＋`, `↓`, `◔`, `←`, `⋯`, `⌕`, `⚙`, `🛒`, `⚡`, `📱`, `🍕`, `🏠`). Icon for a bill is selected by the user when entering it via a small icon picker (`icon` field on `Bill` already exists in the components models). | Mocks use Unicode; no icon library needed. |
| Global styles | Copy `docs/mocks/styles.css` `:root` block (color, type, spacing scale, radii, shadows, layout vars) into `frontend/projects/due-q/src/styles.scss`. Import Inter font as `<link>` in `index.html`. | Lets every component use the exact same tokens the mocks use → automatic visual parity. |
| Visual parity policy | "Pixel-perfect within reason": same font, same color tokens, same spacing scale, same layouts. Tolerated deviations: native browser focus rings, native scrollbars, system-font fallbacks before Inter loads. Each slice ends with a side-by-side screenshot comparison: Angular page at the target viewport vs. the corresponding `docs/mocks/*.html` file. Differences are either fixed or recorded in a `Known visual deviations` section of this file. | The mock is the design source of truth; only document deviations after a real attempt to match. |

---

## 3. Slice-by-slice execution

Each slice is a self-contained, mergeable vertical: backend changes (if any) → frontend changes → Playwright tests for that slice go green → visual parity check → commit. Slices are ordered so each builds on the last; do not reorder.

### Slice 0 — Pin the foundation
**Failing tests at end of slice:** none new; just enables the harness.

1. Add `frontend/projects/due-q/src/environments/{environment.ts,environment.development.ts}` exporting `apiBaseUrl`. Default to `http://localhost:5000`.
2. In `frontend/projects/due-q/src/app/app.config.ts`, add `provideHttpClient(withFetch())` and `provideApi({ baseUrl: environment.apiBaseUrl })`.
3. In `frontend/angular.json` for the `due-q` project, switch the production file replacement to use `environment.ts`; dev uses `environment.development.ts`.
4. Copy `docs/mocks/styles.css` into `frontend/projects/due-q/src/styles.scss` (keep all selectors — they will be used by the app shell and as a baseline for any unstyled element).
5. Add the Inter `<link>` to `frontend/projects/due-q/src/index.html`.
6. In `backend/src/DueQ.Api/Properties/launchSettings.json`, confirm the HTTP profile port. Pin it (no `:0`).
7. Add `backend/src/DueQ.Infrastructure/Persistence/DueQContextSeeder.cs` and call it from `Program.cs` after `app.Build()` and before `app.Run()` inside a scope (`using var scope = app.Services.CreateScope();`). Seeder: if `Households` is empty, write the fixture from `docs/mocks/*` (households + 28 bills + 2 payments dated for May/April 2026; bill icons taken from the mocks).
8. Add dev-only `TestSupportController` (`api/_test/reset`) gated by `app.Environment.IsDevelopment()` that truncates `Bills`/`Payments`/`Households` and re-runs the seeder. Add a Playwright global setup (`e2e/global-setup.ts`) that POSTs to it once before all projects, plus a `beforeEach` hook that re-resets when a test mutates state (add bill / record payment / delete bill / settle / save settings).
9. Run `dotnet build` and `npm run build` in both `frontend/` and `e2e/` to confirm the wiring compiles.

**Visual parity check:** N/A (no UI yet).
**Commit:** `chore: wire api, http, environments, seed data, dev test-reset endpoint`.

---

### Slice 1 — App shell (sidebar, mobile header, bottom nav, FAB)
**Failing tests that this slice turns green:**
- `navigation.spec.ts`: "root URL redirects to the dashboard" (URL part)
- `navigation.spec.ts`: "bottom nav navigates between Home, Bills, History, and Settings"
- `navigation.spec.ts`: "mobile floating action button opens add bill"
- `navigation.spec.ts`: "sidebar navigates between sections on desktop"
- `navigation.spec.ts`: "active nav item reflects the current route"
- `navigation.spec.ts`: "settings gear in the mobile header navigates to settings"
- `navigation.spec.ts`: "renders on extra-small mobile viewport (320px) without horizontal overflow"

1. Create `app/shell/shell.ts` (standalone) — composes:
   - `header` (mobile-only via CSS `@media (max-width: 991px)`) with brand-mark + title slot + right-action slot (settings gear on dashboard; "Cancel"/"Skip"/⋯ on inner pages).
   - `aside` sidebar (md+ only) listing Dashboard / Bills / History / Add bill / Record payment / Settings with `routerLink` and `routerLinkActive='is-active'` and `[attr.aria-current]="rla.isActive ? 'page' : null"`.
   - `<main class="app-main"><div class="container"><router-outlet/></div></main>`.
   - `nav.bottom-nav` (mobile-only) with five entries; the centre slot is the `+` FAB linking to `/bills/new`. Use `role="navigation" aria-label="Primary"` so `bottomNav()` in `BasePage` resolves it.
2. Wire `app.ts` to render `<app-shell/>` instead of `<router-outlet/>`.
3. Add routes in `app.routes.ts`:
   - `{ path: '', pathMatch: 'full', redirectTo: 'dashboard' }`
   - `{ path: 'dashboard', loadComponent: …DashboardPage }` (placeholder page rendering an `<h1>Good evening</h1>` so the heading is visible — full content arrives in Slice 2)
   - same shape for `bills`, `bills/new`, `bills/:id`, `payments/new`, `history`, `settings` (each one a placeholder `<h1>` matching the spec's expected heading regex)
4. Confirm bottom nav's center is `Add bill / FAB` and links to `/bills/new`; mobile header on `/dashboard` shows a settings gear linking to `/settings`.
5. Run `navigation.spec.ts` on all 5 viewport projects. Resolve every failure before moving on.

**Visual parity check:** Compare the shell at `mobile-sm` against any of the mocks (the chrome is identical across all eight). Adjust spacing/colors only via the design tokens already in `styles.scss`.
**Commit:** `feat(app): add shell, routes, mobile/desktop chrome with active-route highlighting`.

---

### Slice 2 — Dashboard page (read-only)
**Failing tests that this slice turns green:** all of `dashboard.spec.ts`.

1. **Backend gap check:** `GetDashboardHandler` already returns `YourName`, `PartnerName`, `Balance`, `OutstandingBillCount`, `LastSettlementDate`, `ThisMonthLogged`, `ThisMonthReceived`, `BehindByDays`, `RecentActivity[]`. No changes needed.
2. **Frontend** — create `app/pages/dashboard/dashboard-page.ts`:
   - `inject(DASHBOARD_SERVICE).get()` and `inject(SETTINGS_SERVICE).get()` resolved with `rxResource` or `resource()` so the page renders the greeting + balance card + stats + recent activity in one round trip.
   - Template uses the existing components: `lib-page-head`, `lib-balance-card`, `lib-stat-row` + `lib-stat`, `lib-activity-list` + `lib-activity-row`, `lib-section-head`.
   - Greeting: `Good ${tod()}, ${firstName}` where `tod()` switches on local hour.
   - Balance label: `${partnerName} owes you` when `balance > 0`; `You owe ${partnerName}` when `< 0`; `All settled` when `0`.
   - Balance meta: `Last settled ${date} · ${count} bills outstanding` or `No payments yet` when `LastSettlementDate` is null.
   - "Behind by" stat: shows `${behindByDays} days` with `var(--owed-by-you)` color when `> 7`.
   - "View all" → `routerLink="/history"`.
   - Each activity row links to `/bills/:id` (use the `id` from the DTO).
3. Add `data-testid` hooks:
   - `balance-card`, `balance-amount`, `balance-label`, `balance-meta` (already conventionally provided by the `BalanceCard` template — verify and add if missing)
   - `stat-this-month`, `stat-received`, `stat-behind-by` on each `lib-stat`
   - `region` with `aria-label="Recent activity"` on the section
   - rows rendered as `role="listitem"`
4. Wire `addBill` / `recordPayment` outputs of `lib-balance-card` to `router.navigate(['/bills/new'])` and `(...['/payments/new'])`.
5. Run `dashboard.spec.ts`. All 9 tests should pass on every viewport.

**Visual parity check:** Side-by-side `docs/mocks/dashboard.html` vs. `/dashboard` at mobile-sm, tablet-md, desktop-lg. Match: balance-card radial gradient corner, dark surface, 44/56px amount, stat row at 3-up on >=tablet, list rows with icon tile + body + right-aligned amount. Fix or record deviations.
**Commit:** `feat(dashboard): render greeting, balance, stats, recent activity from api`.

---

### Slice 3 — Settings page (read + write)
**Failing tests:** all of `settings.spec.ts` and the rest of `dashboard.spec.ts` that depend on the configured name.

1. **Backend gap check:** `GetSettings` returns `Household`; `UpdateSettings` upserts. No changes.
2. **Frontend** — create `app/pages/settings/settings-page.ts`:
   - Reactive form with `yourName` and `partnerName` (both `Validators.required`).
   - Two `lib-person-card`s side-by-side (CSS grid like the mock — 1-col xs, 2-col sm+).
   - Each card: role label, `lib-avatar-large` (you=ink, partner=accent-soft) showing **live** initials from the form value (uppercase first letters of first + last word, capped at 3 chars), `lib-form-field` with the input.
   - Validation message `<lib-form-field error="…">` shows when the field is touched and invalid. `data-testid="error-you"` / `error-partner`.
   - Save button calls `SETTINGS_SERVICE.update({ yourName, partnerName })`. On success, navigate to `/dashboard`. On 400, surface server errors.
   - On init, prefill from `SETTINGS_SERVICE.get()`.
3. Re-run `settings.spec.ts` (5 tests) + the dashboard tests that consume the name (`expectGreetingMatchesUserName`, `balanceLabel contains "Sam"`).

**Visual parity check:** Two cards stacked on xs, side-by-side on sm+, avatars 64px, role label small-caps muted, primary button full-width.
**Commit:** `feat(settings): edit household names with live avatar preview`.

---

### Slice 4 — Bills list page
**Failing tests:** all of `bills.spec.ts`.

1. **Backend gap check:** `ListBillsQuery` already supports `status`, `from`, `to`. No changes.
2. **Frontend** — create `app/pages/bills/bills-page.ts`:
   - Header gets a `+` action button (`headerAddButton` in the page object) — done via shell's right-action slot, populated by per-page `provideRouteHeader` or by the page rendering its own header action through a service. Simplest: have the page emit an `action` template ref via a small `HeaderActionDirective` consumed by the shell.
   - Filter chips via `lib-chip-group` with three `lib-chip`s (`All`, `Unsettled`, `Settled`) — each must expose `aria-selected="true|false"` on the chip element, and a `<span data-testid="chip-count">` with the count. `All` is selected on first paint.
   - Body: load `BILLS_SERVICE.list()` once, derive counts locally, then re-query when the filter changes (or filter client-side — pick the simpler one; either passes the spec).
   - Group by `MMMM yyyy`; for each month render `lib-bill-month-group` with month label, month total (`+$N owed` if any unsettled in the month; `All settled` if all are settled), and `lib-bill-list-item`s.
   - Each row: `lib-icon-tile` (kind=bill), title, `${MMM d} · <lib-badge status>`, total + `+$partnerShare`. Row wraps an anchor to `/bills/${id}`.
   - Empty state: `data-testid="empty-state"` with copy `"No bills yet"` shown when API returns `[]`.

**Visual parity check:** Chip row with counts, two month groups (May/April), badges colored per status, list row rhythm matches the mock.
**Commit:** `feat(bills): list bills grouped by month with status filters and empty state`.

---

### Slice 5 — Bill detail page
**Failing tests:** all of `bill-detail.spec.ts`.

1. **Backend gap check:**
   - `GetBillQuery` returns the bill DTO. ✓
   - The not-found case: `GetBillHandler` should throw `NotFoundException` (verify; if it doesn't, fix it — `ExceptionHandlingMiddleware` converts to 404).
2. **Frontend** — create `app/pages/bill-detail/bill-detail-page.ts`:
   - Resolves `BILLS_SERVICE.get(id)`; if 404, render a `<div data-testid="not-found">` block with copy + a `Back to bills` link.
   - Renders:
     - back link `← All bills` → `/bills`
     - `lib-detail-header` (icon-tile, title, badge, "Logged …")
     - `lib-detail-amount` (`$amount`)
     - meta (`{date} · {icon} {category-or-title}`)
     - `lib-split-bar` (50/50) + `lib-split-legend` (`You — $half`, `${partnerName} — $half`)
     - `lib-key-value-list` (Date, Category, `${partnerName}'s share`, Status)
     - `lib-note-card` (only if `bill.note` is set)
     - Action row: `Edit` (outline) + `Mark as settled` / `Mark as unsettled` (primary). Settling calls `BILLS_SERVICE.settle(id)` / `.unsettle(id)` then re-fetches.
     - `Delete bill` (danger) opens an in-page confirm dialog (`role="dialog" data-testid="confirm-dialog"`) with `Cancel` / `Delete` (`data-testid="confirm-delete"`). On confirm: `BILLS_SERVICE.delete(id)` then `router.navigateByUrl('/bills')`.
   - `data-testid`s used by the spec: `bill-title`, `bill-amount`, `bill-date`, `status-badge`, `your-share`, `partner-share`.

**Visual parity check:** Icon tile 56×56 with name to its right, large `$amount`, soft `<hr>`, split bar split in two halves, KV rows muted-label/numeric-value, action row 1:2 split.
**Commit:** `feat(bill-detail): show split, settle/unsettle, delete with confirm, 404 state`.

---

### Slice 6 — Add bill page
**Failing tests:** all of `add-bill.spec.ts`.

1. **Backend gap check:** `CreateBillCommand` accepts `description`, `amount`, `date`, `note`, `icon`. Confirm validator rejects non-positive amounts. ✓ (already covered by the existing handler test). Add `icon` if missing.
2. **Frontend** — create `app/pages/add-bill/add-bill-page.ts`:
   - Reactive form: `amount` (string, parsed; `Validators.required` + custom positive-number validator), `name` (`required`), `date` (`required`, default today), `note` (optional), `icon` (default `🛒`).
   - Use `lib-amount-input`, `lib-text-input`, `lib-date-input`, `lib-text-area`, and `lib-form-field` (with `error` slot showing the appropriate copy when invalid+touched).
   - Live `lib-preview-block`: `Sam owes` / `50% of $X.XX` / `+$Y.YY` recomputes on every value change of `amount`.
   - Two buttons: `Save & add another` (outline) and `Save bill` (primary). On `Save bill` → POST → navigate to `/bills`. On `Save & add another` → POST → reset form → stay on `/bills/new`.
   - Header `Cancel` link → `/dashboard`.
   - Validation error `data-testid="error-amount"` / `error-name`.
3. Run `add-bill.spec.ts` (9 tests).

**Visual parity check:** Currency-prefixed amount input, dashed-soft hr, preview-block bar above the buttons, button proportions 1:2.
**Commit:** `feat(add-bill): create bill with live split preview, validation, save & add another`.

---

### Slice 7 — Record payment page
**Failing tests:** all of `record-payment.spec.ts`.

1. **Backend gap check:** `CreatePaymentCommand` accepts `amount`, `date`, `method`, `note`. ✓
2. **Frontend** — create `app/pages/record-payment/record-payment-page.ts`:
   - On init load `DASHBOARD_SERVICE.get()` to get the current balance.
   - Top "current balance" block (dark surface) shows `${balance | currency}` with `data-testid="current-balance"`.
   - Reactive form: `amount` (required + positive), `date` (required, default today), `method` (default `e-Transfer`), `note` (optional).
   - Method via `lib-segmented-control` with `e-Transfer | Cash | Other`. Each option must have `aria-selected="true|false"` (used by the spec).
   - Live `lib-preview-block`: `New balance after payment` / `${current} − ${amount}` / value (positive in green, negative in `--owed-by-you` red).
   - When `amount > current`, also render `<div data-testid="overpayment-warning">` warning copy.
   - Save → `PAYMENTS_SERVICE.create(...)` → navigate to `/dashboard`. Validation `error-amount`.
3. Run `record-payment.spec.ts` (8 tests).

**Visual parity check:** Dark current-balance block, segmented control with active pill, preview block matches add-bill rhythm.
**Commit:** `feat(record-payment): log payment with method selector, live new-balance preview, overpayment warning`.

---

### Slice 8 — History page
**Failing tests:** all of `history.spec.ts`.

1. **Backend gap check:** `GetHistoryQuery` returns `Months[]` with per-month total + entries with running balance. Verify the running balance is computed *forward in time* (so the row's `balanceAfter` is what the balance was after that entry posted). ✓ assumed; correct the handler if not.
2. **Frontend** — create `app/pages/history/history-page.ts`:
   - Header `lib-page-head` "History" / "Every bill and payment, newest first."
   - Running-balance summary card (`lib-running-balance-card`): big `${running | currency}` (`data-testid="running-balance"`), "Sam owes you" label, and side stats `Logged` (`data-testid="total-logged"`) + `Paid back` (`data-testid="total-paid-back"`).
   - Filter chips: `All | Bills only | Payments only` (`aria-selected`, `All` default).
   - Per-month: `lib-timeline-group` with `<h3>${MMMM yyyy} <span class="month-total" data-testid="month-total-${slug}">${signed total}</span></h3>` and `lib-timeline-row`s.
   - Each row: icon tile (bill or payment kind), title, `${MMM d} · ${total | method}` meta, `${signed delta}` right-aligned, `<div class="sub" data-testid="row-running-balance">balance ${$X}</div>`.
3. Run `history.spec.ts` (6 tests).

**Visual parity check:** Running-balance card numeric font, monthly totals, payment row green delta, sub-line shows `balance $X.XX`.
**Commit:** `feat(history): timeline grouped by month with running balance and filters`.

---

### Slice 9 — Full-suite reconciliation
**Failing tests:** any cross-cutting flake or remaining regression.

1. Run `cd e2e && npm test` — all 5 projects must pass every spec.
2. Investigate every failure: prefer fixing the app over loosening the test. Loosening is only allowed when the test contradicts the mock; in that case fix the test *and* document why in the commit message.
3. Re-run `npm test` from `frontend/` (Vitest) — fix any failures.
4. Re-run `dotnet test` from `backend/` — fix any failures.
5. Re-run `dotnet build` and `npm run build` to confirm release-mode builds succeed.
6. Confirm there is no `console.error`, no `console.warn`, no unhandled promise rejection in any Playwright run (use `page.on('console', …)` in `global-setup` if needed to assert this).

**Commit:** `test: full suite green on all viewports — backend, frontend, e2e`.

---

### Slice 10 — Visual parity audit
**Failing tests:** none (no spec, but the goal explicitly requires it).

1. For each of the 7 screens, capture screenshots at `mobile-xs` (375×667), `tablet-md` (768×1024), and `desktop-lg` (1280×800).
2. Open the equivalent `docs/mocks/<screen>.html` in a browser at the same viewport. Lay side by side.
3. Walk a checklist per screen:
   - Layout structure (grid columns, gaps, alignment)
   - Typography (font, weight, size, letter-spacing)
   - Colors (every surface, ink, border, accent, owed-to-you / owed-by-you)
   - Spacing scale (`--s-1`…`--s-8`) and radii (`--r-1`…`--r-pill`)
   - Iconography (Unicode glyphs match)
   - Shadows / dividers / hairlines
   - Interactive states (hover, focus, active for buttons and chips)
4. Fix every deviation by editing the relevant component's SCSS — never by editing the mock.
5. Document any deliberate deviation under a new "Known visual deviations" section of this file with a reason.

**Commit:** `style: pixel-parity audit pass — components match mocks across xs / md / lg`.

---

### Slice 11 — Hardening and removal of dev-only seams
**Failing tests:** none.

1. Confirm the dev-only `TestSupportController` and the Playwright `_test/reset` call are clearly fenced (`Development` only) and that production builds do not register the controller. Add a small integration test that `POST /api/_test/reset` returns 404 in `Production` configuration.
2. Confirm CORS in production should *not* be wide-open. Add a `Cors:AllowedOrigins` config setting and only allow it in `Production`; keep `AllowAnyOrigin` in `Development` only.
3. Delete the unused `frontend/projects/domain` library (or finalize its purpose) — no half-finished pieces.
4. Remove any `console.log`, `TODO`, `FIXME`, `xtest`, `test.skip` lines from `frontend/` and `e2e/`.
5. Run the entire test matrix one last time.

**Commit:** `chore: remove dev seams from prod, lock down cors, clean dead code`.

---

## 4. Definition of done

The plan is complete when **all** of the following are true on a clean clone:

- [ ] `dotnet build` (from `backend/`) succeeds.
- [ ] `dotnet test` (from `backend/`) — **all** tests pass.
- [ ] `npm run build` (from `frontend/`) succeeds for both libs and app in production mode.
- [ ] `npm test` (from `frontend/`) — **all** Vitest specs pass.
- [ ] `npx playwright test` (from `e2e/`, with the dev server running) — **all** specs pass on **all** 5 viewport projects.
- [ ] Manually exercising the app (`npm start` + `dotnet run`) reproduces every screen with no console errors and no broken links.
- [ ] Visual parity audit (§Slice 10) is signed off; any deviations are documented in this file.
- [ ] No `TODO`, `FIXME`, `console.log`, `skip`, or commented-out code remains in production paths.
- [ ] CORS is restricted in production; `TestSupportController` is registered only in `Development`.
- [ ] The Angular `domain` lib is either populated with real types or removed.

When every box is ticked, this file's status line below is updated and the goal hook condition is satisfied.

---

## 5. Status

> _Not started._ Slices 0–11 ahead.

## 6. Known visual deviations

> _None recorded yet — populate during Slice 10._
