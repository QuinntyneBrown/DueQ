import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-base-url.token';
import { LoginRequest, LoginResult } from '../models/login-result';
import { RegisterRequest } from '../models/register-request';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  private get url(): string {
    return `${this.baseUrl}/api/auth`;
  }

  login(request: LoginRequest): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${this.url}/login`, request);
  }

  register(request: RegisterRequest): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${this.url}/register`, request);
  }

  forgotPassword(email: string): Observable<{ devToken: string | null }> {
    return this.http.post<{ devToken: string | null }>(
      `${this.url}/forgot-password`,
      { email },
    );
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.url}/reset-password`, { token, newPassword });
  }
}
