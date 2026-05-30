import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SegmentedControl } from './segmented-control';

describe('SegmentedControl', () => {
  let component: SegmentedControl<any>;
  let fixture: ComponentFixture<SegmentedControl<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentedControl],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentedControl);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', []);
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

  it('should reflect writeValue through its signals', () => {
    const valueArg = {} as any;
    component.writeValue(valueArg);
    expect(component.value()).toBe(valueArg);
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

  it('should call select without throwing', () => {
    expect(() => component.select({} as any)).not.toThrow();
  });

  it('should reflect select through its signals', () => {
    const vArg = {} as any;
    component.select(vArg);
    expect(component.value()).toBe(vArg);
  });
});
