import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmountInput } from './amount-input';

describe('AmountInput', () => {
  let component: AmountInput;
  let fixture: ComponentFixture<AmountInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmountInput],
    }).compileComponents();

    fixture = TestBed.createComponent(AmountInput);
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

  it('should call onChange without throwing', () => {
    expect(() => component.onChange('test-value')).not.toThrow();
  });
});
