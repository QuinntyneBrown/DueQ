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
  template: `
    <div class="segmented" role="tablist">
      @for (opt of options(); track opt.value) {
        <button
          type="button"
          class="seg"
          [class.is-active]="opt.value === value()"
          [disabled]="disabled()"
          (click)="select(opt.value)"
        >
          {{ opt.label }}
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .segmented {
      display: flex;
      background: var(--surface-2);
      border-radius: var(--r-2);
      padding: 4px;
      gap: 2px;
    }
    .seg {
      flex: 1;
      height: 40px;
      border: none;
      background: transparent;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--ink-2);
      cursor: pointer;
      font-family: inherit;
    }
    .seg.is-active {
      background: var(--surface);
      color: var(--ink);
      box-shadow: var(--shadow-1);
    }
    .seg:disabled { cursor: not-allowed; opacity: 0.5; }
  `,
})
export class SegmentedControl<T = string> implements ControlValueAccessor {
  options = input.required<SegmentedOption<T>[]>();

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
