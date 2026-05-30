import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MockDashboardService } from './mock-dashboard.service';
import { DestroyRef } from '@angular/core';
import { TestBridgePage } from './test-bridge-page';

describe('TestBridgePage', () => {
  let component: TestBridgePage;
  let fixture: ComponentFixture<TestBridgePage>;
  let mockMockDashboardService: any;
  let mockDestroyRef: any;

  beforeEach(async () => {
    mockMockDashboardService = {
      setDashboard: vi.fn(),
      reset: vi.fn(),
      get: vi.fn(),
    };

    mockDestroyRef = {
      onDestroy: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TestBridgePage],
      providers: [
        { provide: MockDashboardService, useValue: mockMockDashboardService },
        { provide: DestroyRef, useValue: mockDestroyRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestBridgePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
