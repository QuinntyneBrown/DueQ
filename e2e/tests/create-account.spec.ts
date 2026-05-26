import { expect, test as base } from '@playwright/test';
import { CreateAccountPage } from '../pages';

// /create-account is reachable while unauthenticated, so this spec opts out of
// the auto-signed-in fixture.
const API_BASE_URL = process.env.DUEQ_API_BASE_URL ?? 'http://localhost:5054';

const test = base.extend<{ resetDueQ: void }>({
  resetDueQ: [
    async ({}, use) => {
      const response = await fetch(`${API_BASE_URL}/api/_test/reset`, { method: 'POST' });
      if (!response.ok) throw new Error(`Per-test reset failed: ${response.status}`);
      await use();
    },
    { auto: true },
  ],
});

test.describe('Create account page', () => {
  test('renders brand, heading, fields, fine print, and sign-in footer', async ({ page }) => {
    const create = new CreateAccountPage(page);
    await create.goto();

    await expect(page.getByText('DueQ', { exact: true }).first()).toBeVisible();
    await expect(create.pageHeading()).toBeVisible();
    await expect(page.getByText(/Start a household ledger/i)).toBeVisible();

    await expect(create.nameInput()).toBeVisible();
    await expect(create.emailInput()).toBeVisible();
    await expect(create.passwordInput()).toBeVisible();
    await expect(create.passwordInput()).toHaveAttribute('autocomplete', 'new-password');

    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
    await expect(page.getByText(/Terms/i)).toBeVisible();
    await expect(create.signInLink()).toHaveAttribute('href', /\/sign-in$/);
  });

  test('valid form creates the account, auto-signs in, and lands on /dashboard', async ({
    page,
  }) => {
    const unique = `slice5+${Date.now()}@example.com`;
    const create = new CreateAccountPage(page);
    await create.goto();

    await create.fill('Alex Doe', unique, 'password-strong');
    await create.submit();

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('duplicate email shows an inline error and stays on /create-account', async ({
    page,
  }) => {
    const create = new CreateAccountPage(page);
    await create.goto();

    // Re-using the seeded dev user's email triggers the uniqueness validator.
    await create.fill('Some Other Person', 'quinntynebrown@gmail.com', 'password-strong');
    await create.submit();

    await expect(create.errorMessage()).toContainText(/already exists/i);
    await expect(page).toHaveURL(/\/create-account$/);
  });
});
