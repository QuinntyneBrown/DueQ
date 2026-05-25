import { BillStatus } from './bill-status';

export interface ListBillsParams {
  readonly status?: BillStatus;
  readonly from?: string;
  readonly to?: string;
}
