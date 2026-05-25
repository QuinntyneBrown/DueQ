import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconTile } from '../icon-tile/icon-tile';
import { Badge } from '../badge/badge';
import { BillStatusValue } from '../models';

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
  status = input<BillStatusValue>('unsettled');
  loggedOn = input<string | null>(null);
  titleTestId = input<string | null>(null);
  statusTestId = input<string | null>(null);
}
