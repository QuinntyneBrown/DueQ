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
  TextArea,
  TextInput,
} from 'components';
import { BILLS_SERVICE, SETTINGS_SERVICE } from 'api';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'lib-add-bill-page',
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
    TextArea,
    TextInput,
  ],
  templateUrl: './add-bill-page.html',
  styleUrl: './add-bill-page.scss',
})
export class AddBillPage {
  private readonly fb = inject(FormBuilder);
  private readonly billsService = inject(BILLS_SERVICE);
  private readonly settings = inject(SETTINGS_SERVICE);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    amount: this.fb.nonNullable.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    description: this.fb.nonNullable.control<string>('', [Validators.required, Validators.minLength(1)]),
    date: this.fb.nonNullable.control<string>(todayIso(), [Validators.required]),
    note: this.fb.nonNullable.control<string>(''),
  });

  readonly submitted = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  private readonly amountSignal = toSignal(this.form.controls.amount.valueChanges, {
    initialValue: this.form.controls.amount.value,
  });

  private readonly profile = toSignal(this.settings.get(), {
    initialValue: { yourName: 'You', partnerName: 'Partner' },
  });

  readonly partnerName = computed(() => this.profile().partnerName || 'Partner');
  readonly partnerShare = computed(() => (this.amountSignal() ?? 0) / 2);
  readonly previewLabel = computed(() => `${this.partnerName()} owes`);
  readonly previewSub = computed(() => `50% of ${formatUsd(this.amountSignal() ?? 0)}`);

  readonly amountError = computed(() => this.shownError('amount'));
  readonly nameError = computed(() => this.shownError('description'));

  private shownError(field: 'amount' | 'description' | 'date'): string | null {
    const c = this.form.controls[field];
    if (c.valid || !c.touched) return null;
    if (c.hasError('required')) return 'Required';
    if (c.hasError('min')) return 'Must be greater than zero';
    return 'Invalid';
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submit(false);
  }

  saveAndAddAnother() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submit(true);
  }

  private submit(keepAdding: boolean) {
    const v = this.form.getRawValue();
    this.billsService
      .create({
        amount: v.amount as number,
        description: v.description,
        date: v.date,
        note: v.note?.trim() ? v.note.trim() : null,
      })
      .subscribe(() => {
        if (keepAdding) {
          this.form.reset({ amount: null, description: '', date: todayIso(), note: '' });
        } else {
          this.router.navigateByUrl('/bills');
        }
      });
  }
}

function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
