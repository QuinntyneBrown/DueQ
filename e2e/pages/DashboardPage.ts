import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly path = '/dashboard';
  readonly heading = /Good (morning|afternoon|evening)/i;

  constructor(page: Page) {
    super(page);
  }

  balanceCard(): Locator {
    return this.page.getByTestId('balance-card');
  }

  balanceAmount(): Locator {
    return this.balanceCard().getByTestId('balance-amount');
  }

  balanceLabel(): Locator {
    return this.balanceCard().getByTestId('balance-label');
  }

  balanceMeta(): Locator {
    return this.balanceCard().getByTestId('balance-meta');
  }

  addBillButton(): Locator {
    return this.page.getByRole('link', { name: /Add bill/i }).first();
  }

  recordPaymentButton(): Locator {
    return this.page.getByRole('link', { name: /Record payment/i }).first();
  }

  stat(label: 'This month' | 'Received'): Locator {
    return this.page.getByTestId(`stat-${label.toLowerCase().replace(/\s+/g, '-')}`);
  }

  recentActivitySection(): Locator {
    return this.page.getByRole('region', { name: /Recent activity/i });
  }

  recentActivityRows(): Locator {
    return this.recentActivitySection().getByRole('listitem');
  }

  viewAllLink(): Locator {
    return this.recentActivitySection().getByRole('link', { name: /View all/i });
  }

  async clickRecentActivity(title: RegExp | string): Promise<void> {
    await this.recentActivityRows().filter({ hasText: title }).first().click();
  }

  async expectGreetingMatchesUserName(name: string): Promise<void> {
    await expect(this.pageHeading()).toContainText(name);
  }

  async expectBalanceAmount(amount: RegExp | string): Promise<void> {
    await expect(this.balanceAmount()).toHaveText(amount);
  }
}
