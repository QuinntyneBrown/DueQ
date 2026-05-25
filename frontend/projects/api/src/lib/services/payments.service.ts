import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-base-url.token';
import { CreatePaymentRequest } from '../models/create-payment-request';
import { ListPaymentsParams } from '../models/list-payments-params';
import { Payment } from '../models/payment';
import { IPaymentsService } from './payments.service.contract';

@Injectable({ providedIn: 'root' })
export class PaymentsService implements IPaymentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  private get url(): string {
    return `${this.baseUrl}/api/payments`;
  }

  list(params?: ListPaymentsParams): Observable<readonly Payment[]> {
    let httpParams = new HttpParams();
    if (params?.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params?.to) {
      httpParams = httpParams.set('to', params.to);
    }
    return this.http.get<readonly Payment[]>(this.url, { params: httpParams });
  }

  create(request: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.url, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
