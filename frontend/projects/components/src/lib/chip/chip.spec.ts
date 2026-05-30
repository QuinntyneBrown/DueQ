import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chip } from './chip';

describe('Chip', () => {
  let component: Chip;
  let fixture: ComponentFixture<Chip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chip],
    }).compileComponents();

    fixture = TestBed.createComponent(Chip);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'test-value');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should expose the toggle output', () => {
    expect(() => {
      const sub = component.toggle.subscribe(() => {});
      sub.unsubscribe();
    }).not.toThrow();
  });
});
