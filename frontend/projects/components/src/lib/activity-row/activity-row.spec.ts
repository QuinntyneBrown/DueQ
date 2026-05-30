import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivityRow } from './activity-row';

describe('ActivityRow', () => {
  let component: ActivityRow;
  let fixture: ComponentFixture<ActivityRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityRow],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityRow);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', {} as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should call onClick without throwing', () => {
    expect(() => component.onClick()).not.toThrow();
  });

  it('should expose the clicked output', () => {
    expect(() => {
      const sub = component.clicked.subscribe(() => {});
      sub.unsubscribe();
    }).not.toThrow();
  });
});
