import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://localhost:4200' });

test('record-payment page renders the back link', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/payments/new');

  const back = page.locator('a.back-link');
  await expect(back).toBeVisible();
  await expect(back).toHaveText(/← Back/);

  await back.click();
  await expect(page).toHaveURL(/\/dashboard$/);
});
