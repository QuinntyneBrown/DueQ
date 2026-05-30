import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  let component: Checkbox;
  let fixture: ComponentFixture<Checkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkbox);
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

  it('should call writeValue without throwing', () => {
    expect(() => component.writeValue({} as any)).not.toThrow();
  });

  it('should call registerOnChange without throwing', () => {
    expect(() => component.registerOnChange(() => undefined)).not.toThrow();
  });

  it('should call registerOnTouched without throwing', () => {
    expect(() => component.registerOnTouched(() => undefined)).not.toThrow();
  });

  it('should call setDisabledState without throwing', () => {
    expect(() => component.setDisabledState(true)).not.toThrow();
  });

  it('should reflect setDisabledState through its signals', () => {
    const isDisabledArg = true;
    component.setDisabledState(isDisabledArg);
    expect(component.disabled()).toBe(isDisabledArg);
  });

  it('should call onChange without throwing', () => {
    expect(() => component.onChange(true)).not.toThrow();
  });

  it('should reflect onChange through its signals', () => {
    const vArg = true;
    component.onChange(vArg);
    expect(component.value()).toBe(vArg);
  });
});
