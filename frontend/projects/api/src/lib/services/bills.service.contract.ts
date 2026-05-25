import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill';
import { CreateBillRequest } from '../models/create-bill-request';
import { ListBillsParams } from '../models/list-bills-params';
import { UpdateBillRequest } from '../models/update-bill-request';

export interface IBillsService {
  list(params?: ListBillsParams): Observable<readonly Bill[]>;
  get(id: string): Observable<Bill>;
  create(request: CreateBillRequest): Observable<Bill>;
  update(id: string, request: UpdateBillRequest): Observable<Bill>;
  delete(id: string): Observable<void>;
  settle(id: string): Observable<Bill>;
  unsettle(id: string): Observable<Bill>;
}

export const BILLS_SERVICE = new InjectionToken<IBillsService>('BILLS_SERVICE');
