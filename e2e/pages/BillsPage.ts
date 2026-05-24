import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type BillFilter = 'All' | 'Unsettled' | 'Settled';

export class BillsPage extends BasePage {
  readonly path = '/bills';
  readonly heading = 'Bills';

  constructor(page: Page) {
    super(page);
  }

  filterChip(label: BillFilter): Locator {
    return this.page.getByRole('tab', { name: new RegExp(`^${label}`, 'i') });
  }

  filterChipCount(label: BillFilter): Locator {
    return this.filterChip(label).getByTestId('chip-count');
  }

  async selectFilter(label: BillFilter): Promise<void> {
    await this.filterChip(label).click();
    await expect(this.filterChip(label)).toHaveAttribute('aria-selected', 'true');
  }

  monthGroup(monthYear: string): Locator {
    return this.page.getByRole('region', { name: monthYear });
  }

  monthTotal(monthYear: string): Locator {
    return this.monthGroup(monthYear).getByTestId('month-total');
  }

  billRows(monthYear?: string): Locator {
    const scope = monthYear ? this.monthGroup(monthYear) : this.page;
    return scope.getByRole('listitem').filter({ hasNot: this.page.locator('[data-testid="empty-state"]') });
  }

  billRow(title: RegExp | string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: title }).first();
  }

  billStatusBadge(title: RegExp | string): Locator {
    return this.billRow(title).getByTestId('status-badge');
  }

  async openBill(title: RegExp | string): Promise<void> {
    await this.billRow(title).getByRole('link').first().click();
  }

  headerAddButton(): Locator {
    return this.page.getByRole('banner').getByRole('link', { name: /Add bill/i });
  }

  emptyState(): Locator {
    return this.page.getByTestId('empty-state');
  }
}
