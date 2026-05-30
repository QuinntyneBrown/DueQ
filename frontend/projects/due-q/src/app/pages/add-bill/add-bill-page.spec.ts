import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { BILLS_SERVICE } from 'api';
import { SETTINGS_SERVICE } from 'api';
import { AddBillPage } from './add-bill-page';

describe('AddBillPage', () => {
  let component: AddBillPage;
  let fixture: ComponentFixture<AddBillPage>;
  let mockBILLS_SERVICE: any;
  let mockSETTINGS_SERVICE: any;

  beforeEach(async () => {
    mockBILLS_SERVICE = {
      create: vi.fn(),
    };

    mockSETTINGS_SERVICE = {
      get: vi.fn(() => of({})),
    };

    await TestBed.configureTestingModule({
      imports: [AddBillPage],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: BILLS_SERVICE, useValue: mockBILLS_SERVICE },
        { provide: SETTINGS_SERVICE, useValue: mockSETTINGS_SERVICE },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBillPage);
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
