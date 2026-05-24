import { Locator, Page, expect } from '@playwright/test';

export abstract class BasePage {
  abstract readonly path: string;
  abstract readonly heading: string;

  protected constructor(public readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.waitUntilLoaded();
  }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.pageHeading()).toBeVisible();
  }

  pageHeading(): Locator {
    return this.page.getByRole('heading', { name: this.heading, level: 1 });
  }

  brand(): Locator {
    return this.page.getByRole('link', { name: /DueQ/i }).first();
  }

  sidebar(): Locator {
    return this.page.getByRole('complementary');
  }

  bottomNav(): Locator {
    return this.page.getByRole('navigation', { name: /primary|bottom/i });
  }

  sidebarLink(name: RegExp | string): Locator {
    return this.sidebar().getByRole('link', { name });
  }

  bottomNavLink(name: RegExp | string): Locator {
    return this.bottomNav().getByRole('link', { name });
  }

  async clickSidebar(name: RegExp | string): Promise<void> {
    await this.sidebarLink(name).click();
  }

  async clickBottomNav(name: RegExp | string): Promise<void> {
    await this.bottomNavLink(name).click();
  }

  toast(): Locator {
    return this.page.getByRole('status');
  }

  async expectToast(text: RegExp | string): Promise<void> {
    await expect(this.toast()).toContainText(text);
  }
}
