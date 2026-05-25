import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BillStatus } from '../models';

@Component({
  selector: 'lib-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  kind = input<BillStatus>('unsettled');

  defaultLabel(): string {
    const k = this.kind();
    return k.charAt(0).toUpperCase() + k.slice(1);
  }
}
