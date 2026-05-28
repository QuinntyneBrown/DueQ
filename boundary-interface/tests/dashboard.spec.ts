import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { TestBridgePage } from '../pages/TestBridgePage';
import type { BridgeDashboard } from '../pages/BridgeDashboard';

const SAMPLE_DASHBOARD: BridgeDashboard = {
  yourName: 'Alex Stone',
  partnerName: 'Sam',
  balance: -42.5,
  outstandingBillCount: 3,
  lastSettlementDate: '2026-05-01',
  thisMonthLogged: 120,
  thisMonthReceived: 60,
  behindByDays: 4,
  recentActivity: [
    {
      id: 'bill-1',
      kind: 0,
      title: 'Hydro',
      date: '2026-05-20',
      amount: 85,
      balanceDelta: -42.5,
    },
  ],
};

test.describe('DueQ :: dashboard (boundary-interface against IDashboardService mock)', () => {
  let bridge: TestBridgePage;
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    bridge = new TestBridgePage(page);
    dashboard = new DashboardPage(page);

    await bridge.goto();
    await bridge.resetAll();
  });

  test('fetches the dashboard through IDashboardService and displays the amount owed', async () => {
    await bridge.setDashboard(SAMPLE_DASHBOARD);

    await expect(dashboard.host()).toBeVisible();
    await dashboard.expectBalanceLabel('You owe Sam');
    await dashboard.expectBalanceAmount('$42.50');

    const calls = await bridge.getRecordedCalls('DashboardService.get');
    expect(calls).toHaveLength(1);
  });
});
