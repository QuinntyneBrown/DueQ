import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CreateAccountPage extends BasePage {
  readonly path = '/create-account';
  readonly heading = /Create your account/i;

  constructor(page: Page) {
    super(page);
  }

  nameInput(): Locator {
    return this.page.getByLabel(/Your name/i);
  }

  emailInput(): Locator {
    return this.page.getByLabel(/Email/i);
  }

  passwordInput(): Locator {
    return this.page.getByLabel(/Password/i);
  }

  submitButton(): Locator {
    return this.page.getByRole('button', { name: /^Create account$/ });
  }

  signInLink(): Locator {
    return this.page.getByRole('link', { name: /Sign in/i });
  }

  errorMessage(): Locator {
    return this.page.getByTestId('create-account-error');
  }

  async fill(name: string, email: string, password: string): Promise<void> {
    await this.nameInput().fill(name);
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }
}
