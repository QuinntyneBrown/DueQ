import { expect, test as base } from '@playwright/test';
import { ForgotPasswordPage } from '../pages';

// /forgot-password is reachable while unauthenticated, so this spec opts out
// of the auto-signed-in fixture.
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

test.describe('Forgot password page', () => {
  test('renders brand, heading, subtitle, email field, submit, and back-to-sign-in link', async ({
    page,
  }) => {
    const forgot = new ForgotPasswordPage(page);
    await forgot.goto();

    await expect(forgot.pageHeading()).toBeVisible();
    await expect(page.getByText(/we'll send you a reset link/i)).toBeVisible();
    await expect(forgot.emailInput()).toBeVisible();
    await expect(forgot.submitButton()).toBeVisible();
    await expect(forgot.backToSignInLink()).toHaveAttribute('href', /\/sign-in$/);
  });

  test('shows a generic success card for a known email', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);
    await forgot.goto();

    await forgot.submit('quinntynebrown@gmail.com');

    await expect(forgot.successCard()).toContainText(/Check your inbox at quinntynebrown@gmail.com/i);
  });

  test('shows the same success card for an unknown email — no enumeration', async ({ page }) => {
    const forgot = new ForgotPasswordPage(page);
    await forgot.goto();

    await forgot.submit('nobody-here-ever@example.com');

    await expect(forgot.successCard()).toContainText(/Check your inbox at nobody-here-ever@example.com/i);
  });

  test('full reset round-trip: token from API → reset-password → sign in with new password', async ({
    page,
    request,
  }) => {
    // 1. Request a reset link directly via the API; in Development the response
    //    body returns the raw token so we don't have to mock email delivery.
    const response = await request.post(`${API_BASE_URL}/api/auth/forgot-password`, {
      data: { email: 'quinntynebrown@gmail.com' },
    });
    expect(response.ok()).toBeTruthy();
    const { devToken } = (await response.json()) as { devToken: string };
    expect(devToken).toBeTruthy();

    // 2. Visit /reset-password?token=… and set a new password.
    await page.goto(`/reset-password?token=${encodeURIComponent(devToken)}`);
    await page.getByLabel(/^New password$/i).fill('brand-new-secret');
    await page.getByLabel(/^Confirm password$/i).fill('brand-new-secret');
    await page.getByRole('button', { name: /^Set new password$/ }).click();

    // 3. We're redirected to /sign-in; the new password works.
    await expect(page).toHaveURL(/\/sign-in$/);
    await page.getByLabel(/Email/i).fill('quinntynebrown@gmail.com');
    await page.getByLabel(/Password/i).fill('brand-new-secret');
    await page.getByRole('button', { name: /^Sign in$/ }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
