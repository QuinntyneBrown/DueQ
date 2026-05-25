import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-detail-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  templateUrl: './detail-amount.html',
  styleUrl: './detail-amount.scss',
})
export class DetailAmount {
  value = input.required<number>();
  valueLabel = input<string | null>(null);
  meta = input<string | null>(null);
  amountTestId = input<string | null>(null);
  metaTestId = input<string | null>(null);
}
