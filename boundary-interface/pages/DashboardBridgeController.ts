import type { BridgeDashboard } from './BridgeDashboard';

export interface DashboardBridgeController {
  setDashboard(dashboard: BridgeDashboard): void;
}
