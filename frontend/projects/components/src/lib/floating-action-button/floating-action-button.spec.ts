import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FloatingActionButton } from './floating-action-button';

describe('FloatingActionButton', () => {
  let component: FloatingActionButton;
  let fixture: ComponentFixture<FloatingActionButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingActionButton],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FloatingActionButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should expose the clicked output', () => {
    expect(() => {
      const sub = component.clicked.subscribe(() => {});
      sub.unsubscribe();
    }).not.toThrow();
  });
});
