import { expect, test } from '../fixtures';
import { DashboardPage, RecordPaymentPage } from '../pages';

test.describe('Record payment', () => {
  test('renders heading, subtitle, and the current balance reminder', async ({ page }) => {
    const record = new RecordPaymentPage(page);
    await record.goto();

    await expect(record.pageHeading()).toBeVisible();
    await expect(page.getByText(/Log money .* sent you/i)).toBeVisible();
    await expect(record.currentBalance()).toHaveText(/^\$\d[\d,]*\.\d{2}$/);
  });

  test('current balance matches the dashboard outstanding amount', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    const dashAmount = (await dashboard.balanceAmount().textContent())?.trim();

    const record = new RecordPaymentPage(page);
    await record.goto();
    await expect(record.currentBalance()).toHaveText(dashAmount ?? '');
  });

  test('payment method defaults to e-Transfer', async ({ page }) => {
    const record = new RecordPaymentPage(page);
    await record.goto();

    await expect(record.methodOption('e-Transfer')).toHaveAttribute('aria-selected', 'true');
  });

  test('updates the new balance preview as the amount changes', async ({ page }) => {
    const record = new RecordPaymentPage(page);
    await record.goto();

    const currentText = ((await record.currentBalance().textContent()) ?? '').replace(/[^0-9.]/g, '');
    const current = parseFloat(currentText);
    expect(current).toBeGreaterThan(0);

    await record.amountInput().fill('40');
    const expected = (current - 40).toFixed(2);
    await record.expectNewBalance(`$${expected}`);
  });

  test('saves a payment and returns to the dashboard with updated balance', async ({ page }) => {
    const record = new RecordPaymentPage(page);
    await record.goto();

    const currentText = ((await record.currentBalance().textContent()) ?? '').replace(/[^0-9.]/g, '');
    const current = parseFloat(currentText);

    await record.fillPayment({
      amount: '50.00',
      date: '2026-05-24',
      method: 'e-Transfer',
      note: 'partial',
    });
    await record.submit();

    await expect(page).toHaveURL(/\/(dashboard)?$/);
    const dashboard = new DashboardPage(page);
    const newText = ((await dashboard.balanceAmount().textContent()) ?? '').replace(/[^0-9.]/g, '');
    expect(parseFloat(newText)).toBeCloseTo(current - 50, 2);
  });

  test('allows switching the payment method to Cash and Other', async ({ page }) => {
    const record = new RecordPaymentPage(page);
    await record.goto();

    await record.selectMethod('Cash');
    await expect(record.methodOption('Cash')).toHaveAttribute('aria-selected', 'true');

    await record.selectMethod('Other');
    await expect(record.methodOption('Other')).toHaveAttribute('aria-selected', 'true');
  });

  test('shows a validation error when amount is empty or non-positive', async ({ page }) => {
    const record = new RecordPaymentPage(page);
    await record.goto();

    await record.amountInput().fill('0');
    await record.submit();
    await expect(record.validationError('amount')).toBeVisible();
  });

  test('warns when the payment exceeds the current outstanding balance', async ({ page }) => {
    const record = new RecordPaymentPage(page);
    await record.goto();

    const currentText = ((await record.currentBalance().textContent()) ?? '').replace(/[^0-9.]/g, '');
    const current = parseFloat(currentText);
    await record.amountInput().fill((current + 1000).toString());

    await expect(record.newBalancePreview()).toContainText(/-?\$/);
    await expect(page.getByTestId('overpayment-warning')).toBeVisible();
  });
});
