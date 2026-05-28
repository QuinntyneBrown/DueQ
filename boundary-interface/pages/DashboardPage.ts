import { Locator, Page, expect } from '@playwright/test';

/**
 * Page object for the DashboardPage rendered inside the test-bridge route.
 * Asserts only against the UI surface — never against backend state.
 */
export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  host(): Locator {
    return this.page.getByTestId('test-bridge-host');
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

  async expectBalanceAmount(amount: RegExp | string): Promise<void> {
    await expect(this.balanceAmount()).toHaveText(amount);
  }

  async expectBalanceLabel(text: RegExp | string): Promise<void> {
    await expect(this.balanceLabel()).toHaveText(text);
  }
}
