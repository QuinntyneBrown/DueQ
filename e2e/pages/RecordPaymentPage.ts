import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type PaymentMethod = 'e-Transfer' | 'Cash' | 'Other';

export interface PaymentInput {
  amount: string;
  date: string;
  method?: PaymentMethod;
  note?: string;
}

export class RecordPaymentPage extends BasePage {
  readonly path = '/payments/new';
  readonly heading = /Record a payment/i;

  constructor(page: Page) {
    super(page);
  }

  currentBalance(): Locator {
    return this.page.getByTestId('current-balance');
  }

  amountInput(): Locator {
    return this.page.getByLabel(/Amount received/i);
  }

  dateInput(): Locator {
    return this.page.getByLabel(/Date received/i);
  }

  methodOption(method: PaymentMethod): Locator {
    return this.page.getByRole('tab', { name: method });
  }

  noteInput(): Locator {
    return this.page.getByLabel(/^Note/i);
  }

  newBalancePreview(): Locator {
    return this.page.getByTestId('new-balance-preview');
  }

  saveButton(): Locator {
    return this.page.getByRole('button', { name: /Save payment/i });
  }

  cancelLink(): Locator {
    return this.page.getByRole('link', { name: /Cancel/i });
  }

  validationError(field: 'amount' | 'date'): Locator {
    return this.page.getByTestId(`error-${field}`);
  }

  async selectMethod(method: PaymentMethod): Promise<void> {
    await this.methodOption(method).click();
    await expect(this.methodOption(method)).toHaveAttribute('aria-selected', 'true');
  }

  async fillPayment(input: PaymentInput): Promise<void> {
    await this.amountInput().fill(input.amount);
    await this.dateInput().fill(input.date);
    if (input.method) {
      await this.selectMethod(input.method);
    }
    if (input.note !== undefined) {
      await this.noteInput().fill(input.note);
    }
  }

  async submit(): Promise<void> {
    await this.saveButton().click();
  }

  async expectNewBalance(amount: RegExp | string): Promise<void> {
    await expect(this.newBalancePreview()).toContainText(amount);
  }
}
