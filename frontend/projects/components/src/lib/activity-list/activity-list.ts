import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ActivityRow } from '../activity-row/activity-row';
import { ActivityItem } from '../models';

@Component({
  selector: 'lib-activity-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityRow],
  templateUrl: './activity-list.html',
  styleUrl: './activity-list.scss',
})
export class ActivityList {
  items = input.required<ActivityItem[]>();
  rowClick = output<ActivityItem>();
}
