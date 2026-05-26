import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

const TOKEN_KEY = 'dueq.auth.token';
const USER_KEY = 'dueq.auth.user';

export interface SetTokenOptions {
  readonly remember: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _token = signal<string | null>(this.readInitial(TOKEN_KEY));
  private readonly _user = signal<User | null>(this.readInitialJson<User>(USER_KEY));

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();

  isAuthenticated(): boolean {
    return !!this._token();
  }

  setSession(token: string, user: User, options: SetTokenOptions): void {
    const storage = options.remember ? localStorage : sessionStorage;
    const other = options.remember ? sessionStorage : localStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
    other.removeItem(TOKEN_KEY);
    other.removeItem(USER_KEY);
    this._token.set(token);
    this._user.set(user);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
  }

  private readInitial(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  }

  private readInitialJson<T>(key: string): T | null {
    const raw = this.readInitial(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}
