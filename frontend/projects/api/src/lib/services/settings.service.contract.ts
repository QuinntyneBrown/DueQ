import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Settings } from '../models/settings';
import { UpdateSettingsRequest } from '../models/update-settings-request';

export interface ISettingsService {
  get(): Observable<Settings>;
  update(request: UpdateSettingsRequest): Observable<Settings>;
}

export const SETTINGS_SERVICE = new InjectionToken<ISettingsService>('SETTINGS_SERVICE');
