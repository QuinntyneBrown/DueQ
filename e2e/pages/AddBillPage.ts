import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface BillInput {
  amount: string;
  name: string;
  date: string;
  note?: string;
}

export class AddBillPage extends BasePage {
  readonly path = '/bills/new';
  readonly heading = 'Add a bill';

  constructor(page: Page) {
    super(page);
  }

  amountInput(): Locator {
    return this.page.getByLabel('Amount', { exact: true });
  }

  nameInput(): Locator {
    return this.page.getByLabel(/What was it for\?/i);
  }

  dateInput(): Locator {
    return this.page.getByLabel('Date', { exact: true });
  }

  noteInput(): Locator {
    return this.page.getByLabel(/^Note/i);
  }

  partnerSharePreview(): Locator {
    return this.page.getByTestId('partner-share-preview');
  }

  saveButton(): Locator {
    return this.page.getByRole('button', { name: /^Save bill$/i });
  }

  saveAndAddAnotherButton(): Locator {
    return this.page.getByRole('button', { name: /Save & add another/i });
  }

  cancelLink(): Locator {
    return this.page.getByRole('link', { name: /Cancel/i });
  }

  validationError(field: 'amount' | 'name' | 'date'): Locator {
    return this.page.getByTestId(`error-${field}`);
  }

  async fillBill(input: BillInput): Promise<void> {
    await this.amountInput().fill(input.amount);
    await this.nameInput().fill(input.name);
    await this.dateInput().fill(input.date);
    if (input.note !== undefined) {
      await this.noteInput().fill(input.note);
    }
  }

  async submit(): Promise<void> {
    await this.saveButton().click();
  }

  async submitAndAddAnother(): Promise<void> {
    await this.saveAndAddAnotherButton().click();
  }

  async expectPartnerShare(amount: RegExp | string): Promise<void> {
    await expect(this.partnerSharePreview()).toContainText(amount);
  }
}
