import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { HISTORY_SERVICE } from 'api';
import { SETTINGS_SERVICE } from 'api';
import { BILLS_SERVICE } from 'api';
import { HistoryPage } from './history-page';

describe('HistoryPage', () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;
  let mockHISTORY_SERVICE: any;
  let mockSETTINGS_SERVICE: any;
  let mockBILLS_SERVICE: any;

  beforeEach(async () => {
    mockHISTORY_SERVICE = {
      get: vi.fn(),
    };

    mockSETTINGS_SERVICE = {
      get: vi.fn(),
    };

    mockBILLS_SERVICE = {};

    await TestBed.configureTestingModule({
      imports: [HistoryPage],
      providers: [
        { provide: HISTORY_SERVICE, useValue: mockHISTORY_SERVICE },
        { provide: SETTINGS_SERVICE, useValue: mockSETTINGS_SERVICE },
        { provide: BILLS_SERVICE, useValue: mockBILLS_SERVICE },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
