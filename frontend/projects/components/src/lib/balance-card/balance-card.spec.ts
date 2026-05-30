import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BalanceCard } from './balance-card';

describe('BalanceCard', () => {
  let component: BalanceCard;
  let fixture: ComponentFixture<BalanceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceCard],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('amount', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
