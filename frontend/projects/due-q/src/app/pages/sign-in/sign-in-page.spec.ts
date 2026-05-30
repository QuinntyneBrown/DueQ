import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { AuthService } from 'api';
import { AuthStore } from 'api';
import { SignInPage } from './sign-in-page';

describe('SignInPage', () => {
  let component: SignInPage;
  let fixture: ComponentFixture<SignInPage>;
  let mockAuthService: any;
  let mockAuthStore: any;

  beforeEach(async () => {
    mockAuthService = {
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      login: vi.fn(() => of({})),
    };

    mockAuthStore = {
      isAuthenticated: vi.fn(),
      setSession: vi.fn(),
      clear: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SignInPage],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: ActivatedRoute, useValue: {
          snapshot: { paramMap: convertToParamMap({}), queryParamMap: convertToParamMap({}), params: {}, queryParams: {}, data: {} },
          paramMap: of(convertToParamMap({})), queryParamMap: of(convertToParamMap({})),
          params: of({}), queryParams: of({}), data: of({}),
        } },
        { provide: AuthService, useValue: mockAuthService },
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should call submit without throwing', () => {
    expect(() => component.submit()).not.toThrow();
  });
});
