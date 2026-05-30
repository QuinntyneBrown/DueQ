import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from 'api';
import { SETTINGS_SERVICE } from 'api';
import { AuthStore } from 'api';
import { SettingsPage } from './settings-page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let mockSETTINGS_SERVICE: any;
  let mockAuthStore: any;

  beforeEach(async () => {
    mockSETTINGS_SERVICE = {
      get: vi.fn(),
    };

    mockAuthStore = {
      isAuthenticated: vi.fn(),
      setSession: vi.fn(),
      clear: vi.fn(),
      token: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsPage],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
        { provide: SETTINGS_SERVICE, useValue: mockSETTINGS_SERVICE },
        { provide: AuthStore, useValue: mockAuthStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should call signOut without throwing', () => {
    expect(() => component.signOut()).not.toThrow();
  });

  it('should call save without throwing', () => {
    expect(() => component.save()).not.toThrow();
  });
});
