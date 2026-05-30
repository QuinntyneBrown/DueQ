import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { AuthService } from 'api';
import { ForgotPasswordPage } from './forgot-password-page';

describe('ForgotPasswordPage', () => {
  let component: ForgotPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordPage>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn(),
      register: vi.fn(),
      resetPassword: vi.fn(),
      forgotPassword: vi.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordPage],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPage);
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
