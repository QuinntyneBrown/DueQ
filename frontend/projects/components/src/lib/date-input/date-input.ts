import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-date-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInput),
      multi: true,
    },
  ],
  template: `
    <input
      class="input"
      type="date"
      [id]="inputId()"
      [disabled]="disabled()"
      [ngModel]="value()"
      (ngModelChange)="onChange($event)"
      (blur)="onTouched()"
    />
  `,
  styles: `
    :host { display: block; }
    .input {
      width: 100%;
      border: 1px solid var(--border-strong);
      border-radius: var(--r-2);
      background: var(--surface);
      padding: 0 var(--s-4);
      height: 48px;
      font-size: 16px;
      font-family: inherit;
      color: var(--ink);
      box-sizing: border-box;
    }
    .input:focus { outline: none; border-color: var(--ink); }
  `,
})
export class DateInput implements ControlValueAccessor {
  inputId = input<string | null>(null);

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
