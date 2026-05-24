# DueQ — End-to-end tests

Playwright + TypeScript suite for the DueQ web app, using the Page Object Model.

## Layout

```
e2e/
├── pages/        Page objects — one per screen, all extending BasePage
└── tests/        Spec files — one per screen + cross-cutting navigation
```

## Running

```bash
npm install
npx playwright install
npm test
```

The config starts the Angular dev server (`npm --prefix ../frontend start`) on
`http://localhost:4200` automatically. Point at a different URL with
`DUEQ_BASE_URL=https://staging.example.com npm test`.

The suite runs against five viewport projects (mobile-xs, mobile-sm, tablet-md,
desktop-lg, desktop-xl) to match the mobile-first / xs→xl responsive scope.

## Status

All tests are expected to **fail** today — no screens are implemented yet.
The specs describe the target behaviour drawn from `docs/mocks/`.
