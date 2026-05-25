import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconTile } from '../icon-tile/icon-tile';
import { TimelineEntry, normalizeActivityKind } from '../models';

@Component({
  selector: 'lib-timeline-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconTile],
  templateUrl: './timeline-row.html',
  styleUrl: './timeline-row.scss',
})
export class TimelineRow {
  entry = input.required<TimelineEntry>();
  balanceTestId = input<string | null>(null);
  testId = input<string | null>(null);

  kind = computed(() => normalizeActivityKind(this.entry().kind));
  isPayment = computed(() => this.kind() === 'payment');

  deltaLabel = computed(() => {
    const e = this.entry();
    if (e.deltaLabel) return e.deltaLabel;
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const prefix = this.kind() === 'payment' ? '−' : '+';
    return prefix + formatter.format(Math.abs(e.delta));
  });

  balanceLabel = computed(() => this.entry().balanceLabel ?? `balance ${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(this.entry().balanceAfter)}`);
}
