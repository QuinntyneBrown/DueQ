import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IconTile } from '../icon-tile/icon-tile';
import { ActivityItem } from '../models';

@Component({
  selector: 'lib-activity-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, IconTile],
  template: `
    <a class="row" [attr.href]="item().href" (click)="onClick($event)">
      <lib-icon-tile [icon]="item().icon" [kind]="item().kind"></lib-icon-tile>
      <div class="body">
        <div class="title">{{ item().title }}</div>
        <div class="meta">{{ item().meta }}</div>
      </div>
      <div class="right">
        <div class="amount" [class.received]="isPayment()">{{ displayAmount() }}</div>
        @if (item().sub) {
          <div class="sub">{{ item().sub }}</div>
        }
      </div>
    </a>
  `,
  styles: `
    :host { display: block; }
    .row {
      display: flex;
      align-items: center;
      gap: var(--s-3);
      padding: var(--s-4);
      border-bottom: 1px solid var(--border);
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    :host(:last-child) .row { border-bottom: none; }
    .body { flex: 1; min-width: 0; }
    .title { font-weight: 600; font-size: 15px; letter-spacing: -0.01em; line-height: 1.25; color: var(--ink); }
    .meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
    .right { text-align: right; flex-shrink: 0; }
    .amount {
      font-family: var(--font-num);
      font-weight: 600;
      font-size: 15px;
      letter-spacing: -0.01em;
      color: var(--ink);
    }
    .amount.received { color: var(--owed-to-you); }
    .sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
  `,
})
export class ActivityRow {
  item = input.required<ActivityItem>();
  clicked = output<ActivityItem>();

  isPayment = computed(() => this.item().kind === 'payment');

  displayAmount = computed(() => {
    const i = this.item();
    if (i.amountLabel) return i.amountLabel;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    const prefix = i.kind === 'payment' ? '−' : '+';
    return prefix + formatter.format(Math.abs(i.amount));
  });

  onClick(event: Event) {
    if (!this.item().href) {
      event.preventDefault();
    }
    this.clicked.emit(this.item());
  }
}
