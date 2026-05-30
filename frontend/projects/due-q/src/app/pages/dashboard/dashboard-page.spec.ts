import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { DASHBOARD_SERVICE } from 'api';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;
  let mockDASHBOARD_SERVICE: any;

  beforeEach(async () => {
    mockDASHBOARD_SERVICE = {
      get: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: DASHBOARD_SERVICE, useValue: mockDASHBOARD_SERVICE },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
