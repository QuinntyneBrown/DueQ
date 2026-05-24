import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BillStatus } from '../models';

@Component({
  selector: 'lib-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="kind()"><ng-content>{{ defaultLabel() }}</ng-content></span>`,
  styles: `
    :host { display: inline-block; }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: var(--r-pill);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      background: var(--surface-2);
      color: var(--ink-2);
      text-transform: uppercase;
    }
    .badge.settled { background: var(--tint-green); color: var(--owed-to-you); }
    .badge.unsettled { background: var(--accent-soft); color: var(--accent); }
    .badge.partial { background: var(--tint-blue); color: var(--tint-blue-ink); }
  `,
})
export class Badge {
  kind = input<BillStatus>('unsettled');

  defaultLabel(): string {
    const k = this.kind();
    return k.charAt(0).toUpperCase() + k.slice(1);
  }
}
