import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type HistoryFilter = 'All' | 'Bills only' | 'Payments only';

export class HistoryPage extends BasePage {
  readonly path = '/history';
  readonly heading = 'History';

  constructor(page: Page) {
    super(page);
  }

  runningBalance(): Locator {
    return this.page.getByTestId('running-balance');
  }

  totalLogged(): Locator {
    return this.page.getByTestId('total-logged');
  }

  totalPaidBack(): Locator {
    return this.page.getByTestId('total-paid-back');
  }

  filterChip(label: HistoryFilter): Locator {
    return this.page.getByRole('tab', { name: new RegExp(`^${label}$`, 'i') });
  }

  async selectFilter(label: HistoryFilter): Promise<void> {
    await this.filterChip(label).click();
    await expect(this.filterChip(label)).toHaveAttribute('aria-selected', 'true');
  }

  monthGroup(monthYear: string): Locator {
    return this.page.getByRole('region', { name: monthYear });
  }

  monthTotal(monthYear: string): Locator {
    return this.monthGroup(monthYear).getByTestId('month-total');
  }

  entries(monthYear?: string): Locator {
    const scope = monthYear ? this.monthGroup(monthYear) : this.page;
    return scope.getByRole('listitem');
  }

  entry(title: RegExp | string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: title }).first();
  }

  entryRunningBalance(title: RegExp | string): Locator {
    return this.entry(title).getByTestId('row-running-balance');
  }
}
