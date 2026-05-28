import { expect, test } from '../fixtures';
import { DashboardPage } from '../pages';

test.describe('Dashboard', () => {
  test('shows a personalised greeting using the user name', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.pageHeading()).toBeVisible();
    await expect(dashboard.pageHeading()).toContainText(/Quinntyne|good (morning|afternoon|evening)/i);
  });

  test('displays the outstanding balance card with amount, label, and meta', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.balanceCard()).toBeVisible();
    await expect(dashboard.balanceLabel()).toContainText(/owes you|you owe|all settled/i);
    await expect(dashboard.balanceAmount()).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
    await expect(dashboard.balanceMeta()).toBeVisible();
  });

  test('exposes quick actions to add a bill and record a payment', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.addBillButton()).toBeVisible();
    await expect(dashboard.recordPaymentButton()).toBeVisible();
  });

  test('navigates to add bill from the balance card quick action', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await dashboard.addBillButton().click();
    await expect(page).toHaveURL(/\/bills\/new$/);
  });

  test('navigates to record payment from the balance card quick action', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await dashboard.recordPaymentButton().click();
    await expect(page).toHaveURL(/\/payments\/new$/);
  });

  test('shows two stats: this month, received', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.stat('This month')).toBeVisible();
    await expect(dashboard.stat('Received')).toBeVisible();
  });

  test('renders the recent activity section with at least one row', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.recentActivitySection()).toBeVisible();
    await expect(dashboard.recentActivityRows().first()).toBeVisible();
  });

  test('view all link navigates to history', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await dashboard.viewAllLink().click();
    await expect(page).toHaveURL(/\/history$/);
  });

  test('clicking a recent bill row opens the bill detail screen', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await dashboard.recentActivityRows().first().click();
    await expect(page).toHaveURL(/\/bills\/[^/]+$/);
  });
});
