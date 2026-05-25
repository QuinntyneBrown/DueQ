import { expect, test } from '../fixtures';
import { DashboardPage } from '../pages';

test.describe('Navigation', () => {
  test('root URL redirects to the dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(dashboard)?$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('bottom nav navigates between Home, Bills, History, and Settings', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'bottom nav is only rendered on mobile breakpoints');

    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await dashboard.clickBottomNav(/Bills/i);
    await expect(page).toHaveURL(/\/bills$/);

    await dashboard.clickBottomNav(/History/i);
    await expect(page).toHaveURL(/\/history$/);

    await dashboard.clickBottomNav(/You|Settings/i);
    await expect(page).toHaveURL(/\/settings$/);

    await dashboard.clickBottomNav(/Home/i);
    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });

  test('mobile floating action button opens add bill', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'FAB is only rendered on mobile breakpoints');

    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await page.getByRole('link', { name: /add bill|new bill|＋/i }).last().click();
    await expect(page).toHaveURL(/\/bills\/new$/);
  });

  test('sidebar navigates between sections on desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'sidebar is hidden on mobile breakpoints');

    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await dashboard.clickSidebar(/Bills/i);
    await expect(page).toHaveURL(/\/bills$/);

    await dashboard.clickSidebar(/History/i);
    await expect(page).toHaveURL(/\/history$/);

    await dashboard.clickSidebar(/Record payment/i);
    await expect(page).toHaveURL(/\/payments\/new$/);

    await dashboard.clickSidebar(/Settings/i);
    await expect(page).toHaveURL(/\/settings$/);

    await dashboard.clickSidebar(/Dashboard/i);
    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });

  test('active nav item reflects the current route', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const activeOnDashboard = page.locator('[aria-current="page"]').first();
    await expect(activeOnDashboard).toContainText(/Dashboard|Home/i);

    await page.goto('/bills');
    const activeOnBills = page.locator('[aria-current="page"]').first();
    await expect(activeOnBills).toContainText(/Bills/i);
  });

  test('renders on extra-small mobile viewport (320px) without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('settings gear in the mobile header navigates to settings', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'gear icon is only shown in the mobile header');

    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await page.getByRole('banner').getByRole('link', { name: /Settings/i }).click();
    await expect(page).toHaveURL(/\/settings$/);
  });
});
