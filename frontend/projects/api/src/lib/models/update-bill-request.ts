export interface UpdateBillRequest {
  readonly description: string;
  readonly amount: number;
  readonly date: string;
  readonly note: string | null;
}
