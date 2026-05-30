import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineGroup } from './timeline-group';

describe('TimelineGroup', () => {
  let component: TimelineGroup;
  let fixture: ComponentFixture<TimelineGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineGroup);
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
