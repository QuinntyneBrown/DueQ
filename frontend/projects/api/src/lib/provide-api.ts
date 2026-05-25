import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { API_BASE_URL } from './api-base-url.token';
import { BillsService } from './services/bills.service';
import { BILLS_SERVICE } from './services/bills.service.contract';
import { DashboardService } from './services/dashboard.service';
import { DASHBOARD_SERVICE } from './services/dashboard.service.contract';
import { HistoryService } from './services/history.service';
import { HISTORY_SERVICE } from './services/history.service.contract';
import { PaymentsService } from './services/payments.service';
import { PAYMENTS_SERVICE } from './services/payments.service.contract';
import { SettingsService } from './services/settings.service';
import { SETTINGS_SERVICE } from './services/settings.service.contract';

export interface ProvideApiOptions {
  readonly baseUrl: string;
}

export function provideApi(options: ProvideApiOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: API_BASE_URL, useValue: options.baseUrl },
    { provide: SETTINGS_SERVICE, useExisting: SettingsService },
    { provide: BILLS_SERVICE, useExisting: BillsService },
    { provide: PAYMENTS_SERVICE, useExisting: PaymentsService },
    { provide: DASHBOARD_SERVICE, useExisting: DashboardService },
    { provide: HISTORY_SERVICE, useExisting: HistoryService },
  ]);
}
