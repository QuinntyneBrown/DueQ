import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  readonly path = '/forgot-password';
  readonly heading = /Reset your password/i;

  constructor(page: Page) {
    super(page);
  }

  emailInput(): Locator {
    return this.page.getByLabel(/Email/i);
  }

  submitButton(): Locator {
    return this.page.getByRole('button', { name: /^Send reset link$/ });
  }

  backToSignInLink(): Locator {
    return this.page.getByRole('link', { name: /Back to sign in/i });
  }

  successCard(): Locator {
    return this.page.getByTestId('forgot-password-success');
  }

  async submit(email: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.submitButton().click();
  }
}
