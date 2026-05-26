import { expect, test } from '../fixtures';

test.use({ baseURL: 'http://localhost:4200' });

test('only Add Bill is highlighted in the sidebar on /bills/new', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/bills/new');

  const sidebar = page.locator('.app-sidebar');
  await expect(sidebar.locator('.nav-link.is-active', { hasText: /Add Bill/i })).toBeVisible();
  await expect(sidebar.locator('.nav-link.is-active', { hasText: /^Bills$/i })).toHaveCount(0);
});

test('sidebar shows capitalized labels: Add Bill & Record Payment', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/dashboard');

  const sidebar = page.locator('.app-sidebar');
  const addBill = sidebar.locator('a[routerLink="/bills/new"]');
  const recordPay = sidebar.locator('a[routerLink="/payments/new"]');

  await expect(addBill).toHaveText(/Add Bill/);
  expect(await addBill.innerText()).not.toMatch(/Add bill/);

  await expect(recordPay).toHaveText(/Record Payment/);
  expect(await recordPay.innerText()).not.toMatch(/Record payment/);
});

test('sidebar footer renders user avatar and name', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/dashboard');

  const footer = page.locator('.app-sidebar .footer');
  await expect(footer).toBeVisible();
  await expect(footer.locator('.avatar')).toBeVisible();
  await expect(footer.locator('.name')).toBeVisible();
  await expect(footer.locator('.name')).not.toBeEmpty();
});
