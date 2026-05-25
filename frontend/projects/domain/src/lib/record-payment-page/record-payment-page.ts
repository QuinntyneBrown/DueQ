import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AmountInput,
  BackLink,
  Button,
  DateInput,
  FormField,
  PageHead,
  PreviewBlock,
  SegmentedControl,
  TextArea,
} from 'components';
import type { SegmentedOption } from 'components';
import { DASHBOARD_SERVICE, PAYMENTS_SERVICE, PaymentMethod } from 'api';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'lib-record-payment-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AmountInput,
    BackLink,
    Button,
    DateInput,
    FormField,
    PageHead,
    PreviewBlock,
    ReactiveFormsModule,
    SegmentedControl,
    TextArea,
  ],
  templateUrl: './record-payment-page.html',
  styleUrl: './record-payment-page.scss',
})
export class RecordPaymentPage {
  private readonly fb = inject(FormBuilder);
  private readonly paymentsService = inject(PAYMENTS_SERVICE);
  private readonly dashboardService = inject(DASHBOARD_SERVICE);
  private readonly router = inject(Router);

  readonly methodOptions: SegmentedOption<PaymentMethod>[] = [
    { label: 'e-Transfer', value: PaymentMethod.ETransfer },
    { label: 'Cash', value: PaymentMethod.Cash },
    { label: 'Other', value: PaymentMethod.Other },
  ];

  readonly form = this.fb.nonNullable.group({
    amount: this.fb.nonNullable.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    date: this.fb.nonNullable.control<string>(todayIso(), [Validators.required]),
    method: this.fb.nonNullable.control<PaymentMethod>(PaymentMethod.ETransfer),
    note: this.fb.nonNullable.control<string>(''),
  });

  private readonly amountSignal = toSignal(this.form.controls.amount.valueChanges, {
    initialValue: this.form.controls.amount.value,
  });

  private readonly dashboard = toSignal(this.dashboardService.get(), { initialValue: null });

  readonly partnerName = computed(() => this.dashboard()?.partnerName || 'Partner');
  readonly currentBalance = computed(() => Math.max(0, this.dashboard()?.balance ?? 0));
  readonly currentBalanceLabel = computed(() => `${this.partnerName()} currently owes`);
  readonly newBalance = computed(() => this.currentBalance() - (this.amountSignal() ?? 0));
  readonly overpay = computed(() => (this.amountSignal() ?? 0) > this.currentBalance() && this.currentBalance() > 0);
  readonly previewSub = computed(
    () => `${formatUsd(this.currentBalance())} − ${formatUsd(this.amountSignal() ?? 0)}`,
  );

  readonly amountError = computed(() => {
    const c = this.form.controls.amount;
    if (c.valid || !c.touched) return null;
    if (c.hasError('required')) return 'Required';
    if (c.hasError('min')) return 'Must be greater than zero';
    return 'Invalid';
  });

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.paymentsService
      .create({
        amount: v.amount as number,
        date: v.date,
        method: v.method,
        note: v.note?.trim() ? v.note.trim() : null,
      })
      .subscribe(() => this.router.navigateByUrl('/dashboard'));
  }
}

function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
