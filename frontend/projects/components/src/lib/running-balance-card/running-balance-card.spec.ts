import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunningBalanceCard } from './running-balance-card';

describe('RunningBalanceCard', () => {
  let component: RunningBalanceCard;
  let fixture: ComponentFixture<RunningBalanceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunningBalanceCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RunningBalanceCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('balance', 1);
    fixture.componentRef.setInput('logged', 1);
    fixture.componentRef.setInput('paidBack', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
