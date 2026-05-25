import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BillStatusValue, normalizeBillStatus } from '../models';

@Component({
  selector: 'lib-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  kind = input<BillStatusValue>('unsettled');
  testId = input<string | null>(null);

  status = computed(() => normalizeBillStatus(this.kind()));

  defaultLabel(): string {
    const k = this.status();
    return k.charAt(0).toUpperCase() + k.slice(1);
  }
}
