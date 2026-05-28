import type { Dashboard } from 'api';

export interface DashboardBridgeController {
  setDashboard(dashboard: Dashboard): void;
}
