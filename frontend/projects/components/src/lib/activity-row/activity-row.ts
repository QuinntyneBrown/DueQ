import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconTile } from '../icon-tile/icon-tile';
import { ActivityItem } from '../models';

@Component({
  selector: 'lib-activity-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconTile],
  templateUrl: './activity-row.html',
  styleUrl: './activity-row.scss',
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
