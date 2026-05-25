import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-base-url.token';
import { History } from '../models/history';
import { IHistoryService } from './history.service.contract';

@Injectable({ providedIn: 'root' })
export class HistoryService implements IHistoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  get(): Observable<History> {
    return this.http.get<History>(`${this.baseUrl}/api/history`);
  }
}
