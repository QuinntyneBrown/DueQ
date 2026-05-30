import { TestBed } from '@angular/core/testing';
import { MockDashboardService } from './mock-dashboard.service';

describe('MockDashboardService', () => {
  let service: MockDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockDashboardService,
      ],
    });

    service = TestBed.inject(MockDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setDashboard without throwing', () => {
    expect(() => service.setDashboard({} as any)).not.toThrow();
  });

  it('should call reset without throwing', () => {
    expect(() => service.reset()).not.toThrow();
  });

  it('should call get without throwing', () => {
    expect(() => {
      const sub = service.get().subscribe({ next: () => {}, error: () => {} });
      sub.unsubscribe();
    }).not.toThrow();
  });
});
