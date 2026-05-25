import { FullConfig } from '@playwright/test';

export default async function globalSetup(_config: FullConfig): Promise<void> {
  const apiBaseUrl = process.env.DUEQ_API_BASE_URL ?? 'http://localhost:5054';
  const url = `${apiBaseUrl}/api/_test/reset`;

  const response = await fetch(url, { method: 'POST' });
  if (!response.ok) {
    throw new Error(
      `Playwright global setup: POST ${url} failed with ${response.status}. ` +
        `Is the DueQ API running on ${apiBaseUrl}?`,
    );
  }
}
