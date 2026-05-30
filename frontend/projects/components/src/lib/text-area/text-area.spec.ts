import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextArea } from './text-area';

describe('TextArea', () => {
  let component: TextArea;
  let fixture: ComponentFixture<TextArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextArea],
    }).compileComponents();

    fixture = TestBed.createComponent(TextArea);
    component = fixture.componentInstance;
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
    expect(() => component.onChange('test-value')).not.toThrow();
  });

  it('should reflect onChange through its signals', () => {
    const vArg = 'test-value';
    component.onChange(vArg);
    expect(component.value()).toBe(vArg);
  });
});
