import { expect, test as base } from '@playwright/test';

// This spec doesn't import from ../fixtures because it specifically tests the
// UNAUTHENTICATED state — the fixture auto-injects a token which would defeat
// the redirect check. We re-implement the per-test reset locally so the dev
// user remains seeded.
const API_BASE_URL = process.env.DUEQ_API_BASE_URL ?? 'http://localhost:5054';

const test = base.extend<{ resetDueQ: void }>({
  resetDueQ: [
    async ({}, use) => {
      const response = await fetch(`${API_BASE_URL}/api/_test/reset`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Per-test reset failed: ${response.status}`);
      }
      await use();
    },
    { auto: true },
  ],
});

test.describe('auth routing', () => {
  test('unauthenticated visit to /dashboard redirects to /sign-in?returnUrl=%2Fdashboard', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/sign-in\?returnUrl=%2Fdashboard$/);
  });

  test('signing in returns the user to the originally requested URL', async ({ page }) => {
    await page.goto('/history');
    await expect(page).toHaveURL(/\/sign-in\?returnUrl=%2Fhistory$/);

    await page.getByLabel(/Email/i).fill('quinntynebrown@gmail.com');
    await page.getByLabel(/Password/i).fill('password123');
    await page.getByRole('button', { name: /^Sign in$/ }).click();

    await expect(page).toHaveURL(/\/history$/);
  });
});
