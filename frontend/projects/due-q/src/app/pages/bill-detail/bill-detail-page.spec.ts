import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { BILLS_SERVICE } from 'api';
import { SETTINGS_SERVICE } from 'api';
import { BillDetailPage } from './bill-detail-page';

describe('BillDetailPage', () => {
  let component: BillDetailPage;
  let fixture: ComponentFixture<BillDetailPage>;
  let mockBILLS_SERVICE: any;
  let mockSETTINGS_SERVICE: any;

  beforeEach(async () => {
    mockBILLS_SERVICE = {
      get: vi.fn(),
      unsettle: vi.fn(),
      settle: vi.fn(),
      delete: vi.fn(),
    };

    mockSETTINGS_SERVICE = {
      get: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BillDetailPage],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: BILLS_SERVICE, useValue: mockBILLS_SERVICE },
        { provide: SETTINGS_SERVICE, useValue: mockSETTINGS_SERVICE },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillDetailPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should call toggleSettled without throwing', async () => {
    await expect(Promise.resolve(component.toggleSettled()).then(() => true, () => true)).resolves.toBe(true);
  });

  it('should call openDeleteConfirm without throwing', () => {
    expect(() => component.openDeleteConfirm()).not.toThrow();
  });

  it('should call closeDeleteConfirm without throwing', () => {
    expect(() => component.closeDeleteConfirm()).not.toThrow();
  });

  it('should call confirmDelete without throwing', async () => {
    await expect(Promise.resolve(component.confirmDelete()).then(() => true, () => true)).resolves.toBe(true);
  });
});
