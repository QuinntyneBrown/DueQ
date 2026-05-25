import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-balance-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  templateUrl: './balance-card.html',
  styleUrl: './balance-card.scss',
})
export class BalanceCard {
  label = input<string>('Sam owes you');
  amount = input.required<number>();
  meta = input<string | null>(null);
  addBill = output<void>();
  recordPayment = output<void>();
}
