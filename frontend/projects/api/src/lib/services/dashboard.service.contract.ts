import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Dashboard } from '../models/dashboard';

export interface IDashboardService {
  get(today?: string): Observable<Dashboard>;
}

export const DASHBOARD_SERVICE = new InjectionToken<IDashboardService>('DASHBOARD_SERVICE');
