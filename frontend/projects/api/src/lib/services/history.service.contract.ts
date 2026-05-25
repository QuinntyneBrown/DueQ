import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { History } from '../models/history';

export interface IHistoryService {
  get(): Observable<History>;
}

export const HISTORY_SERVICE = new InjectionToken<IHistoryService>('HISTORY_SERVICE');
