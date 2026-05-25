import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-amount-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmountInput),
      multi: true,
    },
  ],
  templateUrl: './amount-input.html',
  styleUrl: './amount-input.scss',
})
export class AmountInput implements ControlValueAccessor {
  currency = input<string>('$');
  inputId = input<string | null>(null);

  display = signal<string>('');
  disabled = signal<boolean>(false);

  private onChangeFn: (v: number | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: number | string | null): void {
    if (value === null || value === undefined || value === '') {
      this.display.set('');
    } else {
      this.display.set(typeof value === 'number' ? value.toFixed(2) : String(value));
    }
  }
  registerOnChange(fn: (v: number | null) => void): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onChange(raw: string) {
    this.display.set(raw);
    const cleaned = raw.replace(/[^\d.-]/g, '');
    if (cleaned === '' || cleaned === '-' || cleaned === '.') {
      this.onChangeFn(null);
      return;
    }
    const n = parseFloat(cleaned);
    this.onChangeFn(Number.isFinite(n) ? n : null);
  }
}
