import type { Page } from '@playwright/test';
import { expect, test } from '../fixtures';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const PALETTE_TOKENS = [
  '--bg',
  '--surface',
  '--surface-2',
  '--ink',
  '--ink-2',
  '--muted',
  '--border',
  '--border-strong',
  '--brand',
  '--accent',
  '--accent-soft',
  '--owed-to-you',
  '--owed-by-you',
  '--tint-green',
  '--tint-red',
];

async function readTokens(page: Page): Promise<Record<string, string>> {
  return page.evaluate((names: string[]) => {
    const cs = getComputedStyle(document.documentElement);
    const out: Record<string, string> = {};
    for (const n of names) out[n] = cs.getPropertyValue(n).trim();
    return out;
  }, PALETTE_TOKENS);
}

async function readKeyColors(page: Page) {
  return page.evaluate(() => {
    const get = (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, color: cs.color };
    };
    return {
      body:            get('body'),
      balanceCard:     get('.balance-card'),
      sidebarActive:   get('.app-sidebar .nav-link.is-active') ?? get('.nav-link.is-active'),
      statCard:        get('.stat'),
      iconTileBill:    get('.icon-tile.t-bill'),
    };
  });
}

const mockUrl = pathToFileURL(resolve(__dirname, '../../docs/mocks/dashboard.html')).toString();

test.use({ baseURL: 'http://localhost:4200' });

test.describe.configure({ mode: 'serial' });

test('palette tokens align between mock and app', async ({ page }) => {
  await page.goto(mockUrl);
  const mock = await readTokens(page);

  await page.goto('/dashboard');
  const app = await readTokens(page);

  const mismatches: string[] = [];
  for (const k of PALETTE_TOKENS) {
    if (mock[k] !== app[k]) mismatches.push(`${k}: mock="${mock[k]}" app="${app[k]}"`);
  }
  expect(mismatches, mismatches.join('\n')).toEqual([]);
});

test('dashboard key-element colors match the mock', async ({ page }) => {
  await page.goto(mockUrl);
  await page.waitForLoadState('domcontentloaded');
  const mock = await readKeyColors(page);

  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  const app = await readKeyColors(page);

  const mismatches: string[] = [];
  for (const key of Object.keys(mock) as Array<keyof typeof mock>) {
    const m = mock[key];
    const a = app[key];
    if (!m && !a) continue;
    if (!m || !a) {
      mismatches.push(`${key}: missing in ${!m ? 'mock' : 'app'} (mock=${JSON.stringify(m)} app=${JSON.stringify(a)})`);
      continue;
    }
    if (m.bg !== a.bg) mismatches.push(`${key}.background: mock="${m.bg}" app="${a.bg}"`);
    if (m.color !== a.color) mismatches.push(`${key}.color: mock="${m.color}" app="${a.color}"`);
  }
  expect(mismatches, mismatches.join('\n')).toEqual([]);
});
