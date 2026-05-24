import { expect, test } from '@playwright/test';
import { BillsPage } from '../pages';

test.describe('Bills list', () => {
  test('renders the page heading and subtitle', async ({ page }) => {
    const bills = new BillsPage(page);
    await bills.goto();

    await expect(bills.pageHeading()).toBeVisible();
    await expect(page.getByText(/All bills logged between you and/i)).toBeVisible();
  });

  test('exposes All, Unsettled, and Settled filter chips with counts', async ({ page }) => {
    const bills = new BillsPage(page);
    await bills.goto();

    await expect(bills.filterChip('All')).toBeVisible();
    await expect(bills.filterChip('Unsettled')).toBeVisible();
    await expect(bills.filterChip('Settled')).toBeVisible();

    await expect(bills.filterChipCount('All')).toHaveText(/^\d+$/);
    await expect(bills.filterChipCount('Unsettled')).toHaveText(/^\d+$/);
    await expect(bills.filterChipCount('Settled')).toHaveText(/^\d+$/);
  });

  test('All filter is selected by default', async ({ page }) => {
    const bills = new BillsPage(page);
    await bills.goto();

    await expect(bills.filterChip('All')).toHaveAttribute('aria-selected', 'true');
  });

  test('filters down to only unsettled bills when Unsettled chip is selected', async ({ page }) => {
    const bills = new BillsPage(page);
    await bills.goto();
    await bills.selectFilter('Unsettled');

    const rows = bills.billRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByTestId('status-badge')).toHaveText(/Unsettled/i);
    }
  });

  test('filters down to only settled bills when Settled chip is selected', async ({ page }) => {
    const bills = new BillsPage(page);
    await bills.goto();
    await bills.selectFilter('Settled');

    const rows = bills.billRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByTestId('status-badge')).toHaveText(/Settled/i);
    }
  });

  test('groups bills by month with a per-month owed total', async ({ page }) => {
    const bills = new BillsPage(page);
    await bills.goto();

    const may = bills.monthGroup('May 2026');
    await expect(may).toBeVisible();
    await expect(bills.monthTotal('May 2026')).toBeVisible();
  });

  test('header + button navigates to the add bill screen', async ({ page }) => {
    const bills = new BillsPage(page);
    await bills.goto();

    await bills.headerAddButton().click();
    await expect(page).toHaveURL(/\/bills\/new$/);
  });

  test('opening a bill row navigates to its detail screen', async ({ page }) => {
    const bills = new BillsPage(page);
    await bills.goto();

    await bills.billRows().first().getByRole('link').first().click();
    await expect(page).toHaveURL(/\/bills\/[^/]+$/);
  });

  test('shows an empty state when there are no bills', async ({ page }) => {
    await page.route('**/api/bills*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );

    const bills = new BillsPage(page);
    await bills.goto();

    await expect(bills.emptyState()).toBeVisible();
    await expect(bills.emptyState()).toContainText(/no bills/i);
  });
});
