import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IconTile } from '../icon-tile/icon-tile';
import { TimelineEntry } from '../models';

@Component({
  selector: 'lib-timeline-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, IconTile],
  templateUrl: './timeline-row.html',
  styleUrl: './timeline-row.scss',
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
