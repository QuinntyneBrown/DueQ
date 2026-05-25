import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SegmentedOption } from '../models';

@Component({
  selector: 'lib-segmented-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedControl),
      multi: true,
    },
  ],
  templateUrl: './segmented-control.html',
  styleUrl: './segmented-control.scss',
})
export class SegmentedControl<T = string> implements ControlValueAccessor {
  options = input.required<SegmentedOption<T>[]>();
  ariaLabel = input<string | null>(null);
  testId = input<string | null>(null);

  value = signal<T | null>(null);
  disabled = signal<boolean>(false);

  private onChangeFn: (v: T | null) => void = () => {};
  private onTouchedFn: () => void = () => {};

  writeValue(value: T | null): void {
    this.value.set(value);
  }
  registerOnChange(fn: (v: T | null) => void): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  select(v: T) {
    this.value.set(v);
    this.onChangeFn(v);
    this.onTouchedFn();
  }
}
