import { expect, test } from '../fixtures';
import { HistoryPage } from '../pages';

test.describe('History', () => {
  test('renders heading, subtitle, and running balance summary', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.goto();

    await expect(history.pageHeading()).toBeVisible();
    await expect(page.getByText(/Every bill and payment/i)).toBeVisible();

    await expect(history.runningBalance()).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
    await expect(history.totalLogged()).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
    await expect(history.totalPaidBack()).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
  });

  test('All / Bills only / Payments only filter chips are present', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.goto();

    await expect(history.filterChip('All')).toBeVisible();
    await expect(history.filterChip('Bills only')).toBeVisible();
    await expect(history.filterChip('Payments only')).toBeVisible();
    await expect(history.filterChip('All')).toHaveAttribute('aria-selected', 'true');
  });

  test('Bills only filter hides payment rows', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.goto();
    await history.selectFilter('Bills only');

    const payments = history.entries().filter({ hasText: /Payment from/i });
    await expect(payments).toHaveCount(0);
    await expect(history.entries().first()).toBeVisible();
  });

  test('Payments only filter hides bill rows', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.goto();
    await history.selectFilter('Payments only');

    const entries = history.entries();
    const count = await entries.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(entries.nth(i)).toContainText(/Payment from/i);
    }
  });

  test('entries are grouped by month with a per-month total', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.goto();

    await expect(history.monthGroup('May 2026')).toBeVisible();
    await expect(history.monthTotal('May 2026')).toBeVisible();
  });

  test('each row exposes a running balance after the entry was applied', async ({ page }) => {
    const history = new HistoryPage(page);
    await history.goto();

    const first = history.entries().first();
    await expect(first.getByTestId('row-running-balance')).toHaveText(/^\$-?\d[\d,]*\.\d{2}$|balance/i);
  });
});
