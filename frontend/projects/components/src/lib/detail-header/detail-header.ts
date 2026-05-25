import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconTile } from '../icon-tile/icon-tile';
import { Badge } from '../badge/badge';
import { BillStatus } from '../models';

@Component({
  selector: 'lib-detail-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconTile, Badge],
  templateUrl: './detail-header.html',
  styleUrl: './detail-header.scss',
})
export class DetailHeader {
  icon = input.required<string>();
  title = input.required<string>();
  status = input<BillStatus>('unsettled');
  loggedOn = input<string | null>(null);
}
