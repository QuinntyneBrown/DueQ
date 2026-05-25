import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-text-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInput),
      multi: true,
    },
  ],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput implements ControlValueAccessor {
  placeholder = input<string>('');
  inputId = input<string | null>(null);
  ariaLabel = input<string | null>(null);
  testId = input<string | null>(null);

  value = signal<string>('');
  disabled = signal<boolean>(false);

  private onChangeFn: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onChange(v: string) {
    this.value.set(v);
    this.onChangeFn(v);
  }
}
