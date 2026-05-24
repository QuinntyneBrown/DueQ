import { BillStatus } from './bill-status';

export interface Bill {
  readonly id: string;
  readonly description: string;
  readonly amount: number;
  readonly partnerShare: number;
  readonly date: string;
  readonly note: string | null;
  readonly status: BillStatus;
  readonly createdAt: string;
}
