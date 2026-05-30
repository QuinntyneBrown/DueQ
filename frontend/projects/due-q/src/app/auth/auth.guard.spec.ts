import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AuthStore } from 'api';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let mockAuthStore: any;
  let router: Router;

  beforeEach(() => {
    mockAuthStore = {
      isAuthenticated: vi.fn(),
      setSession: vi.fn(),
      clear: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should return a result when executed', () => {
    const result = TestBed.runInInjectionContext(() =>
      (authGuard as unknown as (...args: any[]) => unknown)({}, [])
    );

    expect(result).toBeDefined();
  });
});
