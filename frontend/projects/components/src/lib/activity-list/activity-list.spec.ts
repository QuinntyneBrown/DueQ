import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityList } from './activity-list';

describe('ActivityList', () => {
  let component: ActivityList;
  let fixture: ComponentFixture<ActivityList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityList],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should expose the rowClick output', () => {
    expect(() => {
      const sub = component.rowClick.subscribe(() => {});
      sub.unsubscribe();
    }).not.toThrow();
  });
});
