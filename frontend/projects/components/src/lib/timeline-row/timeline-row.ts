import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IconTile } from '../icon-tile/icon-tile';
import { TimelineEntry } from '../models';

@Component({
  selector: 'lib-timeline-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, IconTile],
  template: `
    <div class="row">
      <lib-icon-tile [icon]="entry().icon" [kind]="entry().kind"></lib-icon-tile>
      <div class="body">
        <div class="title">{{ entry().title }}</div>
        <div class="meta">{{ entry().meta }}</div>
      </div>
      <div class="right">
        <div class="amount" [class.received]="isPayment()">{{ deltaLabel() }}</div>
        <div class="sub">balance {{ entry().balanceAfter | currency }}</div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .row {
      display: flex;
      align-items: center;
      gap: var(--s-3);
      padding: var(--s-4);
      border-bottom: 1px solid var(--border);
    }
    :host(:last-of-type) .row { border-bottom: none; }
    .body { flex: 1; min-width: 0; }
    .title { font-weight: 600; font-size: 15px; letter-spacing: -0.01em; color: var(--ink); }
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
    .sub { font-size: 11px; color: var(--muted); margin-top: 2px; font-family: var(--font-num); }
  `,
})
export class TimelineRow {
  entry = input.required<TimelineEntry>();

  isPayment = computed(() => this.entry().kind === 'payment');

  deltaLabel = computed(() => {
    const e = this.entry();
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const prefix = e.kind === 'payment' ? '−' : '+';
    return prefix + formatter.format(Math.abs(e.delta));
  });
}
