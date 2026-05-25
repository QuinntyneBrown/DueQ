import { expect, test } from '../fixtures';
import { AddBillPage, BillsPage } from '../pages';

test.describe('Add bill', () => {
  test('renders heading, subtitle, and an empty form', async ({ page }) => {
    const addBill = new AddBillPage(page);
    await addBill.goto();

    await expect(addBill.pageHeading()).toBeVisible();
    await expect(page.getByText(/Split it 50\/50/i)).toBeVisible();

    await expect(addBill.amountInput()).toHaveValue('');
    await expect(addBill.nameInput()).toHaveValue('');
    await expect(addBill.dateInput()).not.toHaveValue('');
  });

  test('updates the partner share preview to half the entered amount', async ({ page }) => {
    const addBill = new AddBillPage(page);
    await addBill.goto();
    await addBill.amountInput().fill('100');

    await addBill.expectPartnerShare('$50.00');
  });

  test('partner share recomputes when the amount changes', async ({ page }) => {
    const addBill = new AddBillPage(page);
    await addBill.goto();

    await addBill.amountInput().fill('80');
    await addBill.expectPartnerShare('$40.00');

    await addBill.amountInput().fill('250');
    await addBill.expectPartnerShare('$125.00');
  });

  test('saves a new bill and returns to the bills list', async ({ page }) => {
    const addBill = new AddBillPage(page);
    const bills = new BillsPage(page);
    await addBill.goto();

    await addBill.fillBill({
      amount: '84.20',
      name: 'Groceries — Loblaws',
      date: '2026-05-22',
      note: 'Weekly run',
    });
    await addBill.submit();

    await expect(page).toHaveURL(/\/bills$/);
    await expect(bills.billRow(/Groceries — Loblaws/)).toBeVisible();
  });

  test('Save & add another keeps the user on the add bill page with a cleared form', async ({ page }) => {
    const addBill = new AddBillPage(page);
    await addBill.goto();

    await addBill.fillBill({ amount: '50.00', name: 'Coffee', date: '2026-05-22' });
    await addBill.submitAndAddAnother();

    await expect(page).toHaveURL(/\/bills\/new$/);
    await expect(addBill.amountInput()).toHaveValue('');
    await expect(addBill.nameInput()).toHaveValue('');
  });

  test('shows validation errors when the form is submitted empty', async ({ page }) => {
    const addBill = new AddBillPage(page);
    await addBill.goto();

    await addBill.amountInput().fill('');
    await addBill.nameInput().fill('');
    await addBill.submit();

    await expect(addBill.validationError('amount')).toBeVisible();
    await expect(addBill.validationError('name')).toBeVisible();
    await expect(page).toHaveURL(/\/bills\/new$/);
  });

  test('rejects a negative or zero amount', async ({ page }) => {
    const addBill = new AddBillPage(page);
    await addBill.goto();

    await addBill.amountInput().fill('0');
    await addBill.nameInput().fill('Bad bill');
    await addBill.submit();

    await expect(addBill.validationError('amount')).toBeVisible();
  });

  test('rejects non-numeric input in the amount field', async ({ page }) => {
    const addBill = new AddBillPage(page);
    await addBill.goto();

    await addBill.amountInput().fill('abc');
    await addBill.nameInput().fill('Bad bill');
    await addBill.submit();

    await expect(addBill.validationError('amount')).toBeVisible();
  });

  test('cancel link returns to the dashboard without saving', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'cancel link only appears in the mobile header; desktop uses the sidebar');

    const addBill = new AddBillPage(page);
    await addBill.goto();
    await addBill.fillBill({ amount: '12.00', name: 'Discarded', date: '2026-05-22' });

    await addBill.cancelLink().click();

    await expect(page).toHaveURL(/\/(dashboard)?$/);
  });
});
