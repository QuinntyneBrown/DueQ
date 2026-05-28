import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.DUEQ_BASE_URL ?? 'http://localhost:4300',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'mobile-sm',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: process.env.DUEQ_BASE_URL
    ? undefined
    : {
        command: 'npm --prefix ../frontend run start:test-host',
        url: 'http://localhost:4300',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
