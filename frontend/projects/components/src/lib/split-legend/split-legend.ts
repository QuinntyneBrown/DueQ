import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-split-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div class="split-legend">
      <div><span class="dot you"></span>{{ youName() }} — {{ youAmount() | currency }}</div>
      <div><span class="dot partner"></span>{{ partnerName() }} — {{ partnerAmount() | currency }}</div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .split-legend {
      display: flex;
      gap: var(--s-4);
      font-size: 12px;
      color: var(--ink-2);
      flex-wrap: wrap;
    }
    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
      vertical-align: middle;
    }
    .dot.you { background: var(--ink); }
    .dot.partner { background: var(--accent); }
  `,
})
export class SplitLegend {
  youName = input<string>('You');
  youAmount = input.required<number>();
  partnerName = input<string>('Partner');
  partnerAmount = input.required<number>();
}
