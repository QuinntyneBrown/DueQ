import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { AuthService } from 'api';
import { ResetPasswordPage } from './reset-password-page';

describe('ResetPasswordPage', () => {
  let component: ResetPasswordPage;
  let fixture: ComponentFixture<ResetPasswordPage>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn(),
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      imports: [ResetPasswordPage],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: ActivatedRoute, useValue: {
          snapshot: { paramMap: convertToParamMap({}), queryParamMap: convertToParamMap({}), params: {}, queryParams: {}, data: {} },
          paramMap: of(convertToParamMap({})), queryParamMap: of(convertToParamMap({})),
          params: of({}), queryParams: of({}), data: of({}),
        } },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordPage);
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
