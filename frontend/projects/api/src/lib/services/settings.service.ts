import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-base-url.token';
import { Settings } from '../models/settings';
import { UpdateSettingsRequest } from '../models/update-settings-request';
import { ISettingsService } from './settings.service.contract';

@Injectable({ providedIn: 'root' })
export class SettingsService implements ISettingsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  get(): Observable<Settings> {
    return this.http.get<Settings>(`${this.baseUrl}/api/settings`);
  }

  update(request: UpdateSettingsRequest): Observable<Settings> {
    return this.http.put<Settings>(`${this.baseUrl}/api/settings`, request);
  }
}
