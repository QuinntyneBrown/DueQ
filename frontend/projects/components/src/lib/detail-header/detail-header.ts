import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconTile } from '../icon-tile/icon-tile';
import { Badge } from '../badge/badge';
import { BillStatus } from '../models';

@Component({
  selector: 'lib-detail-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconTile, Badge],
  template: `
    <div class="detail-header">
      <lib-icon-tile [icon]="icon()" kind="bill" [size]="56"></lib-icon-tile>
      <div class="text">
        <div class="title">{{ title() }}</div>
        <div class="meta">
          <lib-badge [kind]="status()"></lib-badge>
          @if (loggedOn()) {
            <span>&nbsp;Logged {{ loggedOn() }}</span>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; margin-bottom: var(--s-4); }
    .detail-header {
      display: flex;
      align-items: center;
      gap: var(--s-4);
    }
    .text { min-width: 0; }
    .title {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .meta {
      font-size: 13px;
      color: var(--muted);
      margin-top: 2px;
      display: flex;
      align-items: center;
    }
  `,
})
export class DetailHeader {
  icon = input.required<string>();
  title = input.required<string>();
  status = input<BillStatus>('unsettled');
  loggedOn = input<string | null>(null);
}
