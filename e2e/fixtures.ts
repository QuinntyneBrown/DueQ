import { test as base } from '@playwright/test';

/**
 * Re-export `test` and `expect` with an auto-fixture that POSTs to the
 * Development-only `/api/_test/reset` endpoint before every test. Tests that
 * mutate state stay deterministic regardless of suite order or viewport
 * project order.
 *
 * Implemented as a separate auto-fixture so it doesn't shadow Playwright's
 * built-in `page` lifecycle (overriding it caused workers to hang on
 * shutdown).
 *
 * User-added `_*.spec.ts` files intentionally keep importing from
 * `@playwright/test` directly — they are read-only and don't need a fresh
 * seed before each test.
 */
export const test = base.extend<{ resetDueQ: void }>({
  resetDueQ: [
    async ({}, use) => {
      const apiBaseUrl = process.env.DUEQ_API_BASE_URL ?? 'http://localhost:5054';
      const response = await fetch(`${apiBaseUrl}/api/_test/reset`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(
          `Per-test reset failed: POST ${apiBaseUrl}/api/_test/reset → ${response.status}. ` +
            `Is the DueQ API running?`,
        );
      }
      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
