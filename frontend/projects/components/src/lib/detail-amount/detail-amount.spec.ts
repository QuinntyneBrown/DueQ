import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailAmount } from './detail-amount';

describe('DetailAmount', () => {
  let component: DetailAmount;
  let fixture: ComponentFixture<DetailAmount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailAmount],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailAmount);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
