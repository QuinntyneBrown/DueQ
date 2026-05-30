import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { AuthService } from 'api';
import { AuthStore } from 'api';
import { CreateAccountPage } from './create-account-page';

describe('CreateAccountPage', () => {
  let component: CreateAccountPage;
  let fixture: ComponentFixture<CreateAccountPage>;
  let mockAuthService: any;
  let mockAuthStore: any;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      register: vi.fn(() => of({})),
    };

    mockAuthStore = {
      isAuthenticated: vi.fn(),
      setSession: vi.fn(),
      clear: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CreateAccountPage],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountPage);
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
