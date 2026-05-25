# DueQ

DueQ is a small, mobile-first ledger for two people who split household bills 50/50.

Add a bill, record what your partner paid back, and keep one running balance: what is still owed.

.NET 10 Web API · EF Core 10 + SQLite · Angular 21 · Playwright

**[Implementation plan](docs/plan.md)** · **[UI mocks](docs/mocks/)** · **[Repo conventions](CLAUDE.md)**

---

## What is implemented

DueQ is intentionally narrow:

- Bills are always split in half.
- Payments reduce the running balance.
- Household settings store only your name and your partner's name.
- There is no auth, group splitting, currency conversion, or settlement algorithm.

The app currently includes these screens:

- Dashboard with greeting, current balance, monthly stats, and recent activity.
- Bills list grouped by month with All, Unsettled, and Settled filters.
- Bill detail with 50/50 split, settle/unsettle, delete confirmation, and 404 state.
- Add bill with validation and a live partner-share preview.
- Record payment with method selection, new-balance preview, and overpayment warning.
- History timeline with bill/payment filters and running balance rows.
- Settings form for the two household names.

On startup the API migrates the SQLite database and seeds an empty database with demo household data. The local database file is `backend/src/DueQ.Api/dueq.db` and is ignored by git.

## Architecture

```text
backend/                        .NET 10 solution
├─ src/
│  ├─ DueQ.Domain               Bill, Payment, Household entities and enums
│  ├─ DueQ.Application          CQRS commands/queries, validators, DTOs, IDueQContext
│  ├─ DueQ.Infrastructure       EF Core SQLite DbContext, migrations, seed data
│  └─ DueQ.Api                  ASP.NET Core controllers, CORS, error middleware
└─ tests/
   └─ DueQ.Application.Tests    xUnit handler tests with EF Core InMemory

frontend/                       Angular 21 workspace
└─ projects/
   ├─ due-q                     Routed standalone app
   ├─ api                       Typed HTTP client library
   └─ components                Shared presentational component library

e2e/                            Playwright test suite
└─ pages/, tests/               Page objects and specs across mobile/tablet/desktop

docs/
├─ mocks/                       Static HTML/CSS visual reference
└─ plan.md                      Current implementation status and remaining notes
```

The backend keeps the dependency flow one-way: `Api -> Infrastructure -> Application -> Domain`. Controllers translate HTTP requests into MediatR commands/queries, validation runs in the application pipeline, and persistence is behind `IDueQContext`.

The frontend app imports the built `api` and `components` libraries through workspace path aliases that point at `frontend/dist`.

## Prerequisites

- .NET SDK 10.0.101 or later, pinned in [backend/global.json](backend/global.json).
- Node.js 20+ and npm 10+.
- No external database is required for local development; the API uses SQLite by default.

## Run locally

Start the API:

```powershell
cd backend
dotnet restore
dotnet run --project src/DueQ.Api --launch-profile http
```

The HTTP API runs at `http://localhost:5054`.

In a second terminal, build the Angular libraries once and start the app:

```powershell
cd frontend
npm install
npx ng build api
npx ng build components
npm start
```

The web app runs at `http://localhost:4200` and points to `http://localhost:5054` through `frontend/projects/due-q/src/environments/environment.development.ts`.

For active library work, keep the libraries rebuilding in watch mode:

```powershell
npx ng build api --watch
npx ng build components --watch
```

## Run tests

Backend:

```powershell
cd backend
dotnet test
```

Frontend unit tests:

```powershell
cd frontend
npm test
```

Production frontend build:

```powershell
cd frontend
npx ng build api
npx ng build components
npx ng build due-q
```

End-to-end tests require the API to be running on `http://localhost:5054`. Playwright starts the Angular dev server itself unless `DUEQ_BASE_URL` is set.

```powershell
cd backend
dotnet run --project src/DueQ.Api --launch-profile http

# in another terminal
cd e2e
npm install
npx playwright install
npm test
```

Useful environment variables:

- `DUEQ_API_BASE_URL` changes the API URL used by Playwright global setup.
- `DUEQ_BASE_URL` points Playwright at an already-running frontend instead of starting one.

## Development notes

- Development CORS is wide open for the Angular dev server. Production CORS reads `Cors:AllowedOrigins`.
- `POST /api/_test/reset` is available only in `Development`; Playwright uses it to reset seed data before the suite.
- Static mocks in [docs/mocks](docs/mocks/) remain the visual reference for spacing, color, and component structure.
- Generated SQLite files, Angular build output, Playwright reports, and local settings are ignored by git.
