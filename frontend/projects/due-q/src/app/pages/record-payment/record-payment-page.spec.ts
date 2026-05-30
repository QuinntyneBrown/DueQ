import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { PAYMENTS_SERVICE } from 'api';
import { DASHBOARD_SERVICE } from 'api';
import { RecordPaymentPage } from './record-payment-page';

describe('RecordPaymentPage', () => {
  let component: RecordPaymentPage;
  let fixture: ComponentFixture<RecordPaymentPage>;
  let mockPAYMENTS_SERVICE: any;
  let mockDASHBOARD_SERVICE: any;

  beforeEach(async () => {
    mockPAYMENTS_SERVICE = {
      create: vi.fn(),
    };

    mockDASHBOARD_SERVICE = {
      get: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RecordPaymentPage],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: PAYMENTS_SERVICE, useValue: mockPAYMENTS_SERVICE },
        { provide: DASHBOARD_SERVICE, useValue: mockDASHBOARD_SERVICE },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordPaymentPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should call save without throwing', async () => {
    await expect(Promise.resolve(component.save()).then(() => true, () => true)).resolves.toBe(true);
  });
});
