export interface CreateBillRequest {
  readonly description: string;
  readonly amount: number;
  readonly date: string;
  readonly note: string | null;
}
