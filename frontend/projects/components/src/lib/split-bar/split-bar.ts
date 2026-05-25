import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-split-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './split-bar.html',
  styleUrl: './split-bar.scss',
})
export class SplitBar {
  youPct = input<number>(1);
  partnerPct = input<number>(1);
}
