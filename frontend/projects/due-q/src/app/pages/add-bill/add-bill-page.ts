import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { BILLS_SERVICE, IBillsService } from 'api';
import {
  AmountInput,
  Button,
  DateInput,
  FormField,
  PageHead,
  PreviewBlock,
  TextArea,
  TextInput,
} from 'components';

@Component({
  selector: 'app-add-bill-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    PageHead,
    FormField,
    AmountInput,
    TextInput,
    DateInput,
    TextArea,
    PreviewBlock,
    Button,
  ],
  templateUrl: './add-bill-page.html',
  styleUrl: './add-bill-page.scss',
})
export class AddBillPage {
  private readonly billsService = inject<IBillsService>(BILLS_SERVICE);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    amount: ['', [Validators.required, positiveAmount]],
    name: ['', Validators.required],
    date: [todayIsoDate(), Validators.required],
    note: [''],
  });

  protected readonly submitted = signal(false);
  protected readonly saving = signal(false);

  private readonly value = toSignal(
    this.form.valueChanges.pipe(takeUntilDestroyed()),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly amountNumber = computed(() => parseAmount(this.value().amount ?? ''));
  protected readonly partnerShare = computed(() => {
    const n = this.amountNumber();
    if (n == null) return null;
    return Math.round((n / 2) * 100) / 100;
  });

  protected readonly partnerShareText = computed(() => {
    const s = this.partnerShare();
    return s == null ? '$0.00' : formatCurrency(s);
  });

  protected readonly previewSubtitle = computed(() => {
    const n = this.amountNumber();
    if (n == null) return '50% of $0.00';
    return `50% of ${formatCurrency(n)}`;
  });

  protected readonly amountError = computed(
    () => this.submitted() && this.form.controls.amount.invalid && amountErrorMessage(this.form.controls.amount.errors),
  );
  protected readonly nameError = computed(
    () => this.submitted() && this.form.controls.name.invalid && 'Tell us what this bill is for.',
  );

  async save(addAnother = false): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    try {
      const { amount, name, date, note } = this.form.getRawValue();
      const amountNumber = parseAmount(amount ?? '');
      if (amountNumber == null) return;
      await firstValueFrom(
        this.billsService.create({
          amount: amountNumber,
          description: name ?? '',
          date: date ?? todayIsoDate(),
          note: note?.trim() ? note.trim() : null,
        }),
      );
      if (addAnother) {
        this.form.reset({
          amount: '',
          name: '',
          date: todayIsoDate(),
          note: '',
        });
        this.submitted.set(false);
      } else {
        await this.router.navigateByUrl('/bills');
      }
    } finally {
      this.saving.set(false);
    }
  }
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseAmount(raw: string): number | null {
  if (raw.trim() === '') return null;
  if (!/^-?\d+(\.\d{1,2})?$/.test(raw.trim())) return null;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n)) return null;
  return n;
}

function positiveAmount(control: FormControl<string>): ValidationErrors | null {
  const v = control.value;
  if (v == null || v.trim() === '') return null;
  const n = parseAmount(v);
  if (n == null) return { numeric: true };
  if (n <= 0) return { positive: true };
  return null;
}

function amountErrorMessage(errors: ValidationErrors | null): string {
  if (!errors) return 'Enter an amount.';
  if (errors['required']) return 'Enter an amount.';
  if (errors['numeric']) return 'Enter a valid amount, e.g. 84.20.';
  if (errors['positive']) return 'Amount must be greater than zero.';
  return 'Enter a valid amount.';
}

function formatCurrency(value: number): string {
  return new CurrencyPipe('en-US').transform(value, 'USD', 'symbol', '1.2-2') ?? `$${value.toFixed(2)}`;
}
