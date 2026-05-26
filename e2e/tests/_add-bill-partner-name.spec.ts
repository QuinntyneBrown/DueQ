import { expect, test } from '../fixtures';

test.use({ baseURL: 'http://localhost:4200' });

test('add-bill page uses partner name from settings (not hardcoded Sam)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  // Set a distinctive partner name via settings.
  await page.goto('/settings');
  await page.getByLabel(/Partner's name/i).fill('Robin');
  await page.getByRole('button', { name: /^Save$/ }).click();
  await page.waitForLoadState('networkidle');

  await page.goto('/bills/new');

  const subtitle = page.locator('lib-page-head').getByText(/Split it 50\/50/i);
  await expect(subtitle).toHaveText(/Split it 50\/50 between you and Robin\./);
  expect(await subtitle.innerText()).not.toMatch(/Sam/);

  const preview = page.locator('[data-testid="partner-share-preview"]');
  await expect(preview).toContainText('Robin owes');
  expect(await preview.innerText()).not.toMatch(/Sam owes/);
});
