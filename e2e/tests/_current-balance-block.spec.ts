import type { Page } from '@playwright/test';
import { expect, test } from '../fixtures';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

test.use({ baseURL: 'http://localhost:4200' });

async function readBlockColors(page: Page, sel: string) {
  return page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const panel = getComputedStyle(el);
    const lbl = el.querySelector('.lbl');
    const sub = el.querySelector('.sub, [style*="opacity"]');
    const val = el.querySelector('.val');
    return {
      panelBg: panel.backgroundColor,
      panelColor: panel.color,
      lblColor: lbl ? getComputedStyle(lbl).color : null,
      subColor: sub ? getComputedStyle(sub).color : null,
      valColor: val ? getComputedStyle(val).color : null,
    };
  }, sel);
}

test('current-balance-block colors match the mock', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });

  // Mock: the inverted "Sam currently owes" panel is the first `.preview-block` with inline dark styling.
  await page.goto(pathToFileURL(resolve(__dirname, '../../docs/mocks/record-payment.html')).toString());
  const mock = await readBlockColors(page, '.preview-block[style*="--ink"]');

  await page.goto('/payments/new', { waitUntil: 'networkidle' });
  await page.locator('[data-testid="current-balance"]').waitFor({ state: 'visible', timeout: 20_000 });
  const app = await readBlockColors(page, '.current-balance-block');

  expect(app, 'block not found in app').not.toBeNull();
  expect(mock, 'block not found in mock').not.toBeNull();

  const compare = (key: keyof NonNullable<typeof mock>) => {
    expect(app![key], `${key}`).toBe(mock![key]);
  };

  compare('panelBg');
  compare('panelColor');
  compare('lblColor');
  compare('valColor');
});
