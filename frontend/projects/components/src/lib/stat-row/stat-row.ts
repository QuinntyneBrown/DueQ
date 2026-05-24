import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-stat-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="stat-row"><ng-content></ng-content></div>`,
  styles: `
    :host { display: block; margin-top: var(--s-4); }
    .stat-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--s-3);
    }
    @media (min-width: 768px) {
      .stat-row { grid-template-columns: repeat(3, 1fr); }
    }
  `,
})
export class StatRow {}
