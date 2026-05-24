import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BillDetailPage extends BasePage {
  readonly path = '/bills/:id';
  readonly heading = '';

  constructor(page: Page) {
    super(page);
  }

  async gotoById(id: string): Promise<void> {
    await this.page.goto(`/bills/${id}`);
    await this.waitUntilLoaded();
  }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.title()).toBeVisible();
  }

  title(): Locator {
    return this.page.getByTestId('bill-title');
  }

  amount(): Locator {
    return this.page.getByTestId('bill-amount');
  }

  date(): Locator {
    return this.page.getByTestId('bill-date');
  }

  statusBadge(): Locator {
    return this.page.getByTestId('status-badge');
  }

  yourShare(): Locator {
    return this.page.getByTestId('share-you');
  }

  partnerShare(): Locator {
    return this.page.getByTestId('share-partner');
  }

  note(): Locator {
    return this.page.getByTestId('bill-note');
  }

  editButton(): Locator {
    return this.page.getByRole('button', { name: /^Edit$/ });
  }

  markSettledButton(): Locator {
    return this.page.getByRole('button', { name: /Mark as settled/i });
  }

  markUnsettledButton(): Locator {
    return this.page.getByRole('button', { name: /Mark as unsettled/i });
  }

  deleteButton(): Locator {
    return this.page.getByRole('button', { name: /Delete bill/i });
  }

  confirmDialog(): Locator {
    return this.page.getByRole('dialog');
  }

  confirmDeleteButton(): Locator {
    return this.confirmDialog().getByRole('button', { name: /Delete/i });
  }

  backLink(): Locator {
    return this.page.getByRole('link', { name: /All bills|Back/i }).first();
  }

  async markAsSettled(): Promise<void> {
    await this.markSettledButton().click();
  }

  async deleteBill(): Promise<void> {
    await this.deleteButton().click();
    await this.confirmDeleteButton().click();
  }
}
