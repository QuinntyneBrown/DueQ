import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should call cssClasses without throwing', () => {
    expect(() => component.cssClasses()).not.toThrow();
  });

  it('should call onClick without throwing', () => {
    expect(() => component.onClick({} as any)).not.toThrow();
  });

  it('should expose the clicked output', () => {
    expect(() => {
      const sub = component.clicked.subscribe(() => {});
      sub.unsubscribe();
    }).not.toThrow();
  });
});
