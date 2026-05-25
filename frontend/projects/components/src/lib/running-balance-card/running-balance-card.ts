import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-running-balance-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  templateUrl: './running-balance-card.html',
  styleUrl: './running-balance-card.scss',
})
export class RunningBalanceCard {
  balance = input.required<number>();
  balanceLabel = input<string | null>(null);
  balanceTestId = input<string | null>(null);
  logged = input.required<number>();
  loggedLabel = input<string | null>(null);
  loggedTestId = input<string | null>(null);
  paidBack = input.required<number>();
  paidBackLabel = input<string | null>(null);
  paidBackTestId = input<string | null>(null);
  partnerName = input<string>('Sam');
  testId = input<string | null>(null);
}
