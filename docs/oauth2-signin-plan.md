# OAuth2 Sign-In, Create Account, Forgot Password — Implementation Plan

## Context

DueQ currently has no authentication. Anyone with the dev URL can read and write all bills, payments, and settings. We need to gate the app behind a sign-in screen so the household ledger is bound to a user account and the API rejects unauthenticated requests.

This plan adds three auth flows — sign-in, create-account, forgot-password — backed by a JWT-issuing API. The login flow follows the OAuth2 *Resource Owner Password Credentials* shape (username + password → access token) since the partners are a closed user set and we don't need a third-party IdP. Once shipped, every existing controller is `[Authorize]`d and the Angular app routes through `/sign-in` before reaching `/dashboard`.

The UI must match the existing mocks at `docs/mocks/sign-in.html`, `docs/mocks/create-account.html`, and `docs/mocks/forgot-password.html` with pixel-level parity — those are the gold standard.

Work is sliced vertically. Each slice begins with a **failing Playwright e2e test using the Page Object Model**, then drops down through controller → handler → DbContext until the test goes green (ATDD).

---

## Out of scope

- Real SMTP / email delivery. The forgot-password flow generates a reset token and surfaces the link via the API response body in `Development` only (logged to console). Production wiring is a later slice.
- Refresh tokens, OAuth2 authorization-code grant, social sign-in, MFA.
- A separate reset-password landing page (the mock doesn't exist). We will stub a minimal one reusing the auth shell so the token flow is testable end-to-end, but it is not held to gold-standard parity.
- Account lockout / rate limiting (note as a follow-up).

---

## Cross-cutting decisions

| Decision | Choice | Rationale |
|---|---|---|
| Login identifier | **Email** | Matches the mock label and `autocomplete="email"`. Unique index on `User.Email`. |
| Password hashing | **BCrypt.Net-Next** | Battle-tested, salt+work-factor baked in, no custom crypto. |
| Token type | **JWT (HS256)** | Symmetric signing key from `appsettings`/user-secrets; keeps infra simple. |
| Token storage | **`localStorage` (with `sessionStorage` opt-out)** | "Remember me" checked → localStorage; unchecked → sessionStorage. Single source of truth in an `AuthStore` service. |
| Token attachment | **`HttpInterceptor` in `api` library** | All existing services already use the `api` lib's `HttpClient`; one interceptor covers them. |
| Unauthorized response → client | **401 → clear token, redirect to `/sign-in`** | Handled in interceptor `catchError`. |
| Seed user | **EF Core `HasData`** in `UserConfiguration` (dev only) | One known account (`quinntynebrown@gmail.com` / `password123`) so e2e tests have a deterministic login. Test-reset endpoint re-seeds. |

---

## Vertical slices

Each slice ends in a green Playwright test on `mobile-xs` + `desktop-lg` and a working commit. Slices land in order — later slices depend on earlier infra.

### Slice 1 — Sign-in page renders with gold-standard parity (no backend yet)

**Failing e2e first** (`e2e/tests/sign-in.spec.ts`, `e2e/pages/SignInPage.ts`):
- POM extends `BasePage`, `path = '/sign-in'`.
- Asserts: brand mark + "DueQ" text visible, h1 "Sign in", "Welcome back…" subtitle, email + password inputs (by label), "Remember me" checkbox checked by default, "Forgot password?" link to `/forgot-password`, primary submit button, "No account yet? Create one" footer linking to `/create-account`.
- Visual regression — `expect(page).toHaveScreenshot()` snapshot at `mobile-xs` (reference image generated once approved).

**Frontend work:**
- New route `/sign-in` in `frontend/projects/due-q/src/app/app.routes.ts`, points to a new lazy-loaded `SignInPage` component under `frontend/projects/due-q/src/app/pages/sign-in/`.
- Port `.auth`, `.auth-brand`, `.auth-card`, `.auth-footer`, `.form-row-between`, `.checkbox`, `.fine-print` rules from `docs/mocks/styles.css` and the mock's `<style>` block into a new partial `frontend/projects/due-q/src/app/pages/_auth-shell.scss`, imported by all three auth pages. CSS variables (`--s-*`, `--ink`, `--surface`, `--r-3`, `--border-strong`, `--muted`, `--bg`, `--surface-2`) already exist in `frontend/projects/due-q/src/styles.scss`.
- Reuse `lib-brand-mark`, `lib-text-input`, `lib-form-field`, `lib-button` from the `components` library — confirm each has the props needed (label, type=password, autocomplete, block button). If `Button` does not currently support `btn-lg` + `btn-block` in combination, add an input. **Avoid creating a new component if an existing one fits.**
- Add a `CheckboxComponent` to the `components` library (selector `lib-checkbox`, ControlValueAccessor) — the mock's custom checkbox shape is reused across forms and doesn't have a current equivalent. Public-api re-export.
- The Shell (the layout that wraps existing pages with the sidebar/bottom-nav) must **not** wrap the auth routes. Either move existing pages under a parent `Shell` route and keep `/sign-in`, `/create-account`, `/forgot-password` as siblings outside, or guard via `data: { shell: false }`. Pick the route-tree restructure — cleaner.
- **Library rebuild:** after editing `components`, run `ng build components` (or `--watch`). The `tsconfig.json` aliases resolve from `dist/`.

**Backend work:** none in this slice.

**Acceptance:** Playwright test green; visual snapshot matches mock within tolerance.

---

### Slice 2 — `User` entity, table, and seed

**Failing test first** (`backend/tests/DueQ.Application.Tests/Users/UserSeedTests.cs`):
- Spins up the in-memory `DueQContext` via `DueQContextFactory.Create()` and asserts `Users.Single(u => u.Email == "quinntynebrown@gmail.com")` exists.

**Backend work:**
- `backend/src/DueQ.Domain/Users/User.cs` — POCO with `Id` (Guid), `Email` (string, lower-cased), `Name` (string), `PasswordHash` (string), `CreatedUtc` (DateTime).
- `backend/src/DueQ.Application/Abstractions/IDueQContext.cs` — add `DbSet<User> Users { get; }`.
- `backend/src/DueQ.Infrastructure/Persistence/Configurations/UserConfiguration.cs` — table `Users`, unique index on `Email`, max-lengths set, `HasData` seed for the dev user (BCrypt hash generated once and committed as a string literal — note in code that this is dev-only).
- `backend/src/DueQ.Infrastructure/Persistence/DueQContext.cs` — add `public DbSet<User> Users => Set<User>();`.
- EF migration: `dotnet ef migrations add AddUsers --project src/DueQ.Infrastructure --startup-project src/DueQ.Api`.

**Acceptance:** new handler test green; `dotnet ef database update` applies cleanly.

---

### Slice 3 — Login command, JWT issuance, sign-in wired up

**Failing e2e first** (`e2e/tests/sign-in.spec.ts` — add scenarios):
- Filling valid creds (`quinntynebrown@gmail.com` / `password123`) + submitting → redirects to `/dashboard` and the dashboard greeting is visible.
- Filling wrong password → an inline error appears (`"Email or password is incorrect"`), no navigation occurs, focus returns to password field.

**Failing handler test first** (`backend/tests/DueQ.Application.Tests/Auth/LoginHandlerTests.cs`):
- Seeded user + correct password → handler returns `LoginResult` with non-empty token whose claims include `sub=userId` and `email`.
- Wrong password / unknown email → throws `ValidationException` (single error key `"Credentials"` → message `"Email or password is incorrect"`). One generic error to avoid leaking which half is wrong.

**Backend work:**
- Add NuGet packages to `DueQ.Api`: `Microsoft.AspNetCore.Authentication.JwtBearer` (10.x). Add `BCrypt.Net-Next` to `DueQ.Application` (or a new `DueQ.Application.Auth` folder).
- `backend/src/DueQ.Application/Abstractions/IPasswordHasher.cs` — `Hash(string)`, `Verify(string password, string hash)`.
- `backend/src/DueQ.Infrastructure/Auth/BCryptPasswordHasher.cs` — implements `IPasswordHasher` using BCrypt.
- `backend/src/DueQ.Application/Abstractions/IJwtTokenGenerator.cs` — `string Generate(User user)`.
- `backend/src/DueQ.Infrastructure/Auth/JwtTokenGenerator.cs` — reads `IOptions<JwtOptions>` (key, issuer, audience, lifetime), signs HS256, embeds `sub`, `email`, `name` claims and `exp`.
- `backend/src/DueQ.Application/Auth/Commands/Login/LoginCommand.cs` — `record LoginCommand(string Email, string Password) : IRequest<LoginResult>` plus `LoginValidator` (non-empty email format, non-empty password) and `LoginHandler` (find user by lower-cased email, verify hash, generate token; throw `ValidationException` on either failure path).
- `backend/src/DueQ.Application/Auth/Common/LoginResult.cs` — `record LoginResult(string Token, UserDto User)` and `UserDto(Guid Id, string Email, string Name)`.
- `backend/src/DueQ.Api/Controllers/AuthController.cs` — thin, mirrors `BillsController` shape. `[AllowAnonymous]` on `POST /api/auth/login`.
- `backend/src/DueQ.Api/Program.cs` — register `JwtOptions` from config section `"Jwt"`, wire `AddAuthentication().AddJwtBearer(...)`, call `app.UseAuthentication(); app.UseAuthorization();` after the exception middleware and after CORS.
- `appsettings.json` — add `"Jwt": { "Issuer": "DueQ", "Audience": "DueQ", "LifetimeMinutes": 60 }`. The `Key` lives in user-secrets (dev) and Azure App Service config (prod), never in committed JSON. README/CLAUDE.md note added.

**Frontend work:**
- `frontend/projects/api/src/lib/auth/auth.service.ts` — `login({ email, password })` → POST `/api/auth/login`; `logout()`; exposes the login response shape from `frontend/projects/api/src/lib/models/login-result.ts` and `user.ts`.
- `frontend/projects/api/src/lib/auth/auth-store.ts` — small injectable holding `token: Signal<string | null>` and `user: Signal<User | null>`. Reads from `localStorage` or `sessionStorage` on init; `setToken(token, { remember })` writes accordingly; `clear()` wipes both.
- `frontend/projects/api/src/lib/auth/auth.interceptor.ts` — functional `HttpInterceptorFn` that attaches `Authorization: Bearer <token>` if present, and on `401` clears the store and routes to `/sign-in`.
- Wire interceptor in `frontend/projects/due-q/src/app/app.config.ts` via `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`.
- Re-export the auth surface from `frontend/projects/api/src/public-api.ts`.
- `SignInPage` component — Reactive Forms, submit calls `AuthService.login`, stores token via `AuthStore`, navigates to `/dashboard`. On server-error displays the generic message above the button.
- **Rebuild `api` library** before app build.

**Acceptance:** e2e green; LoginHandler tests green; existing dashboard test still runs because the e2e fixture sets up an authed session (see Slice 4).

---

### Slice 4 — `[Authorize]` everywhere, route guard, sign-out

**Failing e2e first:**
- New `e2e/tests/auth-routing.spec.ts`: unauthenticated visit to `/dashboard` redirects to `/sign-in?returnUrl=%2Fdashboard`; after sign-in the user lands back on `/dashboard`.
- Existing specs (`dashboard.spec.ts`, `bills.spec.ts`, etc.) **will fail** until the fixture signs the user in. Update `e2e/fixtures.ts` to add an auto-fixture that, after `resetDueQ` re-seeds the user, calls `POST /api/auth/login` and writes the token to `localStorage` via `page.addInitScript` before each test. This is the single change that flips every existing spec back to green.

**Backend work:**
- Add `[Authorize]` at the controller level on `BillsController`, `PaymentsController`, `SettingsController`, `DashboardController`, `HistoryController`. Keep `[AllowAnonymous]` on `AuthController` and on the existing `/api/_test/reset` dev endpoint.
- Confirm `ExceptionHandlingMiddleware` runs *before* `UseAuthentication` so unhandled exceptions inside auth still return ProblemDetails; 401/403 are emitted by the auth pipeline as-is.

**Frontend work:**
- `frontend/projects/due-q/src/app/auth/auth.guard.ts` — `CanActivateFn` reading `AuthStore.token()`. If absent, `router.createUrlTree(['/sign-in'], { queryParams: { returnUrl: state.url } })`. Apply to every existing top-level route via `canActivate: [authGuard]`. `/sign-in`, `/create-account`, `/forgot-password` remain open.
- `SignInPage` reads `returnUrl` from the route and navigates there post-login (defaulting to `/dashboard`).
- Add a sign-out menu item to the shell (wherever the current settings link lives) that calls `AuthStore.clear()` then `router.navigate(['/sign-in'])`.

**Acceptance:** e2e green across all specs; full Playwright matrix passes on `mobile-xs` + `desktop-lg`.

---

### Slice 5 — Create account flow

**Failing e2e first** (`e2e/tests/create-account.spec.ts`, `e2e/pages/CreateAccountPage.ts`):
- Navigate to `/create-account`; brand, h1 "Create your account", subtitle, three fields (Your name, Email, Password with hint "(at least 8 characters)"), "Create account" button, fine-print Terms/Privacy, "Already have an account? Sign in" footer linking to `/sign-in`.
- Visual snapshot at `mobile-xs`.
- Fill valid form with a new email → user persisted → auto-signed-in → lands on `/dashboard`.
- Duplicate email → inline error `"An account with that email already exists"`.

**Failing handler tests:**
- `RegisterHandlerTests` — valid input persists user with hashed password, returns token; duplicate email throws `ValidationException`; password under 8 chars throws via validator.

**Backend work:**
- `backend/src/DueQ.Application/Auth/Commands/Register/RegisterCommand.cs` — `record RegisterCommand(string Name, string Email, string Password) : IRequest<LoginResult>` + `RegisterValidator` (name non-empty trimmed, email format, password ≥ 8 chars) + `RegisterHandler` (lower-case + trim email, check uniqueness, hash, save, generate token).
- `AuthController` — `POST /api/auth/register` `[AllowAnonymous]`.

**Frontend work:**
- `CreateAccountPage` under `frontend/projects/due-q/src/app/pages/create-account/`, reusing `_auth-shell.scss` partial and `lib-text-input` / `lib-button`. Route `/create-account` added (outside the Shell layout).
- `AuthService.register({ name, email, password })` → POST `/api/auth/register`, then `AuthStore.setToken(result.token, { remember: true })` and navigate to `/dashboard`.
- Rebuild `api` lib if its public surface changed.

**Acceptance:** e2e green; visual snapshot matches `create-account.html`.

---

### Slice 6 — Forgot password flow

**Failing e2e first** (`e2e/tests/forgot-password.spec.ts`, `e2e/pages/ForgotPasswordPage.ts`):
- Visit `/forgot-password`; brand, h1 "Reset your password", subtitle, email field, "Send reset link" button, "Back to sign in" footer.
- Submitting any email shows a static success card ("Check your inbox at *email*. If an account exists, a reset link is on its way."). Same response for known and unknown emails — **no user enumeration**.
- Visual snapshot at `mobile-xs`.

**Backend work:**
- `backend/src/DueQ.Domain/Users/PasswordResetToken.cs` — `Id` (Guid), `UserId` (Guid FK), `TokenHash` (SHA-256 of the raw token; we store the hash, return the raw value once), `ExpiresUtc`, `UsedUtc?`.
- `IDueQContext.PasswordResetTokens` `DbSet`; `PasswordResetTokenConfiguration`; EF migration `AddPasswordResetTokens`.
- `ForgotPasswordCommand` + handler + validator (email format). Handler:
  - Look up user by email. If exists, generate 32-byte random token, store SHA-256 hash with 60-minute expiry, log the reset URL (`https://app/reset-password?token=<raw>`) via `ILogger` at `Information`. In `Development` only, also return the raw token on the response so tests/dev can use it.
  - **Always returns 200** with a generic ack — same shape whether or not a user was found.
- `ResetPasswordCommand` (used by Slice-6.5 below): accept `token` + `newPassword`, look up the hashed token, verify not used and not expired, update `User.PasswordHash`, mark token `UsedUtc`. Generic error otherwise.
- `AuthController` — `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`, both `[AllowAnonymous]`.

**Frontend work:**
- `ForgotPasswordPage` — single-field form + post-submit success state in the same card (no navigation). Reuse auth shell.
- `AuthService.forgotPassword({ email })`.

**Slice 6.5 — Reset password page (stub, no mock).**
- Route `/reset-password` reads `?token=…` from the URL. Form with new-password + confirm fields. On submit calls `AuthService.resetPassword({ token, newPassword })`, then navigates to `/sign-in` with a flash "Password updated — sign in again." Visual parity: reuse `_auth-shell.scss` with a "Choose a new password" heading. Not held to gold-standard parity since no mock exists — call this out in a code comment and `docs/oauth2-signin-plan.md`.
- E2E: `forgot-password.spec.ts` exercises the full token round-trip using the dev-mode token returned in the forgot-password response.

**Acceptance:** all auth specs green; visual snapshot matches `forgot-password.html` (the reset-password page is functional but not snapshotted).

---

## Files changed (representative — full list emerges per-slice)

**Backend**
- `src/DueQ.Domain/Users/{User.cs,PasswordResetToken.cs}` *(new)*
- `src/DueQ.Application/Abstractions/{IDueQContext.cs,IPasswordHasher.cs,IJwtTokenGenerator.cs}` *(edit/new)*
- `src/DueQ.Application/Auth/Commands/{Login,Register,ForgotPassword,ResetPassword}/*` *(new — one folder per command, mirroring `Bills/Commands/CreateBill`)*
- `src/DueQ.Application/Auth/Common/{LoginResult.cs,UserDto.cs,JwtOptions.cs}` *(new)*
- `src/DueQ.Application/Common/DependencyInjection.cs` — nothing structural; MediatR auto-picks up new handlers
- `src/DueQ.Infrastructure/Auth/{BCryptPasswordHasher.cs,JwtTokenGenerator.cs}` *(new)*
- `src/DueQ.Infrastructure/Persistence/Configurations/{UserConfiguration.cs,PasswordResetTokenConfiguration.cs}` *(new)*
- `src/DueQ.Infrastructure/Persistence/DueQContext.cs` — add `DbSet<User>`, `DbSet<PasswordResetToken>`
- `src/DueQ.Infrastructure/Persistence/Migrations/*` — two new migrations
- `src/DueQ.Infrastructure/DependencyInjection.cs` — register `IPasswordHasher`, `IJwtTokenGenerator`, bind `JwtOptions`
- `src/DueQ.Api/Program.cs` — `AddAuthentication().AddJwtBearer(...)`, `UseAuthentication/UseAuthorization`
- `src/DueQ.Api/Controllers/AuthController.cs` *(new)*; add `[Authorize]` to the five existing controllers
- `src/DueQ.Api/appsettings.json` — `"Jwt"` section (no `Key`); user-secrets / Azure config carry the key
- `tests/DueQ.Application.Tests/Auth/{LoginHandlerTests.cs,RegisterHandlerTests.cs,ForgotPasswordHandlerTests.cs,ResetPasswordHandlerTests.cs}` *(new)*
- `tests/DueQ.Application.Tests/Users/UserSeedTests.cs` *(new)*

**Frontend**
- `projects/api/src/lib/auth/{auth.service.ts,auth-store.ts,auth.interceptor.ts}` *(new)*
- `projects/api/src/lib/models/{login-result.ts,user.ts,register-request.ts}` *(new)*
- `projects/api/src/public-api.ts` — re-exports
- `projects/components/src/lib/checkbox/checkbox.{ts,html,scss}` *(new)* + `public-api.ts` re-export
- `projects/due-q/src/app/pages/{sign-in,create-account,forgot-password,reset-password}/*` *(new)*
- `projects/due-q/src/app/pages/_auth-shell.scss` *(new — shared auth-card styles ported from mock)*
- `projects/due-q/src/app/app.routes.ts` — restructure: existing pages move under a `Shell` parent route; auth pages are siblings
- `projects/due-q/src/app/auth/auth.guard.ts` *(new)*
- `projects/due-q/src/app/app.config.ts` — register `authInterceptor`
- `projects/due-q/src/environments/environment.ts` — unchanged (API base URL already configured)

**E2E**
- `e2e/pages/{SignInPage.ts,CreateAccountPage.ts,ForgotPasswordPage.ts}` + index.ts re-exports
- `e2e/tests/{sign-in.spec.ts,create-account.spec.ts,forgot-password.spec.ts,auth-routing.spec.ts}` *(new)*
- `e2e/fixtures.ts` — add auto-fixture that signs in the seeded user via `localStorage.setItem` for all existing specs

---

## Reused existing code

- MediatR + FluentValidation pipeline (`ValidationBehavior<,>` already converts validator failures to `ValidationException`, which the existing `ExceptionHandlingMiddleware` maps to RFC 7807 400 responses — no new error path needed).
- `NotFoundException` is **not** used in auth flows; generic 400 via `ValidationException` keeps user enumeration off.
- `IDueQContext` abstraction + `DueQContextFactory` in tests — handlers depend on the interface as today; tests get an in-memory provider.
- `lib-text-input`, `lib-form-field`, `lib-button`, `lib-brand-mark` from the `components` library.
- Global SCSS — `.btn`, `.btn-primary`, `.btn-lg`, `.btn-block`, `.input`, `.field`, all `--*` design tokens already declared in `frontend/projects/due-q/src/styles.scss`. The auth shell partial only adds the centering layout and card chrome from the mock's inline `<style>`.
- `e2e/pages/BasePage.ts` (`goto()`, page-heading helpers) and `e2e/fixtures.ts` (`resetDueQ` auto-fixture).

---

## Verification

Per-slice (must all pass before that slice merges):

1. **Backend**:
   ```powershell
   dotnet build
   dotnet test
   dotnet ef database update --project src/DueQ.Infrastructure --startup-project src/DueQ.Api
   ```
2. **Frontend**:
   ```powershell
   ng build api && ng build components && ng build domain
   npm run build       # full app build
   npm test            # vitest
   ```
3. **E2E** (Angular dev server must be running on :4200, API on :5054):
   ```powershell
   cd e2e
   npm test                                            # full matrix
   npx playwright test tests/sign-in.spec.ts --project=mobile-xs
   npx playwright test --update-snapshots              # only after a UI change you intentionally made
   ```
4. **Manual smoke** (browser):
   - Visit `/dashboard` while signed out → redirected to `/sign-in?returnUrl=%2Fdashboard`.
   - Sign in with seeded creds → land on `/dashboard`.
   - Open DevTools → Application → Local Storage → confirm token present; refresh the page → still signed in.
   - Uncheck "Remember me", sign in → token in `sessionStorage`, not `localStorage`; close tab → next visit is signed out.
   - Create-account with a fresh email → auto-signed-in.
   - Forgot-password → confirmation card shown; in `Development`, the response payload contains the raw token; pasting `/reset-password?token=…` and submitting a new password lets you sign in with the new password.
   - 401 from any API call (manually clear token then trigger a request) → interceptor redirects to `/sign-in`.

---

## After ExitPlanMode is approved

Copy this file to `docs/oauth2-signin-plan.md` as the first action of Slice 1. It will live alongside `docs/idea.md` so the team can see why this work exists and how the slices break down.
