import { expect, test } from '../fixtures';
import { SignInPage } from '../pages';

test.describe('Sign-in page', () => {
  test('renders the auth shell with brand, heading, and footer link', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();

    await expect(signIn.brandText()).toBeVisible();
    await expect(signIn.pageHeading()).toBeVisible();
    await expect(signIn.subtitle()).toBeVisible();
  });

  test('shows email + password inputs and the remember-me checkbox is checked by default', async ({
    page,
  }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();

    await expect(signIn.emailInput()).toBeVisible();
    await expect(signIn.emailInput()).toHaveAttribute('type', 'email');
    await expect(signIn.emailInput()).toHaveAttribute('autocomplete', 'email');

    await expect(signIn.passwordInput()).toBeVisible();
    await expect(signIn.passwordInput()).toHaveAttribute('type', 'password');
    await expect(signIn.passwordInput()).toHaveAttribute('autocomplete', 'current-password');

    await expect(signIn.rememberMe()).toBeChecked();
  });

  test('links to forgot-password and create-account', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();

    await expect(signIn.forgotPasswordLink()).toHaveAttribute('href', /\/forgot-password$/);
    await expect(signIn.footerCreateLink()).toHaveAttribute('href', /\/create-account$/);
  });

  test('submit button is visible and a button (not a link)', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();

    await expect(signIn.submitButton()).toBeVisible();
  });

  test('does not render the authed shell chrome (no sidebar, no bottom nav)', async ({
    page,
  }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();

    await expect(page.locator('.app-sidebar')).toHaveCount(0);
    await expect(page.locator('.bottom-nav')).toHaveCount(0);
  });

  test('valid credentials sign the user in and redirect to /dashboard', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();

    await signIn.fillCredentials('quinntynebrown@gmail.com', 'password123');
    await signIn.submit();

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('wrong password shows the generic credentials error and stays on /sign-in', async ({
    page,
  }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();

    await signIn.fillCredentials('quinntynebrown@gmail.com', 'WRONG-PASSWORD');
    await signIn.submit();

    await expect(page.getByTestId('sign-in-error')).toHaveText(
      /Email or password is incorrect/i,
    );
    await expect(page).toHaveURL(/\/sign-in$/);
  });
});
