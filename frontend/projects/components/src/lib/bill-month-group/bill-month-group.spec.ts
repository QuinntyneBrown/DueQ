import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillMonthGroup } from './bill-month-group';

describe('BillMonthGroup', () => {
  let component: BillMonthGroup;
  let fixture: ComponentFixture<BillMonthGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillMonthGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(BillMonthGroup);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('month', 'test-value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
