import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface PeopleInput {
  yourName: string;
  partnerName: string;
}

export class SettingsPage extends BasePage {
  readonly path = '/settings';
  readonly heading = /Who's splitting\?/i;

  constructor(page: Page) {
    super(page);
  }

  yourNameInput(): Locator {
    return this.page.getByLabel(/Your name/i);
  }

  partnerNameInput(): Locator {
    return this.page.getByLabel(/Partner's name/i);
  }

  yourAvatar(): Locator {
    return this.page.getByTestId('avatar-you');
  }

  partnerAvatar(): Locator {
    return this.page.getByTestId('avatar-partner');
  }

  saveButton(): Locator {
    return this.page.getByRole('button', { name: /^Save$/ });
  }

  validationError(field: 'you' | 'partner'): Locator {
    return this.page.getByTestId(`error-${field}-name`);
  }

  async fillPeople(input: PeopleInput): Promise<void> {
    await this.yourNameInput().fill(input.yourName);
    await this.partnerNameInput().fill(input.partnerName);
  }

  async save(): Promise<void> {
    await this.saveButton().click();
  }

  async expectAvatarInitials(role: 'you' | 'partner', initials: string): Promise<void> {
    const avatar = role === 'you' ? this.yourAvatar() : this.partnerAvatar();
    await expect(avatar).toHaveText(initials);
  }
}
