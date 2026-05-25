import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
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
import {
  DASHBOARD_SERVICE,
  IDashboardService,
  IPaymentsService,
  PAYMENTS_SERVICE,
  PaymentMethod,
} from 'api';
import {
  AmountInput,
  BackLink,
  Button,
  DateInput,
  FormField,
  PageHead,
  PreviewBlock,
  SegmentedControl,
  SegmentedOption,
  TextArea,
} from 'components';

type MethodLabel = 'e-Transfer' | 'Cash' | 'Other';

@Component({
  selector: 'app-record-payment-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    BackLink,
    PageHead,
    PreviewBlock,
    FormField,
    AmountInput,
    DateInput,
    SegmentedControl,
    TextArea,
    Button,
  ],
  templateUrl: './record-payment-page.html',
  styleUrl: './record-payment-page.scss',
})
export class RecordPaymentPage {
  private readonly paymentsService = inject<IPaymentsService>(PAYMENTS_SERVICE);
  private readonly dashboardService = inject<IDashboardService>(DASHBOARD_SERVICE);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly methods: MethodLabel[] = ['e-Transfer', 'Cash', 'Other'];
  protected readonly methodOptions: SegmentedOption<MethodLabel>[] = this.methods.map((method) => ({
    label: method,
    value: method,
  }));

  protected readonly form = this.fb.nonNullable.group({
    amount: ['', [Validators.required, positiveAmount]],
    date: [todayIsoDate(), Validators.required],
    method: ['e-Transfer' as MethodLabel, Validators.required],
    note: [''],
  });

  protected readonly submitted = signal(false);
  protected readonly saving = signal(false);

  private readonly dashboard = resource({
    loader: () => firstValueFrom(this.dashboardService.get()),
  });

  protected readonly currentBalance = computed(() => Math.max(0, this.dashboard.value()?.balance ?? 0));
  protected readonly currentBalanceText = computed(() => formatCurrency(this.currentBalance()));
  protected readonly loaded = computed(() => this.dashboard.value() !== undefined);

  private readonly value = toSignal(
    this.form.valueChanges.pipe(takeUntilDestroyed()),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly amountNumber = computed(() => parseAmount(this.value().amount ?? ''));

  protected readonly newBalance = computed(() => {
    const n = this.amountNumber() ?? 0;
    return Math.round((this.currentBalance() - n) * 100) / 100;
  });
  protected readonly newBalanceText = computed(() => {
    const v = this.newBalance();
    return v < 0 ? `-${formatCurrency(Math.abs(v))}` : formatCurrency(v);
  });

  protected readonly overpayment = computed(() => {
    const n = this.amountNumber();
    return n != null && n > this.currentBalance();
  });

  protected readonly previewSubtitle = computed(() => {
    const n = this.amountNumber() ?? 0;
    return `${formatCurrency(this.currentBalance())} − ${formatCurrency(n)}`;
  });

  protected readonly amountError = computed(
    () => this.submitted() && this.form.controls.amount.invalid && amountErrorMessage(this.form.controls.amount.errors),
  );
  protected readonly dateError = computed(
    () => this.submitted() && this.form.controls.date.invalid && 'Pick a date.',
  );

  async save(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    try {
      const { amount, date, method, note } = this.form.getRawValue();
      const amountNumber = parseAmount(amount ?? '');
      if (amountNumber == null) return;
      await firstValueFrom(
        this.paymentsService.create({
          amount: amountNumber,
          date: date ?? todayIsoDate(),
          method: methodToEnum(method ?? 'e-Transfer'),
          note: note?.trim() ? note.trim() : null,
        }),
      );
      await this.router.navigateByUrl('/dashboard');
    } finally {
      this.saving.set(false);
    }
  }
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function methodToEnum(label: MethodLabel): PaymentMethod {
  switch (label) {
    case 'Cash':
      return PaymentMethod.Cash;
    case 'Other':
      return PaymentMethod.Other;
    default:
      return PaymentMethod.ETransfer;
  }
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
  if (errors['numeric']) return 'Enter a valid amount.';
  if (errors['positive']) return 'Amount must be greater than zero.';
  return 'Enter a valid amount.';
}

function formatCurrency(value: number): string {
  return new CurrencyPipe('en-US').transform(value, 'USD', 'symbol', '1.2-2') ?? `$${value.toFixed(2)}`;
}
