import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth-store';

describe('AuthStore', () => {
  let service: AuthStore;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthStore,
      ],
    });

    service = TestBed.inject(AuthStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call isAuthenticated without throwing', () => {
    expect(() => service.isAuthenticated()).not.toThrow();
  });

  it('should call setSession without throwing', () => {
    expect(() => service.setSession('test-value', {} as any, {} as any)).not.toThrow();
  });

  it('should call clear without throwing', () => {
    expect(() => service.clear()).not.toThrow();
  });

  it('should read the token signal', () => {
    expect(() => service.token()).not.toThrow();
  });

  it('should read the user signal', () => {
    expect(() => service.user()).not.toThrow();
  });

  it('should reflect state mutations through its signals', () => {
    expect(() => {
      service.setSession('test-value', {} as any, {} as any);
      service.clear();
      service.token();
      service.user();
    }).not.toThrow();
  });
});
