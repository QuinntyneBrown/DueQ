import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplitLegend } from './split-legend';

describe('SplitLegend', () => {
  let component: SplitLegend;
  let fixture: ComponentFixture<SplitLegend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitLegend],
    }).compileComponents();

    fixture = TestBed.createComponent(SplitLegend);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('youAmount', 1);
    fixture.componentRef.setInput('partnerAmount', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
