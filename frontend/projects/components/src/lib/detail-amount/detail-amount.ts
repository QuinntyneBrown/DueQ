import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-detail-amount',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div class="amount">{{ value() | currency }}</div>
    @if (meta()) {
      <div class="meta">{{ meta() }}</div>
    }
  `,
  styles: `
    :host { display: block; }
    .amount {
      font-family: var(--font-num);
      font-size: 48px;
      letter-spacing: -0.03em;
      font-weight: 600;
      line-height: 1;
    }
    .meta {
      color: var(--muted);
      font-size: 14px;
      margin-top: var(--s-2);
    }
  `,
})
export class DetailAmount {
  value = input.required<number>();
  meta = input<string | null>(null);
}
