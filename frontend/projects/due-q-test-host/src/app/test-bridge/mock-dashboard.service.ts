import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import type { Dashboard, IDashboardService } from 'api';

@Injectable()
export class MockDashboardService implements IDashboardService {
  private current: Dashboard | null = null;

  setDashboard(dashboard: Dashboard): void {
    this.current = dashboard;
  }

  reset(): void {
    this.current = null;
  }

  get(today?: string): Observable<Dashboard> {
    window.__pluginHostBridge?.recordCall('DashboardService.get', [today]);
    if (!this.current) {
      return throwError(() => new Error('MockDashboardService: no dashboard registered'));
    }
    return of(this.current);
  }
}
