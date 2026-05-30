import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatRow } from './stat-row';

describe('StatRow', () => {
  let component: StatRow;
  let fixture: ComponentFixture<StatRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatRow],
    }).compileComponents();

    fixture = TestBed.createComponent(StatRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });
});
