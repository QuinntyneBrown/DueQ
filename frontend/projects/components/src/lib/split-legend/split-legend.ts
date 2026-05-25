import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-split-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  templateUrl: './split-legend.html',
  styleUrl: './split-legend.scss',
})
export class SplitLegend {
  youName = input<string>('You');
  youAmount = input.required<number>();
  partnerName = input<string>('Partner');
  partnerAmount = input.required<number>();
}
