import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ActivityRow } from '../activity-row/activity-row';
import { ActivityItem } from '../models';

@Component({
  selector: 'lib-activity-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityRow],
  template: `
    <div class="card">
      <div class="list">
        @for (item of items(); track item.id) {
          <lib-activity-row [item]="item" (clicked)="rowClick.emit($event)"></lib-activity-row>
        } @empty {
          <div class="empty">No activity yet.</div>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-3);
    }
    .list { display: flex; flex-direction: column; }
    .empty {
      text-align: center;
      padding: var(--s-6) var(--s-4);
      color: var(--muted);
      font-size: 14px;
    }
  `,
})
export class ActivityList {
  items = input.required<ActivityItem[]>();
  rowClick = output<ActivityItem>();
}
