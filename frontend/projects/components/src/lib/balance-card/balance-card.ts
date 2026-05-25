import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-balance-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './balance-card.html',
  styleUrl: './balance-card.scss',
})
export class BalanceCard {
  label = input<string>('Sam owes you');
  amount = input.required<number>();
  meta = input<string | null>(null);
  addBillHref = input<string>('/bills/new');
  recordPaymentHref = input<string>('/payments/new');
}
