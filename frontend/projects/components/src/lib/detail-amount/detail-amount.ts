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
  meta = input<string | null>(null);
}
