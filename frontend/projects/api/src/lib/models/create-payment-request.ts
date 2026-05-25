import { PaymentMethod } from './payment-method';

export interface CreatePaymentRequest {
  readonly amount: number;
  readonly date: string;
  readonly method: PaymentMethod;
  readonly note: string | null;
}
