import { test as base } from '@playwright/test';

const API_BASE_URL = process.env.DUEQ_API_BASE_URL ?? 'http://localhost:5054';
const SEEDED_EMAIL = 'quinntynebrown@gmail.com';
const SEEDED_PASSWORD = 'password123';

interface LoginResult {
  readonly token: string;
  readonly user: { readonly id: string; readonly email: string; readonly name: string };
}

async function fetchSeededLogin(): Promise<LoginResult> {
  const url = `${API_BASE_URL}/api/auth/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: SEEDED_EMAIL, password: SEEDED_PASSWORD }),
  });
  if (!response.ok) {
    throw new Error(
      `Per-test login failed: POST ${url} → ${response.status}. Is the dev user seeded?`,
    );
  }
  return (await response.json()) as LoginResult;
}

/**
 * Re-export `test` and `expect` with auto-fixtures that:
 *  1. POST to the Development-only `/api/_test/reset` endpoint before every test
 *     so mutating tests stay deterministic across suite/viewport order.
 *  2. Authenticate the seeded user (POST /api/auth/login) and inject the token
 *     + user JSON into both localStorage and sessionStorage via `addInitScript`
 *     so the in-app `AuthStore` rehydrates as signed-in on first navigation.
 *
 * Implemented as separate auto-fixtures so they don't shadow Playwright's
 * built-in `page` lifecycle.
 *
 * Specs that need to assert the unauthenticated UI (the `/sign-in` redirect)
 * should import directly from `@playwright/test` to opt out of the
 * auto-signed-in fixture.
 */
export const test = base.extend<{ resetDueQ: void; signedIn: void }>({
  resetDueQ: [
    async ({}, use) => {
      const response = await fetch(`${API_BASE_URL}/api/_test/reset`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(
          `Per-test reset failed: POST ${API_BASE_URL}/api/_test/reset → ${response.status}. ` +
            `Is the DueQ API running?`,
        );
      }
      await use();
    },
    { auto: true },
  ],

  signedIn: [
    async ({ page }, use) => {
      const result = await fetchSeededLogin();
      await page.addInitScript(
        ([token, user]) => {
          try {
            localStorage.setItem('dueq.auth.token', token);
            localStorage.setItem('dueq.auth.user', user);
          } catch {
            // ignore — happens in about:blank contexts where storage is blocked
          }
        },
        [result.token, JSON.stringify(result.user)] as const,
      );
      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
