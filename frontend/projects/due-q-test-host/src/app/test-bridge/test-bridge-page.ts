import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DASHBOARD_SERVICE, type Dashboard } from 'api';
import { DashboardPage } from 'due-q-pages/dashboard/dashboard-page';
import { MockDashboardService } from './mock-dashboard.service';
import { installPlaywrightBridge } from './install-playwright-bridge';
import type { IPlaywrightBridge } from './playwright-bridge';
import type { DueQTestBridgeController } from './due-q-test-bridge.controller';
import type { DashboardBridgeController } from './dashboard-bridge.controller';

@Component({
  selector: 'app-test-bridge-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardPage],
  providers: [
    MockDashboardService,
    { provide: DASHBOARD_SERVICE, useExisting: MockDashboardService },
  ],
  template: `
    <div class="bridge-host" data-testid="test-bridge-host">
      @if (mounted()) {
        <app-dashboard-page></app-dashboard-page>
      }
    </div>
  `,
})
export class TestBridgePage implements OnInit {
  private readonly dashboard = inject(MockDashboardService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  protected readonly mounted = signal(false);

  private bridge: IPlaywrightBridge | null = null;

  ngOnInit(): void {
    const inZone = <T>(fn: () => T): T => this.zone.run(fn);

    const bridge = installPlaywrightBridge();
    this.bridge = bridge;

    bridge.registerController<DueQTestBridgeController>('testBridge', {
      ready: true,
      resetAll: () => inZone(() => this.resetAll()),
    });

    bridge.registerController<DashboardBridgeController>('dashboard', {
      setDashboard: (d: Dashboard) =>
        inZone(() => {
          this.dashboard.setDashboard(d);
          this.mounted.set(true);
        }),
    });

    this.destroyRef.onDestroy(() => this.uninstallBridge());
  }

  private resetAll(): void {
    this.bridge?.reset();
    this.dashboard.reset();
    this.mounted.set(false);
  }

  private uninstallBridge(): void {
    if (window.__pluginHostBridge) {
      delete window.__pluginHostBridge;
    }
    this.bridge = null;
  }
}
