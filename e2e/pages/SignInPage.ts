import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignInPage extends BasePage {
  readonly path = '/sign-in';
  readonly heading = 'Sign in';

  constructor(page: Page) {
    super(page);
  }

  brandText(): Locator {
    return this.page.getByText('DueQ', { exact: true }).first();
  }

  subtitle(): Locator {
    return this.page.getByText(/Welcome back/i);
  }

  emailInput(): Locator {
    return this.page.getByLabel(/Email/i);
  }

  passwordInput(): Locator {
    return this.page.getByLabel(/Password/i);
  }

  rememberMe(): Locator {
    return this.page.getByLabel(/Remember me/i);
  }

  forgotPasswordLink(): Locator {
    return this.page.getByRole('link', { name: /Forgot password\?/i });
  }

  submitButton(): Locator {
    return this.page.getByRole('button', { name: /^Sign in$/ });
  }

  footerCreateLink(): Locator {
    return this.page.getByRole('link', { name: /Create one/i });
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }
}
