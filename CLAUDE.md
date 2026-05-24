# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

DueQ is a mobile-first web app for logging household bills and tracking what a partner owes (50/50 split, the partner tends to fall behind). Brief: `docs/idea.md`. Static UI mocks live in `docs/mocks/`. The product brief explicitly calls for "radically simple, very narrowly scoped features" — resist adding speculative abstractions.

**Speed is not a goal.** Optimize for clarity, correctness, and simplicity — not for delivery speed or runtime performance unless explicitly requested.

## Repository layout

- `backend/` — .NET 10 solution (`DueQ.sln`), Clean Architecture
- `frontend/` — Angular 21 workspace (npm)
- `e2e/` — Playwright end-to-end test suite (separate npm project)
- `docs/mocks/` — static HTML/CSS mockups used as the visual reference for the Angular app

## Backend (`backend/`)

`.NET 10` SDK pinned in `global.json` (`10.0.101`, `rollForward: latestFeature`). Solution layout follows Clean Architecture with dependency flow Api → Infrastructure → Application → Domain:

- `DueQ.Domain` — POCO entities only (`Bills/Bill.cs`, `Households/Household.cs`, `Payments/Payment.cs`). No dependencies.
- `DueQ.Application` — MediatR CQRS + FluentValidation. Each use case is its own folder under `<Aggregate>/Commands/<Name>/` or `<Aggregate>/Queries/<Name>/` containing the request, handler, and (for commands) validator. Persistence is accessed via the `IDueQContext` abstraction (`Abstractions/IDueQContext.cs`) — handlers must depend on this interface, never on `DueQContext` directly. `AddApplication()` in `Common/DependencyInjection.cs` wires MediatR + validators and registers `ValidationBehavior<,>` as an open pipeline behavior so every command runs its validators automatically. `NotFoundException` is the conventional way to signal a missing aggregate.
- `DueQ.Infrastructure` — EF Core 10 + SqlServer. `DueQContext` implements `IDueQContext`; entity configurations live in `Persistence/Configurations/`. `AddInfrastructure(IConfiguration)` reads the connection string named `"DueQ"` and registers the DbContext (defaulted to `Server=.\SQLEXPRESS;Database=DueQ;Trusted_Connection=True` in `appsettings.json`). Migrations live in `Persistence/Migrations/` and use `DueQContextDesignTimeFactory` for `dotnet ef` tooling.
- `DueQ.Api` — ASP.NET Core controllers (`Controllers/BillsController.cs`, `PaymentsController.cs`, `SettingsController.cs`, `DashboardController.cs`, `HistoryController.cs`). Controllers are thin: they translate HTTP into MediatR requests and return the resulting DTO. `Program.cs` calls `AddApplication()` + `AddInfrastructure(configuration)`, enables OpenAPI in Development, and registers `UseExceptionHandling()` (custom middleware in `Middleware/ExceptionHandlingMiddleware.cs`) which maps `ValidationException` and `NotFoundException` to RFC 7807 ProblemDetails responses. CORS is wide-open by default (suitable for the local Angular dev server).

### Backend commands (run from `backend/`)

```powershell
dotnet build                                            # build whole solution
dotnet run --project src/DueQ.Api                       # run the API
dotnet test                                             # run all test projects
dotnet test --filter "FullyQualifiedName~CreateBill"    # run a single test / class

# EF Core migrations
dotnet ef migrations add <Name> --project src/DueQ.Infrastructure --startup-project src/DueQ.Api
dotnet ef database update --project src/DueQ.Infrastructure --startup-project src/DueQ.Api
```

Tests use **xUnit + `Microsoft.EntityFrameworkCore.InMemory`** — substitute the in-memory provider for `IDueQContext` rather than mocking the interface.

## Frontend (`frontend/`)

Angular 21 multi-project workspace. The app and its three libraries are siblings under `projects/`:

- `due-q` — the application (prefix `app`, SCSS)
- `api` — HTTP/API client library (prefix `lib`)
- `domain` — domain models/types (prefix `lib`)
- `components` — shared UI components (prefix `lib`)

**Important:** `tsconfig.json` maps the library imports (`api`, `components`, `domain`) to `./dist/<lib>`, not to source. Libraries must be built before the app can resolve them. After modifying a library, rebuild it (or `ng build <lib> --watch`) or the app build will fail with module-not-found errors.

Tests use **Vitest** via `@angular/build:unit-test` (not Karma/Jasmine). Component styles use SCSS.

### Frontend commands (run from `frontend/`)

```powershell
npm start                          # ng serve due-q on http://localhost:4200
npm run build                      # production build of due-q
ng build <lib>                     # build a single library (api | components | domain)
ng build <lib> --watch             # rebuild lib on change
npm test                           # run vitest for all projects
ng test <project>                  # run vitest for one project
ng generate component <name> --project=due-q
```

## End-to-end tests (`e2e/`)

Standalone Playwright project (separate `package.json`). Page Objects live in `pages/`, specs in `tests/`. `playwright.config.ts` runs against `process.env.DUEQ_BASE_URL ?? 'http://localhost:4200'` and ships projects for `mobile-xs` (iPhone SE), `mobile-sm` (iPhone 12), and additional breakpoints — the suite enforces the mobile-first promise.

```powershell
cd e2e
npm install
npx playwright install              # one-time browser download
npm test                            # run all specs
npm run test:headed                 # watch them run
npx playwright test tests/bills.spec.ts        # single spec file
```

The Angular dev server must already be running (or set `DUEQ_BASE_URL` to a deployed instance).

## Conventions worth knowing

- **One folder per use case** in `DueQ.Application` (command/handler/validator co-located). Mirror this when adding new commands/queries.
- **Controllers are thin** — they construct the MediatR request, call `_mediator.Send(...)`, and return. No business logic in controllers.
- **HTTP error shape** — throw `NotFoundException` or `FluentValidation.ValidationException` from handlers; `ExceptionHandlingMiddleware` converts them to `404` / `400` ProblemDetails. Don't return error objects manually.
- **Update requests use a request DTO**, not the raw command — the route `id` is bound separately and merged into the command (see `BillsController.Update` and `Contracts/UpdateBillRequest.cs`).
- **Money rounding**: handlers round `Amount` to 2 decimals and trim string inputs before persisting (see `CreateBillHandler`). Follow this pattern in new handlers.
- **Partner share** is computed as `Amount / 2m` in the DTO projection — it is not stored on the entity.
- **EF Core access**: depend on `IDueQContext`, not on `DueQContext` directly. Use `Microsoft.EntityFrameworkCore` extension methods (`FirstOrDefaultAsync`, etc.) on the `DbSet`s exposed by the interface.
- **EF entity configuration** lives in `DueQ.Infrastructure/Persistence/Configurations/*Configuration.cs` (one per aggregate), wired in `DueQContext.OnModelCreating` via `ApplyConfigurationsFromAssembly`.
