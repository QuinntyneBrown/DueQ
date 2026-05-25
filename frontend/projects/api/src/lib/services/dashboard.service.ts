import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-base-url.token';
import { Dashboard } from '../models/dashboard';
import { IDashboardService } from './dashboard.service.contract';

@Injectable({ providedIn: 'root' })
export class DashboardService implements IDashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  get(today?: string): Observable<Dashboard> {
    let params = new HttpParams();
    if (today) {
      params = params.set('today', today);
    }
    return this.http.get<Dashboard>(`${this.baseUrl}/api/dashboard`, { params });
  }
}
