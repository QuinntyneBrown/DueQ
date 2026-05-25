import { ActivityItem } from './activity-item';

export interface Dashboard {
  readonly yourName: string;
  readonly partnerName: string;
  readonly balance: number;
  readonly outstandingBillCount: number;
  readonly lastSettlementDate: string | null;
  readonly thisMonthLogged: number;
  readonly thisMonthReceived: number;
  readonly behindByDays: number;
  readonly recentActivity: readonly ActivityItem[];
}
