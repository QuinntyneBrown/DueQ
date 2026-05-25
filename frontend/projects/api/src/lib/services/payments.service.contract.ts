import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePaymentRequest } from '../models/create-payment-request';
import { ListPaymentsParams } from '../models/list-payments-params';
import { Payment } from '../models/payment';

export interface IPaymentsService {
  list(params?: ListPaymentsParams): Observable<readonly Payment[]>;
  create(request: CreatePaymentRequest): Observable<Payment>;
  delete(id: string): Observable<void>;
}

export const PAYMENTS_SERVICE = new InjectionToken<IPaymentsService>('PAYMENTS_SERVICE');
