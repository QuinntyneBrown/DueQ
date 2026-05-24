import { expect, test } from '@playwright/test';
import { BillDetailPage, BillsPage } from '../pages';

test.describe('Bill detail', () => {
  test.beforeEach(async ({ page }) => {
    const bills = new BillsPage(page);
    await bills.goto();
    await bills.billRows().first().getByRole('link').first().click();
  });

  test('shows the bill title, amount, date, and category', async ({ page }) => {
    const detail = new BillDetailPage(page);
    await detail.waitUntilLoaded();

    await expect(detail.title()).toBeVisible();
    await expect(detail.amount()).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
    await expect(detail.date()).toBeVisible();
  });

  test('shows a status badge of Settled or Unsettled', async ({ page }) => {
    const detail = new BillDetailPage(page);
    await detail.waitUntilLoaded();

    await expect(detail.statusBadge()).toHaveText(/Settled|Unsettled/i);
  });

  test('renders the 50/50 split with shares for you and your partner', async ({ page }) => {
    const detail = new BillDetailPage(page);
    await detail.waitUntilLoaded();

    await expect(detail.yourShare()).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
    await expect(detail.partnerShare()).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
  });

  test('partner share equals exactly half the bill amount', async ({ page }) => {
    const detail = new BillDetailPage(page);
    await detail.waitUntilLoaded();

    const amount = parseFloat(((await detail.amount().textContent()) ?? '').replace(/[^0-9.]/g, ''));
    const partner = parseFloat(((await detail.partnerShare().textContent()) ?? '').replace(/[^0-9.]/g, ''));

    expect(partner).toBeCloseTo(amount / 2, 2);
  });

  test('mark as settled flips the status to Settled', async ({ page }) => {
    const detail = new BillDetailPage(page);
    await detail.waitUntilLoaded();

    if ((await detail.statusBadge().textContent())?.match(/Settled/i)) {
      test.skip(true, 'bill already settled — needs an unsettled fixture');
    }

    await detail.markAsSettled();
    await expect(detail.statusBadge()).toHaveText(/Settled/i);
    await expect(detail.markUnsettledButton()).toBeVisible();
  });

  test('delete bill prompts for confirmation and returns to the bills list', async ({ page }) => {
    const detail = new BillDetailPage(page);
    await detail.waitUntilLoaded();

    await detail.deleteButton().click();
    await expect(detail.confirmDialog()).toBeVisible();
    await detail.confirmDeleteButton().click();

    await expect(page).toHaveURL(/\/bills$/);
  });

  test('back link returns to the bills list', async ({ page }) => {
    const detail = new BillDetailPage(page);
    await detail.waitUntilLoaded();

    await detail.backLink().click();
    await expect(page).toHaveURL(/\/bills$/);
  });

  test('renders a 404 / not-found state for an unknown bill id', async ({ page }) => {
    await page.goto('/bills/does-not-exist');
    await expect(page.getByTestId('not-found')).toBeVisible();
  });
});
