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
  logged = input.required<number>();
  paidBack = input.required<number>();
  partnerName = input<string>('Sam');
}
