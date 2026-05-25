# DueQ

**A radically simple, mobile-first ledger for splitting household bills with a partner.**

Log a bill. DueQ splits it in half. Record what your partner pays. See what's still owed.

.NET 10 · Angular 21 · EF Core · Mobile-first PWA

**[Documentation](docs/)** · **[UI Mocks](docs/mocks/)** · **[Contributing](CONTRIBUTING.md)**

---

> **One bill in. One number out: what your partner owes you.**
> No groups. No multi-currency. No settlement algorithms. Just two people, one running balance.

## Why DueQ

Splitwise, Tricount, and Settle Up are built for trips, roommates, and group dinners — many people, many splits, many edge cases. They are overkill for the most common case: **two people splitting recurring household bills 50/50, with one partner who tends to fall behind.**

**DueQ fixes this.** A bill is one row. The split is always half. The only number that matters is how much your partner currently owes you. That's the whole product.

```text
Hydro          $142.00    ·  partner owes $71.00   ·  unsettled
Internet        $89.99    ·  partner owes $44.99   ·  settled
Groceries      $312.50    ·  partner owes $156.25  ·  unsettled
─────────────────────────────────────────────────────────────
Balance owed to you:  $227.25
```

```bash
git clone https://github.com/<you>/DueQ && cd DueQ
dotnet run --project backend/src/DueQ.Api    # API on https://localhost:5001
cd frontend && npm install && npm start      # App on http://localhost:4200
```

## The three promises

### 1. Radically simple

The product brief is seven lines (`docs/idea.md`) and every PR is measured against it. Features that don't serve "two people, one balance" don't ship.

- **One entity, one split** — bills are halved automatically; no per-bill share configuration
- **Two states** — a bill is either `Unsettled` or `Settled`. That's the whole state machine.
- **No accounts, no auth on day one** — the app is for you and your partner, not a marketplace
- **No speculative abstractions** — handlers depend on `IDueQContext`, not on layers of repositories and services that nobody asked for

### 2. Mobile-first by default

Bills get logged on a phone, standing in the kitchen, ten seconds after the email arrives. Every screen is designed for that moment first and a desktop browser second.

- **xs → xl breakpoints** — designed to be usable on small phones, then scaled up
- **Thumb-reachable primary actions** — "Add bill" and "Record payment" sit where your thumb already is
- **Installable PWA** — add to home screen, works offline for read, syncs when back online
- **Static HTML mocks** under [`docs/mocks/`](docs/mocks/) are the authoritative visual reference; the Angular app must match them

### 3. Own your data

DueQ is self-hosted. Your bill history lives in your database, not a SaaS dashboard.

- **SQL Server** today (LocalDB or SQLEXPRESS); swap providers via EF Core if you need Postgres/SQLite — handlers depend on the `IDueQContext` abstraction in `DueQ.Application/Abstractions/`
- **CQRS via MediatR** — every command and query is one folder, easy to read, easy to extend
- **FluentValidation** wired as a MediatR pipeline behavior — no validation runs in controllers
- **xUnit + EF Core InMemory** — application tests run without a database, in seconds

## Architecture

```
backend/                        .NET 10 solution (Clean Architecture)
├─ src/
│  ├─ DueQ.Domain               POCO entities (Bill, Payment, Household)
│  ├─ DueQ.Application          CQRS use cases, IDueQContext abstraction
│  ├─ DueQ.Infrastructure       EF Core DbContext + entity configurations + migrations
│  └─ DueQ.Api                  ASP.NET Core controllers (Bills, Payments, Settings, Dashboard, History)
└─ tests/
   └─ DueQ.Application.Tests    xUnit + EF Core InMemory

frontend/                       Angular 21 workspace
└─ projects/
   ├─ due-q                     The app
   ├─ api                       Typed HTTP client (library)
   ├─ domain                    Shared models (library)
   └─ components                Shared UI components (library)

e2e/                            Playwright suite (mobile-xs through desktop breakpoints)
└─ pages/, tests/               Page Objects + specs

docs/
├─ idea.md                      The seven-line product brief
└─ mocks/                       Static HTML mocks — visual source of truth
```

Dependency flow is one-way: `Api → Infrastructure → Application → Domain`. The Domain layer has no dependencies. The Application layer depends on abstractions; concrete EF Core wiring lives in Infrastructure. Controllers stay thin — they translate HTTP into MediatR requests and return the resulting DTO; cross-cutting concerns (validation, error mapping) run in MediatR pipeline behaviors and ASP.NET middleware.

## Get started

### Prerequisites

- **.NET SDK 10.0.101** or later (pinned in `backend/global.json`)
- **Node.js 20+** and **npm 10+**
- A SQL Server instance (LocalDB is fine for development)

### Run the backend

```powershell
cd backend
dotnet build
dotnet run --project src/DueQ.Api
```

### Run the frontend

The Angular workspace contains three libraries (`api`, `components`, `domain`) that the app imports via path aliases pointing to `dist/`. Build the libraries before serving the app:

```powershell
cd frontend
npm install
ng build api
ng build components
ng build domain
npm start
```

For active library development, run each in a separate terminal with `ng build <lib> --watch`.

### Run the tests

```powershell
# backend
cd backend && dotnet test

# single test class
dotnet test --filter "FullyQualifiedName~CreateBillHandler"

# frontend (Vitest)
cd frontend && npm test

# end-to-end (Playwright; dev server must be running)
cd e2e && npm install && npx playwright install && npm test
```

## Contributing

DueQ is intentionally narrow. Before opening a PR for a new feature, please open a discussion and explain how it serves the seven-line brief. Bug fixes and UI polish that match the mocks are always welcome.

- Read [`CLAUDE.md`](CLAUDE.md) for repo conventions and the CQRS folder layout
- Match the visual reference in [`docs/mocks/`](docs/mocks/) — pixel-level deviations count as bugs
- One folder per use case under `DueQ.Application/<Aggregate>/Commands|Queries/<Name>/`
- Money is rounded to two decimals at the handler boundary; strings are trimmed before persisting

## License

MIT — see [`LICENSE`](LICENSE).
