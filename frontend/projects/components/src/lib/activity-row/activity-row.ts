import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconTile } from '../icon-tile/icon-tile';
import { ActivityItem, normalizeActivityKind } from '../models';

@Component({
  selector: 'lib-activity-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconTile, RouterLink],
  templateUrl: './activity-row.html',
  styleUrl: './activity-row.scss',
})
export class ActivityRow {
  item = input.required<ActivityItem>();
  clicked = output<ActivityItem>();

  kind = computed(() => normalizeActivityKind(this.item().kind));
  isPayment = computed(() => this.kind() === 'payment');

  displayAmount = computed(() => {
    const i = this.item();
    if (i.amountLabel) return i.amountLabel;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    const prefix = this.kind() === 'payment' ? '−' : '+';
    return prefix + formatter.format(Math.abs(i.amount));
  });

  onClick() {
    this.clicked.emit(this.item());
  }
}
