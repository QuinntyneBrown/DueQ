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
  template: `
    <div class="input-amount">
      <span class="currency">{{ currency() }}</span>
      <input
        class="input"
        type="text"
        inputmode="decimal"
        [id]="inputId()"
        [disabled]="disabled()"
        [ngModel]="display()"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
      />
    </div>
  `,
  styles: `
    :host { display: block; }
    .input-amount {
      position: relative;
    }
    .currency {
      position: absolute;
      left: var(--s-4);
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted);
      font-size: 18px;
      font-weight: 500;
    }
    .input {
      width: 100%;
      border: 1px solid var(--border-strong);
      border-radius: var(--r-2);
      background: var(--surface);
      padding: 0 var(--s-4) 0 32px;
      height: 56px;
      font-family: var(--font-num);
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--ink);
      box-sizing: border-box;
    }
    .input:focus { outline: none; border-color: var(--ink); }
  `,
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
