import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { BILLS_SERVICE } from 'api';
import { BillsPage } from './bills-page';

describe('BillsPage', () => {
  let component: BillsPage;
  let fixture: ComponentFixture<BillsPage>;
  let mockBILLS_SERVICE: any;

  beforeEach(async () => {
    mockBILLS_SERVICE = {
      list: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BillsPage],
      providers: [
        { provide: BILLS_SERVICE, useValue: mockBILLS_SERVICE },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillsPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
