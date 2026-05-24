import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-split-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="split-bar">
      <div class="seg you" [style.flex]="youPct()"></div>
      <div class="seg partner" [style.flex]="partnerPct()"></div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .split-bar {
      height: 8px;
      border-radius: var(--r-pill);
      display: flex;
      overflow: hidden;
      background: var(--surface-2);
      margin: var(--s-3) 0;
    }
    .seg { height: 100%; }
    .seg.you { background: var(--ink); }
    .seg.partner { background: var(--accent); }
  `,
})
export class SplitBar {
  youPct = input<number>(1);
  partnerPct = input<number>(1);
}
