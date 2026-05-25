import { expect, test } from '../fixtures';
import { DashboardPage, SettingsPage } from '../pages';

test.describe('Settings', () => {
  test('renders heading, subtitle, and two person cards', async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.goto();

    await expect(settings.pageHeading()).toBeVisible();
    await expect(page.getByText(/Every bill is split 50\/50/i)).toBeVisible();

    await expect(settings.yourNameInput()).toBeVisible();
    await expect(settings.partnerNameInput()).toBeVisible();
  });

  test('avatars reflect the initials of the entered names', async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.goto();

    await settings.yourNameInput().fill('Quinntyne Brown');
    await settings.partnerNameInput().fill('Sam');

    await settings.expectAvatarInitials('you', 'QB');
    await settings.expectAvatarInitials('partner', 'S');
  });

  test('saves names and they appear on the dashboard greeting', async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.goto();
    await settings.fillPeople({ yourName: 'Quinntyne Brown', partnerName: 'Sam' });
    await settings.save();

    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(dashboard.pageHeading()).toContainText(/Quinntyne/);
    await expect(dashboard.balanceLabel()).toContainText(/Sam/i);
  });

  test('shows validation errors when names are blank', async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.goto();

    await settings.yourNameInput().fill('');
    await settings.partnerNameInput().fill('');
    await settings.save();

    await expect(settings.validationError('you')).toBeVisible();
    await expect(settings.validationError('partner')).toBeVisible();
  });

  test('saved names persist after a full page reload', async ({ page }) => {
    const settings = new SettingsPage(page);
    await settings.goto();
    await settings.fillPeople({ yourName: 'Alex Doe', partnerName: 'Jordan' });
    await settings.save();

    await page.reload();
    await settings.waitUntilLoaded();

    await expect(settings.yourNameInput()).toHaveValue('Alex Doe');
    await expect(settings.partnerNameInput()).toHaveValue('Jordan');
  });
});
