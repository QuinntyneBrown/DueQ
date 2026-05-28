import type { BridgeActivityItem } from './BridgeActivityItem';

export interface BridgeDashboard {
  readonly yourName: string;
  readonly partnerName: string;
  readonly balance: number;
  readonly outstandingBillCount: number;
  readonly lastSettlementDate: string | null;
  readonly thisMonthLogged: number;
  readonly thisMonthReceived: number;
  readonly behindByDays: number;
  readonly recentActivity: readonly BridgeActivityItem[];
}
