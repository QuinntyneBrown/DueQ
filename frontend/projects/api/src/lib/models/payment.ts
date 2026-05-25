import { PaymentMethod } from './payment-method';

export interface Payment {
  readonly id: string;
  readonly amount: number;
  readonly date: string;
  readonly method: PaymentMethod;
  readonly note: string | null;
  readonly createdAt: string;
}
