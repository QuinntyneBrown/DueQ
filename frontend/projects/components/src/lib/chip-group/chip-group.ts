import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-chip-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="chips"><ng-content></ng-content></div>`,
  styles: `
    :host { display: block; }
    .chips {
      display: flex;
      gap: var(--s-2);
      overflow-x: auto;
      padding-bottom: var(--s-1);
      scrollbar-width: none;
    }
    .chips::-webkit-scrollbar { display: none; }
  `,
})
export class ChipGroup {}
