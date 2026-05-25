import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-base-url.token';
import { Bill } from '../models/bill';
import { CreateBillRequest } from '../models/create-bill-request';
import { ListBillsParams } from '../models/list-bills-params';
import { UpdateBillRequest } from '../models/update-bill-request';
import { IBillsService } from './bills.service.contract';

@Injectable({ providedIn: 'root' })
export class BillsService implements IBillsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  private get url(): string {
    return `${this.baseUrl}/api/bills`;
  }

  list(params?: ListBillsParams): Observable<readonly Bill[]> {
    let httpParams = new HttpParams();
    if (params?.status !== undefined) {
      httpParams = httpParams.set('status', params.status.toString());
    }
    if (params?.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params?.to) {
      httpParams = httpParams.set('to', params.to);
    }
    return this.http.get<readonly Bill[]>(this.url, { params: httpParams });
  }

  get(id: string): Observable<Bill> {
    return this.http.get<Bill>(`${this.url}/${id}`);
  }

  create(request: CreateBillRequest): Observable<Bill> {
    return this.http.post<Bill>(this.url, request);
  }

  update(id: string, request: UpdateBillRequest): Observable<Bill> {
    return this.http.put<Bill>(`${this.url}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  settle(id: string): Observable<Bill> {
    return this.http.post<Bill>(`${this.url}/${id}/settle`, {});
  }

  unsettle(id: string): Observable<Bill> {
    return this.http.post<Bill>(`${this.url}/${id}/unsettle`, {});
  }
}
