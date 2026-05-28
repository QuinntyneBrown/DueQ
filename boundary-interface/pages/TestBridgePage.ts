import type { Page } from '@playwright/test';
import type { BridgeCall } from './BridgeCall';
import type { BridgeDashboard } from './BridgeDashboard';
import type { DashboardBridgeController } from './DashboardBridgeController';
import type { DueQTestBridgeController } from './DueQTestBridgeController';

/**
 * Playwright page object for the DueQ test-bridge route. The bridge itself is a
 * domain-agnostic call recorder plus named controller registry; this wrapper
 * gives tests typed convenience methods over those controllers.
 */
export class TestBridgePage {
  readonly page: Page;
  readonly route: string;

  constructor(page: Page, route: string = '/test-bridge') {
    this.page = page;
    this.route = route;
  }

  async goto(): Promise<void> {
    await this.page.goto(this.route);
    await this.page.waitForFunction(() =>
      Boolean(
        window.__pluginHostBridge
          ?.controller<DueQTestBridgeController>('testBridge')?.ready,
      ),
    );
  }

  async resetAll(): Promise<void> {
    await this.page.evaluate(() =>
      window.__pluginHostBridge
        ?.controller<DueQTestBridgeController>('testBridge')
        ?.resetAll(),
    );
  }

  async setDashboard(dashboard: BridgeDashboard): Promise<void> {
    await this.page.evaluate(
      (d) =>
        window.__pluginHostBridge
          ?.controller<DashboardBridgeController>('dashboard')
          ?.setDashboard(d as BridgeDashboard),
      dashboard,
    );
  }

  async getRecordedCalls(method: string): Promise<readonly BridgeCall[]> {
    return await this.page.evaluate(
      (m) => window.__pluginHostBridge?.callsFor(m) ?? [],
      method,
    );
  }
}
